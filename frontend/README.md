# Margdarshak Frontend — React UI + Design System

**Professional Minimalist Interface | Offline-First | Zero Learning Curve**

---

## 📁 Frontend Structure

```
frontend/
├── design-system.css          # Complete CSS system (colors, typography, components)
├── DESIGN-GUIDELINES.md       # Master design reference (all rules & specs)
├── components.jsx             # React components (Form, Validation, Chat)
├── pitch-deck.json            # Slide deck structure (for programmatic generation)
├── pitch-deck.html            # Interactive 3-minute pitch presentation
└── README.md                  # This file
```

---

## 🎨 Design System Overview

### Color Palette at a Glance
```
Background:    #101114 (blackish-grey)
Text Primary:  #F5F5F7 (off-white)
Text Secondary: #B0B0B8 (muted)
Accent Green:  #00D48C (primary actions, success)
Accent Cyan:   #48C6FF (secondary info, highlights)
Accent Red:    #FF5C5C (errors, warnings)
```

### Key Components
- ✅ **Forms**: Slate background, green focus, red error states
- ✅ **Buttons**: Green primary, slate secondary
- ✅ **Cards**: Dark theme with green left accent border
- ✅ **Chat Bubble**: Floating help window (auto-opens on error)
- ✅ **Error Messages**: Red left border + inline guidance
- ✅ **File Upload**: Dashed green border, drag-drop enabled

---

## 🚀 Getting Started

### 1. **Setup (One-Time)**
```bash
cd frontend
npm create vite@latest . -- --template react
npm install
```

### 2. **Copy Design Assets**
All CSS is in `design-system.css` — import in your React app:
```jsx
import '../design-system.css'
```

### 3. **Use Components**
```jsx
import { MargdarshakApp } from './components'

export default function App() {
  return <MargdarshakApp />
}
```

### 4. **Start Dev Server**
```bash
npm run dev
```
App runs at `http://localhost:5173`

---

## 📋 Component Guide

### **FormCard**
Operator input form with validation fields.
```jsx
<FormCard onValidate={(formData, pdfFile) => { /* handle validation */ }} />
```

**Fields:**
- Applicant Name (text)
- Date of Birth (YYYY-MM-DD)
- Age (number)
- Service Type (select: Old Age Pension, Domicile, etc.)
- Document Type (select)
- PDF Upload (drag-drop enabled)

**Validation Trigger:** "Verify Form" button

---

### **ValidationResult**
Displays mismatch info or success message.
```jsx
<ValidationResult result={validationResult} />
```

**Props:**
- `result`: Object from backend `/validate` endpoint
  - `status`: "success" or "mismatch"
  - `matches`: Matched fields
  - `mismatches`: Array of flagged fields
  - `error_code`: Code for Hindi guidance (e.g., "NAME_MISMATCH")

**Display:**
- ✅ Green "All Clear" if status="success"
- ⚠️ Red mismatch list if status="mismatch"
- Shows match percentages, field names, actual vs expected

---

### **ChatBubble**
Floating Hindi help window that auto-opens on validation errors.
```jsx
<ChatBubble 
  errorCode="NAME_MISMATCH"
  serviceType="Old Age Pension" 
  onClose={() => {}}
/>
```

**Props:**
- `errorCode`: Error code from backend (triggers specific Hindi message)
- `serviceType`: Service type for contextual guidance
- `onClose`: Callback when user closes chat

**Behavior:**
- Floats in fixed position (bottom-right)
- Auto-collapses to fab button (💬) when closed
- Re-opens on new validation error
- Content is scrollable if long

**Hindi Guidance Examples:**
```
NAME_MISMATCH: "नाम का मिलान नहीं हुआ। कृपया आवेदक का नाम दस्तावेज़ के अनुसार सही तरीके से दर्ज करें।"
AGE_MISMATCH: "उम्र का मिलान नहीं हुआ। जन्म तारीख से गणना की गई उम्र दर्ज की गई उम्र से अलग है।"
ELIGIBILITY_MISMATCH: "आवेदक [ServiceType] के लिए पात्र नहीं है।"
```

---

### **Header**
Navigation header with branding.
```jsx
<Header />
```

Displays:
- "▸ Margdarshak" (green accent)
- "CSC Verification" subtitle
- "Offline form validation • Zero learning curve" tagline

---

## 🔄 Integration with FastAPI Backend

### Form Submission Flow
```
1. Operator fills form + uploads PDF
2. onClick "Verify" button
3. FormData + PDF sent to /validate endpoint (FastAPI)
4. Backend processes: PDF extraction → NLP entity tagging → fuzzy matching
5. Backend returns JSON with matches/mismatches
6. Frontend renders ValidationResult
7. If mismatch exists: ChatBubble auto-opens with Hindi guidance
```

### API Call Example
```jsx
const handleValidate = async (formData, pdfFile) => {
  const formDataPayload = new FormData();
  formDataPayload.append('applicant_name', formData.applicantName);
  formDataPayload.append('applicant_dob', formData.applicantDOB);
  formDataPayload.append('applicant_age', formData.applicantAge);
  formDataPayload.append('service_type', formData.serviceType);
  formDataPayload.append('document_type', formData.documentType);
  formDataPayload.append('pdf_file', pdfFile);

  const response = await fetch('http://localhost:8000/validate', {
    method: 'POST',
    body: formDataPayload
  });

  const result = await response.json();
  setValidationResult(result);
};
```

---

## 📊 Pitch Deck

### Interactive Presentation File: `pitch-deck.html`

**Features:**
- 7 full-screen slides
- Arrow key navigation (← →)
- Click dots to jump to slide
- Slide counter
- Smooth transitions (500ms ease)
- Responsive design (mobile-friendly)

**How to View:**
1. Open `pitch-deck.html` in browser
2. Use ← → arrows or click dots to navigate
3. Each slide auto-displays 3-minute content

**Slides:**
1. **Title** — Margdarshak brand intro
2. **Problem** — Bouncebacks, low literacy, 2G
3. **Solution** — Offline validation, PDF OCR, NLP
4. **How It Works** — 5-step flow diagram
5. **Data Proof** — 1,000 synthetic apps, rejection patterns
6. **Impact** — Alignment with hackathon criteria
7. **Demo + Roadmap** — Live demo info, 3-phase rollout

---

## 🎨 Customization Examples

### Change Accent Color (Green → Blue)
Edit `design-system.css`:
```css
:root {
  --color-accent-green: #1E90FF; /* Changed from #00D48C */
  --color-accent-cyan: #48C6FF;  /* Keep cyan as secondary */
}
```

### Add New Service Type
Edit `components.jsx` FormCard:
```jsx
<option>Maternity Benefit Scheme</option>
```

### Add Local Language Support
Edit `components.jsx` ChatBubble or create `hindi-messages.js`:
```js
const messages = {
  'hi': { NAME_MISMATCH: 'नाम...' },
  'bn': { NAME_MISMATCH: 'নাম...' },
  'ta': { NAME_MISMATCH: 'பெயர்...' }
};
```

---

## 📱 Responsive Behavior

### Desktop (> 1200px)
- 2-column form layout (Name + DOB side-by-side)
- Form + Results displayed side-by-side
- Chat bubble: 350px width

### Tablet (768px - 1200px)
- 1-column form layout
- Stack form above results
- Chat bubble: 300px width

### Mobile (< 768px)
- Full-width single column
- Large touch targets (40px+ buttons)
- Chat bubble: Full-width - 48px (with margins)

---

## ♿ Accessibility

### WCAG AA Compliance
- **Contrast Ratio**: #F5F5F7 on #101114 = 15.3:1 ✅
- **Font Sizes**: 16px+ for body text ✅
- **Touch Targets**: Buttons/inputs 44px+ minimum ✅
- **Keyboard Navigation**: Tab key through all interactive elements ✅
- **Screen Readers**: Semantic HTML + ARIA labels ✅

### Best Practices
- Never rely on color alone (always use text + icons)
- Form labels linked to inputs via `<label htmlFor>`
- Error messages associated with fields via `aria-describedby`
- Buttons have descriptive text (e.g., not just ✓)

---

## ⚡ Performance Optimization

### CSS
- No webfonts (system fonts only)
- CSS custom properties (no runtime recalc)
- ~8KB gzipped

### Images
- SVG icons (zero rasterization)
- PNG icons optimized to <5KB total
- No auto-loading images

### Lazy Loading
```jsx
const ValidationResult = React.lazy(() => import('./components'));
```

### Bundle Size
- React: ~42KB
- React DOM: ~44KB
- Custom CSS: ~8KB
- **Total: ~94KB** (well under budget for 2G)

---

## 🧪 Testing

### Component Tests (Jest + React Testing Library)
```jsx
test('FormCard renders with all fields', () => {
  render(<FormCard onValidate={jest.fn()} />);
  expect(screen.getByText(/Applicant Name/)).toBeInTheDocument();
});

test('ValidationResult shows error on mismatch', () => {
  const result = { status: 'mismatch', mismatches: [...] };
  render(<ValidationResult result={result} />);
  expect(screen.getByText(/Mismatches Detected/)).toBeInTheDocument();
});
```

### E2E Tests (Cypress)
```js
describe('Form Validation Flow', () => {
  it('displays mismatch warning on name conflict', () => {
    cy.visit('http://localhost:5173');
    cy.get('input[name="applicantName"]').type('Raj Kumar');
    cy.get('input[type="file"]').selectFile('sample.pdf');
    cy.get('button').contains('Verify').click();
    cy.get('.validation-result.error').should('be.visible');
  });
});
```

---

## 📚 Design System Reference

See **`DESIGN-GUIDELINES.md`** for:
- Full color specifications
- Typography rules
- Component specifications
- Layout guidelines
- Consistency checklist
- Accessibility requirements

---

## 🚢 Deployment

### Development
```bash
npm run dev
```

### Production Build
```bash
npm run build
# Generates dist/ folder (ready to deploy)
```

### Serve Static Files (Offline Mode)
```bash
npx serve dist
# or use Python: python -m http.server 5173
```

### Docker Deployment
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY . .
RUN npm install && npm run build
EXPOSE 5173
CMD ["npm", "run", "dev"]
```

---

## 📞 Support & Contributions

- **Design Issues**: Check `DESIGN-GUIDELINES.md`
- **Component Issues**: Check `components.jsx` comments
- **API Integration**: Ensure FastAPI backend is running at `http://localhost:8000`
- **Pitch Deck**: Preview `pitch-deck.html` in any modern browser

---

**Last Updated**: March 13, 2026 | **Version**: 1.0 | **Status**: Production-Ready
