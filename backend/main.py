from fastapi import FastAPI, UploadFile, File, Form
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

# Initialize the FastAPI app
app = FastAPI(
    title="Margdarshak API",
    description="Backend Hub for CSC Operator AI Co-Pilot"
)

# ---------------------------------------------------------
# 1. CORS SETUP
# ---------------------------------------------------------
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://127.0.0.1:5173"], 
    allow_credentials=True,
    allow_methods=["*"], 
    allow_headers=["*"],
)

class ChatHelpRequest(BaseModel):
    error_code: str

# ---------------------------------------------------------
# 2. ENDPOINT 1: FORM VALIDATION
# ---------------------------------------------------------
@app.post("/validate-form")
async def validate_form(
    name: str = Form(...),
    dob: str = Form(...),
    document: UploadFile = File(...)
):
    file_bytes = await document.read()
    
    # 🛑 TEAMMATE LOGIC INTEGRATION ZONE 🛑
    # extracted_text = extract_text_from_pdf(file_bytes)
    # validation_result = validate_application(extracted_text, name, dob)
    
    return {
        "status": "warning",
        "error_code": "NAME_MISMATCH",
        "message": f"Name mismatch detected. The name '{name}' does not confidently match the uploaded document."
    }

# ---------------------------------------------------------
# 3. ENDPOINT 2: CHATBOT ASSISTANT
# ---------------------------------------------------------
@app.post("/chat-help")
async def chat_help(request: ChatHelpRequest):
    responses = {
        "AGE_MISMATCH": "उपयोगकर्ता की आयु इस योजना के लिए योग्य नहीं है। कृपया जन्म तिथि दोबारा जांचें।",
        "NAME_MISMATCH": "आधार कार्ड और भरे गए फॉर्म में नाम मेल नहीं खा रहा है। कृपया स्पेलिंग ठीक करें।",
        "DOC_UNREADABLE": "अपलोड किया गया दस्तावेज़ स्पष्ट नहीं है। कृपया एक साफ कॉपी अपलोड करें।"
    }
    
    return {
        "status": "success",
        "reply": responses.get(request.error_code, "मुझे इस त्रुटि के बारे में समझ नहीं आ रहा है। कृपया फिर से प्रयास करें।")
    }