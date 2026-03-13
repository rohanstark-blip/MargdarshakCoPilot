# Margdarshak Backend Engine

**Offline-capable FastAPI validation engine for government form processing**

## 📋 Features

- **PDF Document Ingestion**: Extract text from Aadhaar, Passport, Voter ID, etc. using PyMuPDF
- **NLP Entity Extraction**: Identify names, dates, and other entities using spaCy
- **Fuzzy String Matching**: Compare form inputs to extracted data with RapidFuzz (configurable thresholds)
- **Real-Time Anomaly Detection**: Flag mismatches before submission (age, name, DOB, eligibility)
- **Hindi Guidance System**: Contextual error messages in Hindi/local language
- **Fully Offline**: No API calls, everything runs locally (works on 2G/slow internet)
- **CORS Enabled**: Ready to integrate with React frontend

---

## 🚀 Quick Start

### 1. **Navigate to Backend Folder**
```bash
cd backend
```

### 2. **Run Setup Script** (Windows)
```bash
setup.bat
```

**OR Manual Setup:**
```bash
python -m venv venv
venv\Scripts\activate.bat
pip install -r requirements.txt
python -m spacy download en_core_web_sm
```

### 3. **Start FastAPI Server**
```bash
venv\Scripts\activate.bat
python main.py
```

Server starts at: **http://localhost:8000**

---

## 📡 API Endpoints

### 1. **Health Check**
```http
GET /health
```
Returns server status and NLP model status.

---

### 2. **Validate Form** (Main Endpoint)
```http
POST /validate
```

**Request** (multipart/form-data):
```json
{
  "applicant_name": "Raj Kumar",
  "applicant_dob": "1985-05-15",
  "applicant_age": 39,
  "service_type": "Old Age Pension",
  "document_type": "Aadhaar PDF",
  "pdf_file": <binary PDF>
}
```

**Response** (Success):
```json
{
  "status": "success",
  "matches": {
    "name": {
      "form_input": "Raj Kumar",
      "pdf_extracted": "Raj Kumar",
      "match_score": 100
    },
    "dob": {
      "form_input": "1985-05-15",
      "pdf_extracted": "05-May-1985",
      "match_score": 92
    },
    "age": {
      "form_input": 39,
      "calculated_from_dob": 39
    },
    "service_type": "Old Age Pension"
  },
  "mismatches": [],
  "error_code": null,
  "hindi_guidance": null
}
```

**Response** (Mismatch Detected):
```json
{
  "status": "mismatch",
  "matches": {
    "name": {
      "form_input": "Raj Kumar",
      "pdf_extracted": "Raj Kumar Singh",
      "match_score": 85
    }
  },
  "mismatches": [
    {
      "field": "Name",
      "form_value": "Raj Kumar",
      "pdf_value": "Raj Kumar Singh",
      "match_score": 85,
      "severity": "high"
    }
  ],
  "error_code": "NAME_MISMATCH",
  "hindi_guidance": "नाम का मिलान नहीं हुआ। कृपया आवेदक का नाम दस्तावेज़ के अनुसार सही तरीके से दर्ज करें।"
}
```

---

### 3. **Chat Help** (Hindi Guidance)
```http
POST /chat-help
```

**Request**:
```json
{
  "error_code": "AGE_MISMATCH",
  "service_type": "Old Age Pension"
}
```

**Response**:
```json
{
  "error_code": "AGE_MISMATCH",
  "hindi_text": "उम्र का मिलान नहीं हुआ। जन्म तारीख से गणना की गई उम्र दर्ज की गई उम्र से अलग है।",
  "english_text": "Age does not match. The age calculated from DOB differs from the entered age."
}
```

---

## 🔍 Validation Logic

| Field | Validation Method | Threshold |
|-------|-------------------|-----------|
| **Name** | Fuzzy token-set matching | 85% |
| **DOB** | Fuzzy date matching | 80% |
| **Age** | Calculate from DOB, compare ±2 years | ±2 years |
| **Eligibility** | Service-specific rules (e.g., Old Age Pension: age ≥ 60) | Strict |

---

## 📋 Service Eligibility Rules

```python
"Old Age Pension" → Age ≥ 60
"Disability Pension" → Age ≥ 18 (any age)
"Scholarship (SC/ST/OBC)" → Age ≤ 25
"Widow Pension" → Age ≥ 25
"Domicile Certificate" → No age restriction
"Aadhaar Update" → No age restriction
"Income Certificate" → No age restriction
```

---

## 🧠 NLP Entity Types (spaCy)

The backend extracts:
- **PERSON**: Applicant names
- **DATE**: Birth dates, submission dates
- **ORG**: Organizations (if present)
- **GPE**: Geopolitical entities (states, districts)

---

## 🛠️ Troubleshooting

### ❌ "spaCy model not found"
```bash
python -m spacy download en_core_web_sm
```

### ❌ "Port 8000 already in use"
```bash
# Use a different port:
python -c "import uvicorn; uvicorn.run('main:app', host='0.0.0.0', port=8001)"
```

### ❌ "PDF processing error"
Ensure the PDF:
- Is a valid PDF file (not corrupted)
- Contains extractable text (not just scanned images without OCR)
- Is under 10 MB

---

## 📊 Performance Metrics

- **PDF Processing**: ~200-500ms per document
- **Entity Extraction**: ~50-100ms
- **Fuzzy Matching**: ~10-50ms
- **Total Response Time**: ~300-650ms (depending on PDF size)
- **Memory Usage**: ~300MB (with spaCy model loaded)

---

## 🔐 Security Notes

- **No Authentication**: For offline use in CSC centers. Add authentication if deployed remotely.
- **File Size Limit**: Currently accepts PDFs up to 10MB (configurable in main.py)
- **CORS Policy**: Allows localhost:5173 and localhost:3000. Update for production.

---

## 📝 Adding Custom Validations

Edit `validate_form_against_pdf()` in `main.py` to add:
1. Custom service eligibility rules
2. Document-specific validations
3. Regional/state-specific checks

---

## 🌍 Expanding to Multiple Languages

Update `guidance_dict` in `main.py`:
```python
"NAME_MISMATCH": {
    "hi": "नाम का मिलान नहीं हुआ...",
    "bn": "নাম মিল খায় নি...",
    "ta": "பெயர் பொருந்தவில்லை...",
}
```

---

## 📞 Support

For issues or feature requests, contact the Margdarshak team.
