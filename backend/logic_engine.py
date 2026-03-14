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
ADDRESS_THRESHOLD = 90

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


FIELD_BOUNDARY = r'(?=\s*(?:Father|Mother|Husband|Wife|Date|DOB|Gender|Address|Aadhaar|Mobile|Phone|Certificate|District|Village|State|Pin|$))'

def _extract_names_regex(text):
    """Primary name extraction for structured govt docs with 'Name: ...' fields."""
    patterns = [
        r'(?:Applicant\s+)?Name\s*[:\-]\s*(?:Shri\s+|Smt\.?\s+|Mr\.?\s+|Mrs\.?\s+|Ms\.?\s+)?([A-Z][a-z]+(?:\s+[A-Z][a-z]+){1,4})' + FIELD_BOUNDARY,
        r'Father(?:\'?s?)?\s*Name\s*[:\-]\s*(?:Shri\s+|Smt\.?\s+|Mr\.?\s+)?([A-Z][a-z]+(?:\s+[A-Z][a-z]+){1,4})' + FIELD_BOUNDARY,
        r'Mother(?:\'?s?)?\s*Name\s*[:\-]\s*(?:Smt\.?\s+|Mrs\.?\s+)?([A-Z][a-z]+(?:\s+[A-Z][a-z]+){1,4})' + FIELD_BOUNDARY,
    ]
    names = []
    for p in patterns:
        matches = re.findall(p, text)
        names.extend(m.strip() for m in matches if len(m.strip()) >= 3)
    return list(dict.fromkeys(names))


def _extract_all_fields(text):
    """Extract ALL verifiable fields from structured govt docs."""
    fields = {}

    # --- Names ---
    name_patterns = {
        "father_name": r'Father(?:\'?s?)?\s*Name\s*[:\-]\s*(?:Shri\s+|Smt\.?\s+|Mr\.?\s+|Late\s+)?([A-Z][a-z]+(?:\s+[A-Z][a-z]+){1,4})' + FIELD_BOUNDARY,
        "mother_name": r'Mother(?:\'?s?)?\s*Name\s*[:\-]\s*(?:Smt\.?\s+|Mrs\.?\s+|Late\s+)?([A-Z][a-z]+(?:\s+[A-Z][a-z]+){1,4})' + FIELD_BOUNDARY,
        "husband_name": r'(?:Husband|Spouse)(?:\'?s?)?\s*Name\s*[:\-]\s*(?:Shri\s+|Mr\.?\s+)?([A-Z][a-z]+(?:\s+[A-Z][a-z]+){1,4})' + FIELD_BOUNDARY,
    }
    for field, pattern in name_patterns.items():
        match = re.search(pattern, text)
        if match:
            fields[field] = match.group(1).strip()

    # --- Gender ---
    gender_match = re.search(r'Gender\s*[:\-]\s*(Male|Female|Other|Trans)', text, re.IGNORECASE)
    if gender_match:
        fields["gender"] = gender_match.group(1).strip()

    # --- Aadhaar ---
    aadhaar_match = re.search(r'Aadhaar\s*(?:Number|No\.?)?\s*[:\-]?\s*(\d{4}\s*\d{4}\s*\d{4})', text)
    if aadhaar_match:
        fields["aadhaar"] = aadhaar_match.group(1).replace(" ", "")

    # --- Mobile ---
    mobile_match = re.search(r'(?:Mobile|Phone|Contact)\s*(?:Number|No\.?)?\s*[:\-]?\s*(\d{10})', text)
    if mobile_match:
        fields["mobile"] = mobile_match.group(1)

    # --- Caste/Category ---
    caste_match = re.search(r'(?:Caste|Category)\s*[:\-]\s*([A-Za-z][A-Za-z\s/]{1,40}?)(?=\s*[,\n]|\s+(?:Sub|Religion|Father|Address|$))', text)
    if caste_match:
        fields["caste"] = caste_match.group(1).strip()

    # --- Religion ---
    religion_match = re.search(r'Religion\s*[:\-]\s*([A-Za-z]+)', text)
    if religion_match:
        fields["religion"] = religion_match.group(1).strip()

    # --- Income ---
    income_match = re.search(r'Annual\s+Income\s*[:\-]\s*(?:Rs\.?\s*)?(\d[\d,]+)', text)
    if not income_match:
        income_match = re.search(r'Income\s*[:\-]\s*(?:Rs\.?\s*)?(\d[\d,]+)', text)
    if income_match:
        fields["annual_income"] = income_match.group(1).replace(",", "")

    logger.info(f"All extracted fields: {fields}")
    return fields


def _extract_address_fields(text):
    """Extract address components from structured govt docs."""
    fields = {}
    patterns = {
        "village": r'(?:Village|Gram)\s*[:\-]?\s*([A-Za-z][A-Za-z\s]{2,30}?)(?=\s*[,\n]|\s+(?:Post|Tehsil|District|Block|Police|State|Pin|$))',
        "post_office": r'Post\s*(?:Office)?\s*[:\-]?\s*([A-Za-z][A-Za-z\s]{2,30}?)(?=\s*[,\n]|\s+(?:Tehsil|District|Block|Police|State|Pin|$))',
        "tehsil": r'Tehsil\s*[:\-]?\s*([A-Za-z][A-Za-z\s]{2,30}?)(?=\s*[,\n]|\s+(?:District|Block|Police|State|Pin|$))',
        "district": r'District\s*[:\-]?\s*([A-Za-z][A-Za-z\s]{2,30}?)(?=\s*[,\n]|\s+(?:State|Pin|Uttar|Madhya|Andhra|Arunachal|Assam|Bihar|Chhattisgarh|Goa|Gujarat|Haryana|Himachal|Jharkhand|Karnataka|Kerala|Maharashtra|Manipur|Meghalaya|Mizoram|Nagaland|Odisha|Punjab|Rajasthan|Sikkim|Tamil|Telangana|Tripura|West|$))',
        "state": r'(?:State\s*[:\-]?\s*|,\s*)([A-Z][a-z]+(?:\s+[A-Z][a-z]+)?)\s*[-–]?\s*\d{6}',
        "pincode": r'(?:Pin\s*(?:Code)?\s*[:\-]?\s*|[-–]\s*)(\d{6})\b',
    }
    for field, pattern in patterns.items():
        match = re.search(pattern, text)
        if match:
            fields[field] = match.group(1).strip()
    logger.info(f"Address fields extracted: {fields}")
    return fields


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


def validate_application(raw_document_text, input_name, input_dob, input_address=None, input_fields=None):
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

        spacy_names = _extract_names_spacy(clean_text)
        regex_names = _extract_names_regex(clean_text)
        # Prefer regex names (more precise for structured docs) then spaCy
        extracted_names = list(dict.fromkeys(regex_names + spacy_names))
        logger.info(f"Names (regex: {regex_names}, spaCy: {spacy_names}) → merged: {extracted_names}")

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

        # === STEP 3: Address validation ===
        address_results = {}
        if input_address and isinstance(input_address, dict):
            doc_address = _extract_address_fields(clean_text)
            for field, input_val in input_address.items():
                if not input_val or not input_val.strip():
                    continue
                doc_val = doc_address.get(field, "")
                if doc_val:
                    score = fuzz.token_sort_ratio(input_val.strip().upper(), doc_val.upper())
                    address_results[field] = {
                        "input": input_val.strip(),
                        "document": doc_val,
                        "score": score,
                        "passed": score >= ADDRESS_THRESHOLD,
                    }
                    logger.info(f"Address {field}: '{input_val.strip()}' vs '{doc_val}' → {score}%")

        # === STEP 3b: Extra field validation ===
        field_results = {}
        if input_fields and isinstance(input_fields, dict):
            doc_fields = _extract_all_fields(clean_text)
            for field, input_val in input_fields.items():
                if not input_val or not input_val.strip():
                    continue
                doc_val = doc_fields.get(field, "")
                if doc_val:
                    # For aadhaar/pincode use exact match, for others use fuzzy
                    if field in ("aadhaar", "mobile"):
                        clean_input = re.sub(r'\s+', '', input_val.strip())
                        clean_doc = re.sub(r'\s+', '', doc_val)
                        score = 100.0 if clean_input == clean_doc else 0.0
                    elif field == "gender":
                        score = 100.0 if input_val.strip().lower() == doc_val.lower() else 0.0
                    else:
                        score = fuzz.token_sort_ratio(input_val.strip().upper(), doc_val.upper())
                    field_results[field] = {
                        "input": input_val.strip(),
                        "document": doc_val,
                        "score": score,
                        "passed": score >= SIMILARITY_THRESHOLD,
                    }
                    logger.info(f"Field {field}: '{input_val.strip()}' vs '{doc_val}' → {score}%")

        failed_fields = {k: v for k, v in field_results.items() if not v["passed"]}

        # === STEP 4: Decision ===
        name_passed = name_match_score >= SIMILARITY_THRESHOLD if extracted_names else True
        date_passed = date_match_score >= SIMILARITY_THRESHOLD if all_dates else True
        address_failed = {k: v for k, v in address_results.items() if not v["passed"]}

        all_extra = {**address_results, **field_results}
        all_failed = {**address_failed, **failed_fields}

        if name_passed and date_passed and not all_failed:
            return {
                "status": "success",
                "matched_name": matched_name or "Not extracted",
                "match_score_name": name_match_score if extracted_names else 0,
                "matched_dob": matched_dob or "Not extracted",
                "match_score_dob": date_match_score if all_dates else 0,
                "address_results": all_extra,
                "details": "All extracted fields matched user inputs successfully"
            }
        else:
            reasons = []
            if not name_passed:
                reasons.append(f"Name mismatch: document shows '{matched_name}' ({name_match_score}%), input shows '{input_name}'")
            if not date_passed:
                reasons.append(f"Date mismatch: document shows '{matched_dob}' ({date_match_score}%), input shows '{input_dob}'")
            for field, info in all_failed.items():
                label = field.replace("_", " ").title()
                reasons.append(f"{label} mismatch: document shows '{info['document']}' ({info['score']}%), input shows '{info['input']}'")

            return {
                "status": "mismatch",
                "reason": " | ".join(reasons),
                "match_score": max(name_match_score, date_match_score),
                "address_results": all_extra,
                "recommendation": "Please verify the information and try again. Check for spelling errors or date format issues."
            }

    except Exception as e:
        logger.error(f"Validation error: {str(e)}")
        return {"status": "error", "reason": "Validation engine error", "details": str(e)}
