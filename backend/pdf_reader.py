"""
PDF Text Extractor for Margdarshak Project
===========================================
Extracts text from PDF files (provided as bytes) using PyMuPDF.
Used by Document Extractor module to process uploaded supporting documents
(Aadhaar, Pension certificates, Domicile documents, etc.).

Author: Document Extractor (Teammate 2)
Purpose: Server-side document parsing for offline-capable CSC validation system
"""

import fitz  # PyMuPDF
import io
import logging
from PIL import Image
import pytesseract

# Configure logging for debugging and monitoring
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


def extract_text_from_pdf(pdf_bytes):
    """
    Extract all text from a PDF file provided as raw bytes.
    
    This function is designed to be called from a FastAPI endpoint that receives
    uploaded PDF files via multipart/form-data. It processes all pages sequentially
    and returns the combined text as a single string for downstream NLP processing.
    
    Args:
        pdf_bytes (bytes): The raw bytes of the PDF file from the HTTP upload.
        
    Returns:
        str: Extracted text from all pages, cleaned and concatenated with 
             page break delimiters for clarity.
        
    Raises:
        ValueError: If the provided bytes are not a valid PDF or are empty.
        Exception: For other unexpected PDF processing errors.
        
    Example:
        # From FastAPI endpoint:
        @app.post("/extract-pdf")
        async def handle_pdf_upload(file: UploadFile = File(...)):
            pdf_bytes = await file.read()
            extracted_text = extract_text_from_pdf(pdf_bytes)
            # Pass to spaCy for entity extraction...
    """
    
    try:
        # === INPUT VALIDATION ===
        if not isinstance(pdf_bytes, bytes):
            raise ValueError(
                "Input must be bytes. Ensure the PDF is passed as raw bytes from the upload."
            )
        
        if len(pdf_bytes) == 0:
            raise ValueError("PDF bytes are empty. Check the file upload.")
        
        # === OPEN PDF FROM BYTES ===
        # PyMuPDF's fitz.open() can read from a bytes stream via io.BytesIO
        # This avoids writing to disk and keeps the operation in-memory
        pdf_stream = io.BytesIO(pdf_bytes)
        document = fitz.open(stream=pdf_stream, filetype="pdf")
        
        logger.info(f"PDF opened successfully. Total pages: {len(document)}")
        
        # === EXTRACT TEXT FROM ALL PAGES ===
        extracted_text = []
        
        for page_num in range(len(document)):
            try:
                page = document[page_num]
                # Extract text using the default method (preserves layout)
                page_text = page.get_text()
                
                if page_text.strip():  # Text-based PDF
                    extracted_text.append(page_text)
                    logger.info(f"✓ Extracted text from page {page_num + 1}")
                else:
                    # OCR fallback for scanned/image-only pages
                    logger.info(f"⚠ Page {page_num + 1} has no text, trying OCR...")
                    try:
                        pix = page.get_pixmap(dpi=300)
                        img = Image.open(io.BytesIO(pix.tobytes("png")))
                        ocr_text = pytesseract.image_to_string(img, lang="eng")
                        if ocr_text.strip():
                            extracted_text.append(ocr_text)
                            logger.info(f"✓ OCR extracted text from page {page_num + 1}")
                        else:
                            logger.warning(f"⚠ OCR returned empty for page {page_num + 1}")
                    except Exception as ocr_err:
                        logger.warning(f"⚠ OCR failed on page {page_num + 1}: {ocr_err}")
                    
            except Exception as e:
                logger.error(
                    f"✗ Error extracting text from page {page_num + 1}: {str(e)}"
                )
                # Continue processing other pages even if one fails
                continue
        
        # === CLEANUP ===
        document.close()
        
        # === COMBINE AND RETURN ===
        # Join pages with clear separators for downstream processing
        final_text = "\n\n--- PAGE BREAK ---\n\n".join(extracted_text)
        
        if not final_text.strip():
            logger.warning("⚠ No text could be extracted from the PDF")
            return ""
        
        logger.info(
            f"✓ PDF processing complete. Extracted {len(final_text)} characters "
            f"from {len(extracted_text)} pages"
        )
        return final_text
        
    # === ERROR HANDLING ===
    except ValueError as ve:
        logger.error(f"✗ Validation error: {str(ve)}")
        raise
    except fitz.FileError as fe:
        logger.error(f"✗ PDF read error (corrupted or invalid file): {str(fe)}")
        raise ValueError("The file is not a valid PDF or is corrupted.")
    except Exception as e:
        logger.error(f"✗ Unexpected error during PDF extraction: {str(e)}")
        raise


# ============================================================================
# LOCAL TESTING BLOCK
# ============================================================================
# Run this file directly to test with a locally stored PDF before handing
# the function to the API Lead for FastAPI integration.

if __name__ == "__main__":
    import os
    
    print("=" * 70)
    print("MARGDARSHAK PDF EXTRACTOR - LOCAL TESTING")
    print("=" * 70)
    
    # === TEST CONFIGURATION ===
    # Replace this with the path to a real PDF file on your machine
    test_pdf_path = "test_document.pdf"
    
    print(f"\nLooking for test PDF at: {test_pdf_path}")
    
    if os.path.exists(test_pdf_path):
        try:
            # === SIMULATE FastAPI FILE UPLOAD ===
            # Read the test PDF as bytes (exactly as FastAPI would receive it)
            with open(test_pdf_path, 'rb') as pdf_file:
                pdf_bytes = pdf_file.read()
            
            print(f"✓ Test PDF loaded successfully")
            print(f"  File size: {len(pdf_bytes):,} bytes\n")
            
            # === CALL THE FUNCTION ===
            print("Calling extract_text_from_pdf()...\n")
            extracted_text = extract_text_from_pdf(pdf_bytes)
            
            # === DISPLAY RESULTS ===
            print("\n" + "=" * 70)
            print("✓ EXTRACTION SUCCESSFUL")
            print("=" * 70)
            print(f"Total text length: {len(extracted_text):,} characters")
            print(f"Number of lines: {len(extracted_text.splitlines()):,}")
            print(f"Number of pages extracted: {extracted_text.count('--- PAGE BREAK ---') + 1}")
            
            print("\n" + "-" * 70)
            print("EXTRACTED TEXT PREVIEW (first 600 characters):")
            print("-" * 70)
            preview = extracted_text[:600]
            print(preview)
            if len(extracted_text) > 600:
                print(f"\n... ({len(extracted_text) - 600:,} more characters)")
            print("-" * 70)
            
        except Exception as e:
            print(f"\n✗ Error during test: {str(e)}")
            print("\nFix: Make sure test_document.pdf exists in the same directory")
    else:
        print(f"\n⚠ Test file not found: '{test_pdf_path}'")
        print("\n" + "=" * 70)
        print("TO RUN THE TEST:")
        print("=" * 70)
        print("1. Place a PDF file named 'test_document.pdf' in this directory")
        print("   (You can use any PDF: Aadhaar, pension certificate, etc.)")
        print("2. Run:  python pdf_reader.py")
        print("3. Review the extracted text output")
        print("\nNOTE: The function is ready to use with FastAPI!")
        print("      No test file is required for production deployment.")
