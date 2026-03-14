from fastapi import FastAPI, UploadFile, File, Form
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from pdf_reader import extract_text_from_pdf
from logic_engine import validate_application
import httpx
import os
from dotenv import load_dotenv

load_dotenv()

app = FastAPI(
    title="Margdarshak API",
    description="Backend Hub for CSC Operator AI Co-Pilot"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

SARVAM_API_KEY = os.getenv("SARVAM_API_KEY", "")
SARVAM_URL = "https://api.sarvam.ai/v1/chat/completions"
SARVAM_MODEL = "sarvam-30b"

SYSTEM_PROMPT = """You are सहायक (Sahayak), an AI assistant for CSC (Common Service Centre) operators in India.
You help operators resolve document validation errors while processing government applications like
Old Age Pension, Domicile Certificate, Income Certificate, and Caste Certificate.

Rules:
- Always respond in Hindi (Devanagari script)
- Be concise and actionable — operators are busy
- If asked about an error code, explain what went wrong and how to fix it
- You know about Aadhaar, PAN, Voter ID, pension certificates, domicile documents
- Common errors: NAME_MISMATCH (name doesn't match document), AGE_MISMATCH (DOB/age wrong), DOC_UNREADABLE (PDF can't be parsed)
- If you don't know, say so honestly in Hindi
"""

class ChatHelpRequest(BaseModel):
    error_code: str = ""
    message: str = ""

# ---------------------------------------------------------
# ENDPOINT 1: FORM VALIDATION
# ---------------------------------------------------------
@app.post("/validate-form")
async def validate_form(
    name: str = Form(...),
    dob: str = Form(...),
    document: UploadFile = File(...)
):
    file_bytes = await document.read()
    extracted_text = extract_text_from_pdf(file_bytes)
    validation_result = validate_application(extracted_text, name, dob)
    return validation_result

# ---------------------------------------------------------
# ENDPOINT 2: AI CHATBOT (Sarvam AI)
# ---------------------------------------------------------
@app.post("/chat-help")
async def chat_help(request: ChatHelpRequest):
    # Build the user message
    if request.message:
        user_msg = request.message
    elif request.error_code:
        error_descriptions = {
            "NAME_MISMATCH": "Form me bhara hua naam aur uploaded document me naam match nahi ho raha. Kya karu?",
            "AGE_MISMATCH": "Date of birth ya age match nahi ho rahi document se. Kaise fix karu?",
            "DOC_UNREADABLE": "Uploaded PDF document se text nahi nikal pa raha system. Kya problem hai?",
        }
        user_msg = error_descriptions.get(request.error_code, f"Mujhe ye error aa raha hai: {request.error_code}. Iska kya matlab hai?")
    else:
        return {"status": "success", "reply": "कृपया अपना प्रश्न पूछें या त्रुटि कोड भेजें।"}

    try:
        async with httpx.AsyncClient(timeout=30.0) as client:
            resp = await client.post(
                SARVAM_URL,
                headers={
                    "Content-Type": "application/json",
                    "api-subscription-key": SARVAM_API_KEY,
                },
                json={
                    "model": SARVAM_MODEL,
                    "messages": [
                        {"role": "system", "content": SYSTEM_PROMPT},
                        {"role": "user", "content": user_msg},
                    ],
                    "temperature": 0.3,
                    "max_tokens": 300,
                },
            )
            resp.raise_for_status()
            data = resp.json()
            msg = data["choices"][0]["message"]
            reply = msg.get("content") or msg.get("reasoning_content") or "कोई उत्तर नहीं मिला।"
            return {"status": "success", "reply": reply}
    except Exception as e:
        # Fallback to hardcoded responses if API fails
        fallback = {
            "AGE_MISMATCH": "उपयोगकर्ता की आयु इस योजना के लिए योग्य नहीं है। कृपया जन्म तिथि दोबारा जांचें।",
            "NAME_MISMATCH": "आधार कार्ड और भरे गए फॉर्म में नाम मेल नहीं खा रहा है। कृपया स्पेलिंग ठीक करें।",
            "DOC_UNREADABLE": "अपलोड किया गया दस्तावेज़ स्पष्ट नहीं है। कृपया एक साफ कॉपी अपलोड करें।",
        }
        reply = fallback.get(request.error_code, f"AI सर्वर से जुड़ने में त्रुटि: {str(e)}")
        return {"status": "success", "reply": reply}
