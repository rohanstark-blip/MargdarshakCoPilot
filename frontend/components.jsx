/**
 * Margdarshak React Components
 * Professional, minimal UI following design system
 */

import React, { useState } from 'react';
import '../design-system.css';

// ===== HEADER COMPONENT =====
export const Header = () => (
  <header style={{ 
    padding: '24px', 
    borderBottom: '1px solid var(--color-bg-tertiary)',
    backgroundColor: 'var(--color-bg-secondary)'
  }}>
    <div className="container">
      <h1 style={{ margin: 0, fontSize: '24px' }}>
        <span className="text-accent">▸ Margdarshak</span> — CSC Verification
      </h1>
      <p style={{ margin: '8px 0 0 0', color: 'var(--color-text-secondary)', fontSize: '14px' }}>
        Offline form validation • Zero learning curve
      </p>
    </div>
  </header>
);

// ===== FORM COMPONENT =====
export const FormCard = ({ onValidate }) => {
  const [formData, setFormData] = useState({
    applicantName: '',
    applicantDOB: '',
    applicantAge: '',
    serviceType: 'Old Age Pension',
    documentType: 'Aadhaar PDF',
  });

  const [pdfFile, setPdfFile] = useState(null);
  const [dragOver, setDragOver] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setDragOver(true);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      setPdfFile(files[0]);
    }
  };

  const handleFileSelect = (e) => {
    const files = e.target.files;
    if (files.length > 0) {
      setPdfFile(files[0]);
    }
  };

  return (
    <div className="card" style={{ maxWidth: '600px' }}>
      <h2 style={{ marginTop: 0 }}>Enter Application Details</h2>
      
      <div className="grid-2" style={{ marginBottom: '24px' }}>
        {/* Name Field */}
        <div className="form-group">
          <label className="form-label">Applicant Name *</label>
          <input
            type="text"
            name="applicantName"
            className="form-input"
            placeholder="e.g., Raj Kumar Singh"
            value={formData.applicantName}
            onChange={handleInputChange}
          />
        </div>

        {/* Date of Birth */}
        <div className="form-group">
          <label className="form-label">Date of Birth (YYYY-MM-DD) *</label>
          <input
            type="text"
            name="applicantDOB"
            className="form-input"
            placeholder="1985-05-15"
            value={formData.applicantDOB}
            onChange={handleInputChange}
          />
        </div>

        {/* Age */}
        <div className="form-group">
          <label className="form-label">Age *</label>
          <input
            type="number"
            name="applicantAge"
            className="form-input"
            placeholder="39"
            value={formData.applicantAge}
            onChange={handleInputChange}
          />
        </div>

        {/* Service Type */}
        <div className="form-group">
          <label className="form-label">Service Type *</label>
          <select
            name="serviceType"
            className="form-select"
            value={formData.serviceType}
            onChange={handleInputChange}
          >
            <option>Old Age Pension</option>
            <option>Domicile Certificate</option>
            <option>Aadhaar Update</option>
            <option>Disability Pension</option>
            <option>Scholarship (SC/ST/OBC)</option>
            <option>Widow Pension</option>
            <option>Income Certificate</option>
          </select>
        </div>
      </div>

      {/* Document Type Selection */}
      <div className="form-group" style={{ marginBottom: '24px' }}>
        <label className="form-label">Document Type *</label>
        <select
          name="documentType"
          className="form-select"
          value={formData.documentType}
          onChange={handleInputChange}
        >
          <option>Aadhaar PDF</option>
          <option>Passport PDF</option>
          <option>Voter ID PDF</option>
          <option>Ration Card PDF</option>
          <option>Birth Certificate PDF</option>
          <option>Bank Passbook PDF</option>
          <option>Electricity Bill PDF</option>
        </select>
      </div>

      {/* PDF Upload Zone */}
      <div className="form-group">
        <label className="form-label">Upload Supporting Document *</label>
        <div
          className={`file-upload-zone ${dragOver ? 'drag-over' : ''}`}
          onDragOver={handleDragOver}
          onDragLeave={() => setDragOver(false)}
          onDrop={handleDrop}
          onClick={() => document.getElementById('pdf-input').click()}
        >
          <div className="file-icon">📄</div>
          <div className="file-text">
            {pdfFile ? `Selected: ${pdfFile.name}` : 'Drop PDF or click to upload'}
          </div>
          <div className="file-subtext">PNG, JPG, or PDF • Max 10 MB</div>
          <input
            id="pdf-input"
            type="file"
            accept=".pdf,.png,.jpg,.jpeg"
            onChange={handleFileSelect}
            style={{ display: 'none' }}
          />
        </div>
      </div>

      {/* Verify Button */}
      <button 
        className="button button-primary" 
        style={{ width: '100%', marginTop: '24px' }}
        onClick={() => onValidate(formData, pdfFile)}
      >
        🔍 Verify Form
      </button>
    </div>
  );
};

// ===== VALIDATION RESULT COMPONENT =====
export const ValidationResult = ({ result }) => {
  if (!result) return null;

  const isSuccess = result.status === 'success';

  return (
    <div className={`validation-result ${isSuccess ? 'success' : 'error'}`}>
      <div className="result-title">
        {isSuccess ? '✅ All Clear!' : '⚠️ Mismatches Detected'}
      </div>

      {isSuccess ? (
        <p style={{ color: 'var(--color-accent-green)' }}>
          All details match the uploaded document. Form is ready for submission.
        </p>
      ) : (
        <>
          <p>The following fields don't match the document. Please correct them:</p>
          <ul className="mismatch-list">
            {result.mismatches.map((mismatch, idx) => (
              <li key={idx} className="mismatch-item">
                <div className="mismatch-field-name">{mismatch.field}</div>
                <div className="mismatch-details">
                  Form: <strong>{mismatch.form_value}</strong> | 
                  Document: <strong>{mismatch.pdf_value}</strong> | 
                  Match: {mismatch.match_score}%
                </div>
              </li>
            ))}
          </ul>
        </>
      )}

      {/* Matches Summary */}
      <div style={{ marginTop: '24px', paddingTop: '24px', borderTop: '1px solid var(--color-bg-tertiary)' }}>
        <h4 style={{ marginBottom: '12px', color: 'var(--color-text-secondary)' }}>✓ Validated Data</h4>
        <div style={{ fontSize: '14px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
          <div><strong>Service:</strong> {result.matches.service_type}</div>
          <div><strong>Name Match:</strong> {result.matches.name.match_score}%</div>
          <div><strong>DOB Match:</strong> {result.matches.dob.match_score}%</div>
          <div><strong>Calculated Age:</strong> {result.matches.age.calculated_from_dob}</div>
        </div>
      </div>
    </div>
  );
};

// ===== CHAT BUBBLE COMPONENT =====
export const ChatBubble = ({ errorCode, serviceType, onClose }) => {
  const [isOpen, setIsOpen] = useState(true);

  const hindiGuidance = {
    'NAME_MISMATCH': 'नाम का मिलान नहीं हुआ। कृपया आवेदक का नाम दस्तावेज़ के अनुसार सही तरीके से दर्ज करें।',
    'DOB_MISMATCH': 'जन्म तारीख का मिलान नहीं हुआ। कृपया दस्तावेज़ में दी गई तारीख दर्ज करें।',
    'AGE_MISMATCH': 'उम्र का मिलान नहीं हुआ। जन्म तारीख से गणना की गई उम्र दर्ज की गई उम्र से अलग है।',
    'ELIGIBILITY_MISMATCH': `आवेदक ${serviceType} के लिए पात्र नहीं है। कृपया सेवा प्रकार और उम्र की जांच करें।`,
  };

  if (!isOpen) {
    return (
      <div className="chat-container">
        <button className="chat-button" onClick={() => setIsOpen(true)}>
          💬
        </button>
      </div>
    );
  }

  return (
    <div className="chat-container">
      <div className="chat-window">
        <div className="chat-header">
          <span>सहायता (Help)</span>
          <button 
            className="chat-close-btn" 
            onClick={() => {
              setIsOpen(false);
              onClose?.();
            }}
          >
            ✕
          </button>
        </div>
        <div className="chat-content">
          <div className="chat-message highlight">
            {hindiGuidance[errorCode] || 'कृपया अपने इनपुट को दोबारा जांचें।'}
          </div>
          <div className="chat-message" style={{ fontSize: '12px', color: 'var(--color-text-muted)' }}>
            💡 <strong>Tip:</strong> नाम और जन्मतिथि दस्तावेज़ से मेल खानी चाहिए।
          </div>
        </div>
      </div>
    </div>
  );
};

// ===== MAIN APP COMPONENT =====
export const MargdarshakApp = () => {
  const [validationResult, setValidationResult] = useState(null);
  const [showChat, setShowChat] = useState(false);

  const handleValidate = async (formData, pdfFile) => {
    // In real app, this would call the FastAPI backend
    // For now, mock response
    const mockResult = {
      status: 'mismatch',
      matches: {
        name: { form_input: formData.applicantName, pdf_extracted: 'Raj Kumar Singh', match_score: 85 },
        dob: { form_input: formData.applicantDOB, pdf_extracted: '05-May-1985', match_score: 92 },
        age: { form_input: formData.applicantAge, calculated_from_dob: 39 },
        service_type: formData.serviceType
      },
      mismatches: [
        {
          field: 'Name',
          form_value: formData.applicantName,
          pdf_value: 'Raj Kumar Singh',
          match_score: 85,
          severity: 'high'
        }
      ],
      error_code: 'NAME_MISMATCH',
      hindi_guidance: 'नाम का मिलान नहीं हुआ।'
    };

    setValidationResult(mockResult);
    if (mockResult.mismatches.length > 0) {
      setShowChat(true);
    }
  };

  return (
    <div style={{ minHeight: '100vh', backgroundColor: 'var(--color-bg-primary)' }}>
      <Header />
      
      <main className="container" style={{ paddingTop: '48px', paddingBottom: '48px' }}>
        <div className="grid-2" style={{ maxWidth: '1000px', margin: '0 auto' }}>
          <FormCard onValidate={handleValidate} />
          <div>
            <ValidationResult result={validationResult} />
          </div>
        </div>
      </main>

      {/* Chat Bubble (appears on validation errors) */}
      {showChat && validationResult?.error_code && (
        <ChatBubble 
          errorCode={validationResult.error_code}
          serviceType={validationResult.matches.service_type}
          onClose={() => setShowChat(false)}
        />
      )}
    </div>
  );
};

export default MargdarshakApp;
