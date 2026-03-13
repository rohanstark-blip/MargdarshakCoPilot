# Margdarshak Design System & Pitch Deck Master Guide

**Professional Minimalist Aesthetic | Offline-First | Zero Learning Curve**

---

## 📐 COLOR PALETTE

### Base Colors (Blackish-Grey Theme)
```
Primary Background:    #101114  (Almost black, 8% grey)
Secondary Background:  #1A1C22  (Slightly lighter)
Tertiary Background:   #2B2E35  (For cards, input fields)
```

### Text Colors
```
Primary Text:          #F5F5F7  (Off-white, very readable)
Secondary Text:        #B0B0B8  (Muted secondary)
Muted Text:            #78787E  (Subtle captions)
```

### Accent Colors (Tech-Forward)
```
Accent Green:          #00D48C  (Primary CTA, success, highlights)
Accent Cyan:           #48C6FF  (Secondary accents, flow connectors)
Accent Red:            #FF5C5C  (Errors, warnings, critical alerts)
Accent Orange:         #FFA500  (Informational, secondary warnings)
```

### Why This Palette?
- **High Contrast**: Readable on low-spec Windows tablets & 2G displays
- **Professional**: No neon, no childish vibrancy
- **Accessible**: WCAG AA compliant for accessibility
- **Tech-Smart**: Green + Cyan = modern, AI-forward aesthetic
- **Culturally Neutral**: Works across all CSC regions in India

---

## 🔤 TYPOGRAPHY

### Font Stack (Fallback Order)
```css
font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
```
**Why?** Works cross-platform (Windows + Mac + Linux), renderer-agnostic, loads fast offline.

### Font Sizes & Weights

| Element | Size | Weight | Line Height | Use Case |
|---------|------|--------|-------------|----------|
| **H1** | 40px | Bold (700) | 1.2x | Slide titles, main heading |
| **H2** | 32px | Semibold (600) | 1.2x | Section headers |
| **H3** | 28px | Semibold (600) | 1.2x | Card titles, subheadings |
| **Body** | 16px | Regular (400) | 1.4x | Main content, descriptions |
| **Small** | 14px | Regular (400) | 1.4x | Labels, captions |
| **XS** | 12px | Regular (400) | 1.4x | Metadata, timestamps |

### Key Rules
- ✅ **All CAPS sparingly**: Use only for labels, emphasis (e.g., "SERVICE TYPE" form label)
- ✅ **Line spacing 1.4x minimum**: Makes text scannable on small screens
- ✅ **No scripts, decorative fonts**: Keeps UI professional
- ✅ **Consistent line height**: Mobile-friendly, reduces cognitive load

---

## 🎨 LAYOUT & SPACING SYSTEM

### Spacing Grid (8px multiples)
```
8px   (xs) - Gap between small elements
12px  (sm) - Compact spacing
16px  (md) - Default padding/margin
24px  (lg) - Card padding, major sections
32px  (xl) - Section separation
48px (2xl) - Major layout sections
```

### Responsive Breakpoints
```
Desktop:  1200px max container width
Tablet:   768px - single column
Mobile:   <768px - full-width, single column
```

### Form Grid Layout
**Desktop (2-column):**
```
[Name] [DOB]
[Age] [Service Type]
[Document Type] [--]
[File Upload] [File Upload]
```

**Mobile (1-column):**
```
[Name]
[DOB]
[Age]
[Service Type]
[Document Type]
[File Upload]
```

---

## 🎯 COMPONENT GUIDELINES

### FORMS & INPUT FIELDS
```css
Background:      #2B2E35 (Tertiary)
Border:          1px solid #2B2E35
Border-Radius:   8px
Padding:         16px
Focus State:     
  - Border: --color-accent-green
  - Box-shadow: 0 0 0 3px rgba(0, 212, 140, 0.1)
  - Background: #1A1C22
```

**Validation States:**
- **Normal**: Slate background, subtle border
- **Focus**: Green border + subtle glow
- **Error**: Red border + light red background (#FF5C5C with 0.05 opacity)
- **Success**: Green border (typically post-validation)

### ERROR/WARNING MESSAGES
```
Layout:        Left border (3-4px solid) + background tint + text
Background:    rgba(255,92,92,0.1) for errors
Border-Left:   3px solid #FF5C5C
Color:         #FF5C5C or lighter red
Font-Size:     14px
Padding:       16px
Border-Radius: 8px
```

**Example (Inline Error):**
```
┌─────────────────────────────────────┐
│ ⚠️ Name does not match document.   │
│    Form: Raj Kumar                  │
│    Document: Raj Kumar Singh        │
│    Match: 85%                       │
└─────────────────────────────────────┘
```

### BUTTONS

#### Primary Button
```css
Background:     #00D48C (Accent Green)
Color:          #101114 (Primary background)
Border:         None
Border-Radius:  8px
Padding:        16px 24px
Font-Weight:    Semibold (600)
Hover:
  - Background: #00c077
  - Box-shadow: 0 4px 16px rgba(0, 0, 0, 0.4)
  - Transform: translateY(-2px)
Active/Disabled: opacity: 0.5, cursor: not-allowed
```

#### Secondary Button
```css
Background:     #2B2E35 (Tertiary)
Color:          #F5F5F7 (Primary text)
Border:         1px solid #2B2E35
Hover:
  - Background: #1A1C22
  - Border-color: #48C6FF (Cyan accent)
```

### CARDS & PANELS
```css
Background:       #1A1C22 (Secondary)
Border:           1px solid #2B2E35 (Tertiary)
Border-Radius:    12px
Padding:          24px
Transition:       200ms ease-in-out
Hover:
  - Background: #2B2E35
  - Box-shadow: 0 4px 16px rgba(0, 0, 0, 0.4)
Accent Line:      4px left border in green (#00D48C) for emphasis
```

### FILE UPLOAD ZONE
```css
Border:           2px dashed #00D48C
Background:       rgba(0, 212, 140, 0.02) (Very subtle green tint)
Border-Radius:    12px
Padding:          48px
Text-Align:       center
Hover:
  - Background: rgba(0, 212, 140, 0.05)
  - Border-color: #48C6FF (Cyan)
Drag-Over:
  - Background: rgba(0, 212, 140, 0.1)
Icon Size:        40px (large, clear)
```

### CHAT BUBBLE (Floating Help Window)
```
Position:        Fixed, bottom-right (24px from edges)
Width:           350px (desktop), 300px (mobile)
Max-Height:      500px (scrollable content)
Z-Index:         1000 (always on top)
Border-Radius:   12px
Box-Shadow:      0 8px 32px rgba(0, 0, 0, 0.5)

Header:
  Background:    #00D48C (Accent green)
  Color:         #101114 (Black text)
  Padding:       16px 24px
  Font-Weight:   Semibold (600)

Content:
  Background:    #1A1C22
  Padding:       24px
  Max-Height:    400px (scrollable)

Messages:
  Background:    #2B2E35
  Border-Left:   3px solid #48C6FF (Cyan highlight)
  Padding:       16px
  Border-Radius: 8px
  Font-Size:     14px
```

**Behavior:**
- Auto-opens when validation error detected
- Collapsiblevia ✕ button → collapses to fab button (💬)
- Smooth slide-up animation (250ms)
- Content scrolls if message is long

---

## 🎬 SLIDE DECK GUIDELINES (3-Minute Pitch)

### Slide Structure

**All slides inherit:**
- Background: Solid `#101114`
- Top border: 1px gradient from transparent → green → transparent
- Bottom border: 1px gradient from transparent → cyan → transparent
- Corner accents: Subtle radial glows (green top-right, cyan bottom-left)
- Max content width: 900px centered

### Slide-by-Slide Breakdown

#### **Slide 1: Title (10s)**
```
┌─────────────────────────────────────┐
│                                     │
│     MARGDARSHAK                     │
│     Offline AI Co-Pilot for         │
│     CSC Operators                   │
│                                     │
│     Catch errors before submission, │
│     reduce bouncebacks              │
│                                     │
└─────────────────────────────────────┘

Font:     H1 + subtitle in secondary text
Colors:   Green accent on "MARGDARSHAK"
Imagery:  Single logo or abstract AI icon (minimal)
```

#### **Slide 2: Problem (25s)**
```
3-Column Card Layout:

[Icon 1]        [Icon 2]        [Icon 3]
1000s Forms     Bouncebacks     Low Literacy
Daily           (30-40%)        + 2G Networks

Each card:
- Icon: 40px, centered
- Title: 18px semibold
- Description: 14px secondary text
- Green left accent border
```

#### **Slide 3: Solution (30s)**
```
3-Column Card Layout:

[Icon]          [Icon]          [Icon]
Offline         PDF Ingestion   Real-Time
Validation      + OCR + NLP     Warnings

Similar card treatment to Slide 2 but with cyan accents
```

#### **Slide 4: How It Works (30s)**
```
Flow Diagram (5 steps):

[Step 1] ──green──> [Step 2] ──green──> ... ──> [Step 5]

Each step box:
- Number badge: green circle with white text
- Title: 16px semibold
- Description: 14px secondary text
- Connectors: green arrows (#00D48C)
```

#### **Slide 5: Data Proof (25s)**
```
Metrics Row:

[1,000 Apps] [543 Rejected] [457 Approved]
    40px          40px          40px
   metric      metric      metric

Top Rejection Reasons (bullet list):
• Age Too Low (Old Age Pension) ~150
• Age Exceeds Eligibility ~110
• Invalid Document ~95
• Missing Aadhaar ~188
```

#### **Slide 6: Impact & Alignment (25s)**
```
Checklist (4 items):

✓ IMPACT          Reduces bouncebacks 70%
✓ FIELD REALISM   Works offline on 2G
✓ ZERO LEARNING   <60 seconds onboarding
✓ SCALABILITY     Ready for 100k+ CSCs

Each line: Card with green checkmark + left green accent
```

#### **Slide 7: Demo + Roadmap (25s)**
```
Two Sections:

[LEFT]                [RIGHT]
Live Demo             Phase 1 (Now)
Form + PDF            Core validation
+ Validation          Phase 2 (3 mo)
(5-10 seconds)        All forms
                      Phase 3 (6 mo)
                      National deploy

Timeline: Vertical flow with milestone markers (green circles)
CTA: "Let's reduce bouncebacks by 70% in 6 months"
```

---

## 🎨 VISUAL CONSISTENCY RULES

| Element | Rule | Why? |
|---------|------|-----|
| **Color** | Green for primary actions, red for errors, cyan for secondary info | Clear visual hierarchy |
| **Spacing** | All padding/margins on 8px grid | Reduces visual chaos |
| **Borders** | No gradients, solid colors only | Professional appearance |
| **Icons** | Minimal line icons, no cartoons | Formal, operator-friendly |
| **Forms** | 2-column desktop, 1-column mobile | Familiar layout pattern |
| **Cards** | Left green accent border on priority items | Visual scanning aid |
| **Buttons** | Always green primary, slate secondary | Cognitive consistency |
| **Errors** | Red border + inline message below field | Immediate feedback |
| **Chat** | Floating bottom-right, auto-opens on error | Non-intrusive help |

---

## ✅ CHECKLIST FOR DESIGNERS & DEVELOPERS

### Before Launch
- [ ] All text is in system fonts (Segoe UI for Windows, Roboto fallback)
- [ ] All form inputs use slate background, green focus border
- [ ] All errors use red left border + light red tint background
- [ ] All buttons are green primary or slate secondary
- [ ] All spacing follows 8px grid (no random 10px, 15px, etc.)
- [ ] All cards have 12px border radius (not 5px, 8px, etc.)
- [ ] Chat bubble appears only after validation error
- [ ] Slides have top/bottom gradient lines (not solid)
- [ ] No gradients anywhere in UI (solid colors only)
- [ ] No cartoon or decorative icons (minimal line icons only)
- [ ] Mobile responsiveness tested on 320px width
- [ ] Contrast ratio passes WCAG AA (text: 4.5:1, UI components: 3:1)

---

## 🚀 DEPLOYMENT & ACCESSIBILITY

### Browser Support
- Chrome/Edge (Windows) – Primary target
- Firefox – Secondary
- Mobile Safari (testing only)

### Accessibility
- **Color**: Never rely on color alone (use icons + text)
- **Contrast**: All text meets #F5F5F7 on #101114 (15+ ratio ✅)
- **Keyboard**: All buttons accessible via Tab key
- **Screen Reader**: Use semantic HTML + ARIA labels

### Low-Bandwidth Optimization
- No webfonts (system fonts only)
- CSS variables for theming (no CSS-in-JS)
- SVG icons instead of PNG
- Image optimization: max 100KB total

---

## 📞 Questions?

**Design System Owner**: Margdarshak Team  
**For UI Issues**: Check `design-system.css`  
**For Pitch Deck**: Reference `pitch-deck.json`  
**For React Components**: Use `components.jsx` as template

---

**Last Updated**: March 13, 2026 | **Version**: 1.0 | **Status**: Ready for Hackathon
