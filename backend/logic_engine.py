"""
NLP & Validation Brain for Margdarshak Project
===============================================
Extracts entities from government documents using spaCy NER
and validates user inputs against extracted data using fuzzy string matching (RapidFuzz).

Used by the backend API to cross-check manual form inputs against
uploaded supporting documents (Aadhaar, Pension, Domicile, etc.).
"""

import spacy
from rapidfuzz import fuzz
import logging
import re

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

SIMILARITY_THRESHOLD = 85

# Load spaCy model
try:
    nlp = spacy.load("en_core_web_sm")
    logger.info("spaCy en_core_web_sm loaded")
except OSError:
    logger.error("spaCy model not found. Run: python -m spacy download en_core_web_sm")
    nlp = None


NOISE_WORDS = re.compile(
    r'\b(?:Date|DOB|Birth|Age|Gender|Aadhaar|Address|Father|Mother|'
    r'Husband|Wife|Male|Female|Number|Card|Document|Official|Information|'
    r'Applicant|Certificate|Issue|Expiry|of)\b',
    re.IGNORECASE,
)


def _extract_names_spacy(text):
    """Extract PERSON entities via spaCy NER, with noise cleanup."""
    if not nlp:
        return []
    doc = nlp(text[:5000])
    raw = [ent.text.strip() for ent in doc.ents if ent.label_ == "PERSON"]
    # Strip field labels that spaCy accidentally gobbles into PERSON spans
    cleaned = []
    for name in raw:
        name = NOISE_WORDS.sub('', name).strip()
        name = re.sub(r'\s{2,}', ' ', name).strip()
        if len(name) >= 3:
            cleaned.append(name)
    return list(dict.fromkeys(cleaned))


def _extract_dates_spacy(text):
    """Extract DATE entities via spaCy NER."""
    if not nlp:
        return []
    doc = nlp(text[:5000])
    dates = [ent.text.strip() for ent in doc.ents if ent.label_ == "DATE"]
    return list(dict.fromkeys(dates))


def _extract_dates_regex(text):
    """Fallback regex date extraction for structured government docs."""
    patterns = [
        r'\b(\d{1,2}[-/]\d{1,2}[-/]\d{2,4})\b',
        r'\b(\d{1,2}\s+[A-Z][a-z]{2}\s+\d{4})\b',
        r'\b(\d{4}[-/]\d{1,2}[-/]\d{1,2})\b',
    ]
    dates = []
    for p in patterns:
        dates.extend(re.findall(p, text))
    return list(dict.fromkeys(dates))


def validate_application(raw_document_text, input_name, input_dob):
    """
    Validate user inputs against document entities using spaCy NER + RapidFuzz.

    Same interface as before — drop-in replacement.

    Returns:
        dict with status "success", "mismatch", or "error"
    """
    try:
        if not isinstance(raw_document_text, str) or not raw_document_text.strip():
            return {"status": "error", "reason": "Invalid document text provided", "details": "Document text must be a non-empty string"}
        if not isinstance(input_name, str) or not input_name.strip():
            return {"status": "error", "reason": "Invalid name input", "details": "Name must be a non-empty string"}
        if not isinstance(input_dob, str) or not input_dob.strip():
            return {"status": "error", "reason": "Invalid date of birth input", "details": "DOB must be a non-empty string"}
        if not nlp:
            return {"status": "error", "reason": "NLP model not loaded", "details": "Run: python -m spacy download en_core_web_sm"}

        input_name_clean = input_name.strip().upper()
        input_dob_clean = input_dob.strip()

        logger.info(f"Validating — Name: {input_name_clean}, DOB: {input_dob_clean}")

        # === STEP 1: Entity extraction via spaCy ===
        clean_text = re.sub(r'\s+', ' ', raw_document_text)

        extracted_names = _extract_names_spacy(clean_text)
        logger.info(f"spaCy names: {extracted_names}")

        # For dates, spaCy + regex fallback (spaCy often returns "33" for age as DATE)
        extracted_dates = _extract_dates_spacy(clean_text)
        regex_dates = _extract_dates_regex(clean_text)
        # Merge, prefer regex dates (more precise for DD-MM-YYYY) then spaCy
        all_dates = list(dict.fromkeys(regex_dates + extracted_dates))
        logger.info(f"Dates (regex+spaCy): {all_dates}")

        if not extracted_names and not all_dates:
            return {
                "status": "error",
                "reason": "Could not extract required information from document",
                "details": "No person names or dates found in document text."
            }

        # === STEP 2: Fuzzy matching ===
        name_match_score = 0
        matched_name = None

        if extracted_names:
            best = max(
                [(n, fuzz.token_sort_ratio(input_name_clean, n.upper())) for n in extracted_names],
                key=lambda x: x[1]
            )
            matched_name, name_match_score = best
            logger.info(f"Name match: '{matched_name}' — {name_match_score}%")

        date_match_score = 0
        matched_dob = None

        if all_dates:
            best = max(
                [(d, fuzz.ratio(input_dob_clean, d)) for d in all_dates],
                key=lambda x: x[1]
            )
            matched_dob, date_match_score = best
            logger.info(f"DOB match: '{matched_dob}' — {date_match_score}%")

        # === STEP 3: Decision ===
        name_passed = name_match_score >= SIMILARITY_THRESHOLD if extracted_names else True
        date_passed = date_match_score >= SIMILARITY_THRESHOLD if all_dates else True

        if name_passed and date_passed:
            return {
                "status": "success",
                "matched_name": matched_name or "Not extracted",
                "match_score_name": name_match_score if extracted_names else 0,
                "matched_dob": matched_dob or "Not extracted",
                "match_score_dob": date_match_score if all_dates else 0,
                "details": "All extracted fields matched user inputs successfully"
            }
        else:
            reasons = []
            if not name_passed:
                reasons.append(f"Name mismatch: document shows '{matched_name}' ({name_match_score}%), input shows '{input_name}'")
            if not date_passed:
                reasons.append(f"Date mismatch: document shows '{matched_dob}' ({date_match_score}%), input shows '{input_dob}'")

            return {
                "status": "mismatch",
                "reason": " | ".join(reasons),
                "match_score": max(name_match_score, date_match_score),
                "recommendation": "Please verify the information and try again. Check for spelling errors or date format issues."
            }

    except Exception as e:
        logger.error(f"Validation error: {str(e)}")
        return {"status": "error", "reason": "Validation engine error", "details": str(e)}
