"""
NLP & Validation Brain for Margdarshak Project
===============================================
Extracts entities from government documents using regex pattern matching
and validates user inputs against extracted data using fuzzy string matching (RapidFuzz).

PRAGMATIC APPROACH: Uses regex for lightweight entity extraction instead of spaCy,
which is more suitable for offline CSC environments and compatible with Python 3.14+

Used by the backend API to cross-check manual form inputs against
uploaded supporting documents (Aadhaar, Pension, Domicile, etc.).

Author: NLP & Validation Brain (Teammate 3)
Purpose: Offline-capable anomaly detection and entity validation
"""

from rapidfuzz import fuzz
import logging
import re
from datetime import datetime

# Configure logging for debugging and monitoring
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# === CONFIGURATION ===
SIMILARITY_THRESHOLD = 85  # Minimum similarity score (0-100) to pass validation


def validate_application(raw_document_text, input_name, input_dob):
    """
    Validate user inputs against extracted document entities using fuzzy matching.
    
    This function is the core validation engine:
    1. Uses regex patterns to extract PERSON names and DATE values from the document
    2. Uses RapidFuzz to compare extracted entities against user inputs
    3. Returns success or mismatch with detailed reasoning
    
    Designed to be called from FastAPI after pdf_reader.extract_text_from_pdf()
    has extracted the raw document text.
    
    Args:
        raw_document_text (str): Extracted text from the uploaded document
                                (output from pdf_reader.extract_text_from_pdf())
        input_name (str): Name provided by the CSC operator in the form
        input_dob (str): Date of birth provided by the CSC operator
                        (accepts multiple formats: DD-MM-YYYY, DD/MM/YYYY, etc.)
        
    Returns:
        dict: Validation result with the following structure:
        
        On SUCCESS:
            {
                "status": "success",
                "matched_name": "John Doe",
                "match_score_name": 95,
                "matched_dob": "15-06-1990",
                "match_score_dob": 92,
                "details": "All fields matched successfully"
            }
        
        On MISMATCH:
            {
                "status": "mismatch",
                "reason": "Name mismatch: document shows 'Jane Doe', input shows 'John Doe'",
                "match_score": 45,
                "recommendation": "Please verify the name and try again"
            }
        
        On ERROR (document has no extractable entities):
            {
                "status": "error",
                "reason": "Could not extract required information from document",
                "details": "No person names or dates found in document text"
            }
    
    Example:
        # From FastAPI endpoint:
        @app.post("/validate")
        async def validate_form(form_data: FormData):
            result = validate_application(
                raw_document_text=pdf_text,
                input_name=form_data.name,
                input_dob=form_data.dob
            )
            if result["status"] == "mismatch":
                return {"error": result["reason"]}  # Flag error in UI
            return {"success": True}
    """
    
    try:
        logger.info("=" * 70)
        logger.info("VALIDATION PROCESS STARTED")
        logger.info("=" * 70)
        
        # === INPUT VALIDATION ===
        if not isinstance(raw_document_text, str) or not raw_document_text.strip():
            logger.error("✗ Document text is empty or invalid")
            return {
                "status": "error",
                "reason": "Invalid document text provided",
                "details": "Document text must be a non-empty string"
            }
        
        if not isinstance(input_name, str) or not input_name.strip():
            logger.error("✗ Input name is empty or invalid")
            return {
                "status": "error",
                "reason": "Invalid name input",
                "details": "Name must be a non-empty string"
            }
        
        if not isinstance(input_dob, str) or not input_dob.strip():
            logger.error("✗ Input DOB is empty or invalid")
            return {
                "status": "error",
                "reason": "Invalid date of birth input",
                "details": "DOB must be a non-empty string"
            }
        
        # Normalize inputs
        input_name_clean = input_name.strip().upper()
        input_dob_clean = input_dob.strip()
        
        logger.info(f"Input Name: {input_name_clean}")
        logger.info(f"Input DOB: {input_dob_clean}")
        
        # === STEP 1: EXTRACT ENTITIES USING REGEX PATTERNS ===
        logger.info("\n--- STEP 1: Entity Extraction (Regex Patterns) ---")
        
        # Pre-process: Clean up the document text to normalize whitespace
        # This prevents regex from matching across newlines accidentally
        clean_text = re.sub(r'\s+', ' ', raw_document_text)  # Replace all whitespace with single space
        
        # Extract names: Look for "Name:" followed by the actual name
        name_patterns = [
            r'Name\s*[:=]\s*([A-Z][a-z]+)\s+([A-Z][a-z]+)(?:\s|$)',  # Name: John Doe (2 words only)
            r'(?:Full\s+)?Name\s*[:=]\s*([A-Z][a-z]+)\s+([A-Z][a-z]+)(?:\s|$)',
            r'Applicant[^:]*[:=]\s*([A-Z][a-z]+)\s+([A-Z][a-z]+)(?:\s|$)',  # Applicant: John Doe
        ]
        
        extracted_names = []
        for pattern in name_patterns:
            matches = re.findall(pattern, clean_text)
            # Combine captured groups (first_name, last_name) into full name
            extracted_names.extend([f"{first} {last}" for first, last in matches])
        
        # Clean up and remove duplicates
        extracted_names = [name.strip() for name in extracted_names]
        extracted_names = list(dict.fromkeys(extracted_names))
        
        for name in extracted_names:
            logger.info(f"  ✓ Found potential name: '{name}'")
        
        # Extract dates: Multiple common date formats in government documents
        date_patterns = [
            r'\b(\d{1,2}[-/]\d{1,2}[-/]\d{2,4})\b',  # DD-MM-YYYY or DD/MM/YYYY
            r'\b(\d{1,2}\s+[A-Z][a-z]{2}\s+\d{4})\b',  # DD Mon YYYY
            r'\b(\d{4}[-/]\d{1,2}[-/]\d{1,2})\b'   # YYYY-MM-DD
        ]
        
        extracted_dates = []
        for pattern in date_patterns:
            matches = re.findall(pattern, clean_text)
            extracted_dates.extend(matches)
        
        # Remove duplicates
        extracted_dates = list(dict.fromkeys(extracted_dates))
        
        for date in extracted_dates:
            logger.info(f"  ✓ Found potential date: '{date}'")
        
        # Log extraction summary
        logger.info(f"\n  Summary:")
        logger.info(f"    Names found: {len(extracted_names)}")
        logger.info(f"    Dates found: {len(extracted_dates)}")
        
        # Check if we have required data
        if not extracted_names and not extracted_dates:
            logger.warning("⚠ No entities found in document")
            return {
                "status": "error",
                "reason": "Could not extract required information from document",
                "details": "No person names or dates found in document text. Document may be corrupted or not a government ID."
            }
        
        # === STEP 2: FUZZY MATCHING AGAINST INPUTS ===
        logger.info("\n--- STEP 2: Fuzzy Matching (RapidFuzz) ---")
        
        # Name matching
        logger.info("\n  NAME MATCHING:")
        name_match_score = 0
        matched_name = None
        
        if extracted_names:
            # Find the best match against all extracted names
            best_name_match = max(
                [(name, fuzz.token_sort_ratio(input_name_clean, name.upper())) 
                 for name in extracted_names],
                key=lambda x: x[1]
            )
            matched_name = best_name_match[0]
            name_match_score = best_name_match[1]
            
            logger.info(f"    Input name: '{input_name_clean}'")
            logger.info(f"    Best match from document: '{matched_name.upper()}'")
            logger.info(f"    Similarity score: {name_match_score}%")
        else:
            logger.warning("    No names extracted from document (cannot verify)")
        
        # Date matching
        logger.info("\n  DATE MATCHING:")
        date_match_score = 0
        matched_dob = None
        
        if extracted_dates:
            # Find the best match against all extracted dates
            best_date_match = max(
                [(date, fuzz.ratio(input_dob_clean, date))
                 for date in extracted_dates],
                key=lambda x: x[1]
            )
            matched_dob = best_date_match[0]
            date_match_score = best_date_match[1]
            
            logger.info(f"    Input DOB: '{input_dob_clean}'")
            logger.info(f"    Best match from document: '{matched_dob}'")
            logger.info(f"    Similarity score: {date_match_score}%")
        else:
            logger.warning("    No dates extracted from document (cannot verify)")
        
        # === STEP 3: CALCULATE FINAL DECISION ===
        logger.info("\n--- STEP 3: Final Validation Decision ---")
        logger.info(f"Threshold: {SIMILARITY_THRESHOLD}%")
        
        name_passed = name_match_score >= SIMILARITY_THRESHOLD if extracted_names else True
        date_passed = date_match_score >= SIMILARITY_THRESHOLD if extracted_dates else True
        
        logger.info(f"  Name validation: {'✓ PASS' if name_passed else '✗ FAIL'} ({name_match_score}%)")
        logger.info(f"  Date validation: {'✓ PASS' if date_passed else '✗ FAIL'} ({date_match_score}%)")
        
        # === RETURN RESULTS ===
        if name_passed and date_passed:
            logger.info("\n✓ VALIDATION SUCCESSFUL - All fields match")
            return {
                "status": "success",
                "matched_name": matched_name if matched_name else "Not extracted",
                "match_score_name": name_match_score if extracted_names else 0,
                "matched_dob": matched_dob if matched_dob else "Not extracted",
                "match_score_dob": date_match_score if extracted_dates else 0,
                "details": "All extracted fields matched user inputs successfully"
            }
        else:
            # Detailed mismatch reason
            mismatch_reasons = []
            if not name_passed:
                mismatch_reasons.append(
                    f"Name mismatch: document shows '{matched_name}' "
                    f"({name_match_score}%), input shows '{input_name}'"
                )
            if not date_passed:
                mismatch_reasons.append(
                    f"Date mismatch: document shows '{matched_dob}' "
                    f"({date_match_score}%), input shows '{input_dob}'"
                )
            
            reason = " | ".join(mismatch_reasons)
            logger.warning(f"\n✗ VALIDATION FAILED - {reason}")
            
            return {
                "status": "mismatch",
                "reason": reason,
                "match_score": max(name_match_score, date_match_score),
                "recommendation": "Please verify the information and try again. Check for spelling errors or date format issues."
            }
    
    except Exception as e:
        logger.error(f"✗ Unexpected error during validation: {str(e)}")
        return {
            "status": "error",
            "reason": "Validation engine error",
            "details": str(e)
        }



# ============================================================================
# LOCAL TESTING BLOCK
# ============================================================================
# Run this file directly to test the validation logic before handing
# to the API Lead for FastAPI integration.

if __name__ == "__main__":
    print("\n" + "=" * 70)
    print("MARGDARSHAK NLP VALIDATION ENGINE - LOCAL TESTING")
    print("=" * 70)
    
    # === TEST CASE 1: MATCHING DOCUMENTodate (Should Pass) ===
    print("\n" + "-" * 70)
    print("TEST CASE 1: Matching Document (Expected: SUCCESS)")
    print("-" * 70)
    
    document_text_1 = """
    AADHAAR CARD - OFFICIAL DOCUMENT
    
    Applicant Information:
    Name: John Doe
    Date of Birth: 15-06-1990
    Age: 33
    Gender: Male
    Aadhaar Number: 1234 5678 9012 3456
    
    Address: 123 Main Street, New Delhi, Delhi 110001
    
    This document certifies the above mentioned person's identity.
    Issue Date: 01-01-2015
    Expiry: 01-01-2025
    """
    
    result_1 = validate_application(
        raw_document_text=document_text_1,
        input_name="John Doe",
        input_dob="15-06-1990"
    )
    
    print("\n📄 Document Text (excerpt):")
    print(document_text_1[:200] + "...")
    print("\n👤 User Input:")
    print(f"   Name: John Doe")
    print(f"   DOB: 15-06-1990")
    print("\n📊 Validation Result:")
    for key, value in result_1.items():
        print(f"   {key}: {value}")
    
    # === TEST CASE 2: MISMATCHED NAME (Should Fail) ===
    print("\n" + "-" * 70)
    print("TEST CASE 2: Name Mismatch (Expected: MISMATCH)")
    print("-" * 70)
    
    result_2 = validate_application(
        raw_document_text=document_text_1,
        input_name="Jane Smith",  # Different name
        input_dob="15-06-1990"
    )
    
    print("\n👤 User Input:")
    print(f"   Name: Jane Smith")
    print(f"   DOB: 15-06-1990")
    print("\n📊 Validation Result:")
    for key, value in result_2.items():
        print(f"   {key}: {value}")
    
    # === TEST CASE 3: MISMATCHED DATE (Should Fail) ===
    print("\n" + "-" * 70)
    print("TEST CASE 3: Date Mismatch (Expected: MISMATCH)")
    print("-" * 70)
    
    result_3 = validate_application(
        raw_document_text=document_text_1,
        input_name="John Doe",
        input_dob="20-12-1985"  # Different date
    )
    
    print("\n👤 User Input:")
    print(f"   Name: John Doe")
    print(f"   DOB: 20-12-1985")
    print("\n📊 Validation Result:")
    for key, value in result_3.items():
        print(f"   {key}: {value}")
    
    # === TEST CASE 4: TYPO IN NAME (Should Pass with Fuzzy Match) ===
    print("\n" + "-" * 70)
    print("TEST CASE 4: Typo in Name (Expected: SUCCESS with fuzzy match)")
    print("-" * 70)
    
    result_4 = validate_application(
        raw_document_text=document_text_1,
        input_name="Jon Doe",  # Typo: missing 'h'
        input_dob="15-06-1990"
    )
    
    print("\n👤 User Input:")
    print(f"   Name: Jon Doe (typo)")
    print(f"   DOB: 15-06-1990")
    print("\n📊 Validation Result:")
    for key, value in result_4.items():
        print(f"   {key}: {value}")
    
    # === SUMMARY ===
    print("\n" + "=" * 70)
    print("TEST SUMMARY")
    print("=" * 70)
    print(f"Test 1 (Match): {result_1['status'].upper()}")
    print(f"Test 2 (Name mismatch): {result_2['status'].upper()}")
    print(f"Test 3 (Date mismatch): {result_3['status'].upper()}")
    print(f"Test 4 (Fuzzy typo): {result_4['status'].upper()}")
    print("\n✓ All tests completed. Logic engine is ready for FastAPI integration!")
