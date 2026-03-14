import { Link } from "react-router-dom";
import { ArrowRight, Shield, FileText, Users, Clock, AlertCircle, ExternalLink, Phone, Mail, MapPin, Fingerprint } from "lucide-react";
import { useLang } from "@/context/LangContext";

const services = [
  { path: "/old-age-pension", en: "Old Age Pension", hi: "वृद्धा पेंशन योजना", descEn: "IGNOAPS pension for citizens aged 60+", descHi: "60+ नागरिकों के लिए IGNOAPS पेंशन", icon: "🧓" },
  { path: "/domicile-certificate", en: "Domicile Certificate", hi: "निवास प्रमाण पत्र", descEn: "Certified proof of state residence", descHi: "राज्य निवास का प्रमाणित प्रमाण", icon: "🏠" },
  { path: "/income-certificate", en: "Income Certificate", hi: "आय प्रमाण पत्र", descEn: "Annual household income certification", descHi: "वार्षिक घरेलू आय प्रमाणन", icon: "💰" },
  { path: "/caste-certificate", en: "Caste Certificate", hi: "जाति प्रमाण पत्र", descEn: "SC/ST/OBC caste verification", descHi: "SC/ST/OBC जाति सत्यापन", icon: "📋" },
];

const announcements = [
  "Old Age Pension applications now open for FY 2026-27 — Apply before 31st March 2026",
  "New: AI-powered document validation reduces application rejection by 85%",
  "Income Certificate processing time reduced to under 30 seconds with NLP verification",
  "Caste Certificate applications now available — SC/ST/OBC/EWS categories supported",
];

const updates = [
  { date: "14 Mar 2026", text: "spaCy NER engine integrated for entity extraction", tag: "NEW" },
  { date: "12 Mar 2026", text: "Hindi AI assistant (सहायक) now live for operators", tag: "NEW" },
  { date: "10 Mar 2026", text: "Pension, Domicile, Income & Caste forms launched", tag: "" },
  { date: "08 Mar 2026", text: "Real-time PDF validation with fuzzy matching", tag: "" },
  { date: "05 Mar 2026", text: "Backend API v1.0 deployed — FastAPI + RapidFuzz", tag: "" },
];

export default function Home() {
  const { t } = useLang();
  return (
    <div className="bg-gov-gray-50">
      {/* Announcement ticker */}
      <div className="bg-gov-blue-dark overflow-hidden">
        <div className="max-w-[1200px] mx-auto px-4 lg:px-8 py-2 flex items-center gap-3">
          <span className="bg-gov-navy text-white text-[10px] font-bold px-2 py-0.5 rounded-sm flex-shrink-0">
            NOTICE
          </span>
          <div className="overflow-hidden flex-1">
            <div className="animate-marquee whitespace-nowrap">
              {announcements.concat(announcements).map((a, i) => (
                <span key={i} className="text-xs text-gov-gray-300 mx-6">
                  <span className="text-gov-gray-400 mr-1">●</span>{a}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Hero — NTA style: dark bg, text left, image frame right, dots below */}
      <div className="relative overflow-hidden" style={{ background: "#2d3748" }}>
        {/* Faint watermark pattern */}
        <div className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='100' height='100' xmlns='http://www.w3.org/2000/svg'%3E%3Ctext x='10' y='40' font-size='30' fill='white' font-family='serif' opacity='0.5'%3E16%3C/text%3E%3Ctext x='50' y='80' font-size='24' fill='white' font-family='serif' opacity='0.3'%3E42%3C/text%3E%3Ctext x='70' y='30' font-size='20' fill='white' font-family='serif' opacity='0.4'%3E7%3C/text%3E%3C/svg%3E")`,
          }}
        />
        <div className="max-w-[1200px] mx-auto px-4 lg:px-8 py-12 lg:py-16 relative">
          <div className="grid lg:grid-cols-2 gap-8 items-center">
            {/* Left: Bold text */}
            <div className="text-center lg:text-left">
              <h1 className="text-3xl sm:text-4xl lg:text-[44px] font-bold leading-tight mb-5 uppercase" style={{ color: "#ffffff" }}>
                MARGDARSHAK<br />CO-PILOT
              </h1>
              <p className="text-sm leading-relaxed mb-6 max-w-md mx-auto lg:mx-0 font-semibold tracking-wide uppercase" style={{ color: "#a0aec0" }}>
                {t(
                  "Margdarshak (मार्गदर्शक) AI-powered validation engine for Common Service Centre operators to verify documents, catch errors, and assist citizens efficiently.",
                  "मार्गदर्शक — CSC ऑपरेटरों के लिए AI-संचालित सत्यापन इंजन। दस्तावेज़ सत्यापित करें, त्रुटियाँ पकड़ें, और नागरिकों की कुशलता से सहायता करें।"
                )}
              </p>
              <Link to="/old-age-pension"
                className="inline-flex items-center gap-2 px-6 py-2.5 text-sm font-bold rounded shadow-md uppercase tracking-wider" style={{ background: "#2b6cb0", color: "#ffffff" }}>
                {t("Read More", "और पढ़ें")} <ArrowRight size={14} />
              </Link>
            </div>

            {/* Right: Image frame — NTA has a photo here, we use a validation card */}
            <div className="hidden lg:flex justify-end">
              <div className="p-1.5" style={{ border: "3px solid rgba(255,255,255,0.2)" }}>
                <div className="w-[400px] aspect-[4/3] flex flex-col items-center justify-center p-8" style={{ background: "#1a202c" }}>
                  <Fingerprint size={48} style={{ color: "rgba(255,255,255,0.15)" }} className="mb-4" />
                  <p className="text-sm font-bold text-center uppercase tracking-wider mb-6" style={{ color: "rgba(255,255,255,0.3)" }}>
                    AI Document Validation
                  </p>
                  <div className="grid grid-cols-2 gap-3 w-full max-w-[260px]">
                    {[
                      { label: "Name", val: "96%", color: "#48bb78" },
                      { label: "DOB", val: "100%", color: "#48bb78" },
                      { label: "Address", val: "72%", color: "#ecc94b" },
                      { label: "Document", val: "88%", color: "#48bb78" },
                    ].map((m) => (
                      <div key={m.label} className="px-3 py-2.5 text-center" style={{ background: "rgba(255,255,255,0.06)" }}>
                        <p className="text-[10px] uppercase mb-1" style={{ color: "rgba(255,255,255,0.35)" }}>{m.label}</p>
                        <p className="text-lg font-bold" style={{ color: m.color }}>{m.val}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* Stats bar */}
      <div className="bg-gov-navy">
        <div className="max-w-[1200px] mx-auto px-4 lg:px-8 py-4">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {stats.map((s) => (
              <div key={s.label} className="flex items-center gap-3">
                <s.icon size={18} className="text-white/70" />
                <div>
                  <p className="text-xl font-bold text-white">{s.value}</p>
                  <p className="text-[10px] text-white/70 uppercase tracking-wider">{s.label}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Main content area */}
      <div className="max-w-[1200px] mx-auto px-4 lg:px-8 py-10">
        <div className="grid lg:grid-cols-3 gap-8">

          {/* Left column (2/3) */}
          <div className="lg:col-span-2 space-y-8">

            {/* Services */}
            <div>
              <div className="section-header mb-4">{t("AVAILABLE SERVICES", "उपलब्ध सेवाएं")}</div>
              <div className="grid sm:grid-cols-2 gap-4">
                {services.map((s) => (
                  <Link key={s.path} to={s.path}
                    className="bg-white rounded-md border border-gov-gray-200 p-5 hover:shadow-lg hover:border-gov-blue-light transition-all group">
                    <div className="flex items-start gap-3 mb-2">
                      <span className="text-2xl">{s.icon}</span>
                      <div className="flex-1">
                        <h3 className="text-sm font-bold text-gov-gray-800">{t(s.en, s.hi)}</h3>
                      </div>
                    </div>
                    <p className="text-xs text-gov-gray-500 mb-3">{t(s.descEn, s.descHi)}</p>
                    <span className="text-xs font-semibold text-gov-blue-light group-hover:text-gov-blue flex items-center gap-1">
                      {t("Apply Now", "अभी आवेदन करें")} <ArrowRight size={12} />
                    </span>
                  </Link>
                ))}
              </div>
            </div>

            {/* How it works */}
            <div>
              <div className="section-header mb-4">{t("HOW IT WORKS", "कैसे काम करता है")}</div>
              <div className="grid sm:grid-cols-3 gap-4">
                {[
                  { step: "01", en: "Fill Form", hi: "फॉर्म भरें", descEn: "Operator fills the application form with citizen's details", descHi: "ऑपरेटर नागरिक के विवरण के साथ आवेदन पत्र भरता है" },
                  { step: "02", en: "Upload PDF", hi: "दस्तावेज़ अपलोड", descEn: "Upload Aadhaar, pension cert, or other documents", descHi: "आधार, पेंशन प्रमाण पत्र, या अन्य दस्तावेज़ अपलोड करें" },
                  { step: "03", en: "AI Validates", hi: "AI सत्यापन", descEn: "NLP engine extracts entities and matches against inputs", descHi: "NLP इंजन इकाइयाँ निकालता है और इनपुट से मिलान करता है" },
                ].map((item) => (
                  <div key={item.step} className="bg-white rounded-md border border-gov-gray-200 p-5">
                    <div className="w-9 h-9 rounded-full bg-gov-blue text-white flex items-center justify-center text-sm font-bold mb-3">
                      {item.step}
                    </div>
                    <h4 className="text-sm font-bold text-gov-gray-800">{t(item.en, item.hi)}</h4>
                    <p className="text-xs text-gov-gray-500 leading-relaxed mt-2">{t(item.descEn, item.descHi)}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* About */}
            <div className="bg-white rounded-md border border-gov-gray-200 p-6">
              <div className="section-header mb-4">{t("ABOUT MARGDARSHAK", "मार्गदर्शक के बारे में")}</div>
              <p className="text-sm text-gov-gray-600 leading-relaxed mb-3">
                {t(
                  "Margdarshak (मार्गदर्शक — \"The Guide\") is an AI-powered co-pilot built for India's 4 lakh+ Common Service Centres (CSCs). It enables operators to validate citizen documents in real-time using Natural Language Processing (spaCy NER) and fuzzy string matching (RapidFuzz).",
                  "मार्गदर्शक भारत के 4 लाख+ जन सेवा केंद्रों (CSC) के लिए बनाया गया AI-संचालित सह-पायलट है। यह ऑपरेटरों को NLP (spaCy NER) और फ़ज़ी स्ट्रिंग मैचिंग (RapidFuzz) का उपयोग करके नागरिक दस्तावेज़ों को रियल-टाइम में सत्यापित करने में सक्षम बनाता है।"
                )}
              </p>
              <p className="text-sm text-gov-gray-600 leading-relaxed">
                {t(
                  "The platform catches errors like name mismatches, incorrect dates, and unreadable documents before applications reach the backend — reducing bouncebacks by 85% and processing time to under 30 seconds. Supports Hindi/English bilingual guidance via the सहायक AI assistant.",
                  "यह प्लेटफ़ॉर्म नाम बेमेल, गलत तिथियाँ और अपठनीय दस्तावेज़ जैसी त्रुटियाँ पकड़ता है — आवेदन अस्वीकृति को 85% कम करता है और प्रसंस्करण समय 30 सेकंड से कम करता है। सहायक AI सहायक के माध्यम से हिंदी/अंग्रेज़ी द्विभाषी मार्गदर्शन।"
                )}
              </p>
            </div>
          </div>

          {/* Right sidebar (1/3) */}
          <div className="space-y-6">

            {/* Latest updates — like "LATEST @ NTA" */}
            <div className="bg-white rounded-md border border-gov-gray-200 overflow-hidden">
              <div className="bg-gov-navy text-white px-4 py-3">
                <span className="text-sm font-bold">{t("LATEST @ MARGDARSHAK", "नवीनतम अपडेट")}</span>
              </div>
              <div className="divide-y divide-gov-gray-100 max-h-[380px] overflow-y-auto">
                {updates.map((u, i) => (
                  <div key={i} className="px-4 py-3 hover:bg-gov-gray-50 transition-colors">
                    <p className="text-xs text-gov-gray-700 leading-relaxed">
                      <span className="text-gov-gray-400 mr-1">●</span>
                      {u.text}
                      {u.tag && (
                        <span className="inline-block bg-red-600 text-white text-[8px] font-bold px-1.5 py-0.5 rounded-sm ml-1.5 align-middle">
                          {u.tag}
                        </span>
                      )}
                    </p>
                    <p className="text-[10px] text-gov-gray-400 mt-1">{u.date}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Quick links */}
            <div className="bg-white rounded-md border border-gov-gray-200 overflow-hidden">
              <div className="bg-gov-blue text-white px-4 py-3">
                <span className="text-sm font-bold">{t("QUICK LINKS", "त्वरित लिंक")}</span>
              </div>
              <div className="divide-y divide-gov-gray-100">
                {["CSC Portal", "eDistrict UP", "UMANG App", "DigiLocker", "Aadhaar Portal", "PFMS Portal"].map((l) => (
                  <a key={l} href="#"
                    className="flex items-center justify-between px-4 py-2.5 hover:bg-gov-gray-50 transition-colors group">
                    <span className="text-xs font-medium text-gov-gray-700">{l}</span>
                    <ExternalLink size={11} className="text-gov-gray-400 group-hover:text-gov-blue-light" />
                  </a>
                ))}
              </div>
            </div>

            {/* Important notice */}
            <div className="bg-gov-gray-50 rounded-md border border-gov-gray-300 p-4">
              <div className="flex items-start gap-2">
                <AlertCircle size={16} className="text-gov-gray-500 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-xs font-bold text-gov-gray-800 mb-1">{t("IMPORTANT NOTICE", "महत्वपूर्ण सूचना")}</p>
                  <p className="text-xs text-gov-gray-600 leading-relaxed">
                    {t(
                      "All applications must include original PDF documents. Scanned images are also supported via OCR. Ensure documents are clear for accurate validation.",
                      "सभी आवेदनों में मूल PDF दस्तावेज़ शामिल होने चाहिए। स्कैन की गई छवियाँ भी OCR के माध्यम से समर्थित हैं। सटीक सत्यापन के लिए दस्तावेज़ स्पष्ट होने चाहिए।"
                    )}
                  </p>
                </div>
              </div>
            </div>

            {/* Helpdesk */}
            <div className="bg-white rounded-md border border-gov-gray-200 overflow-hidden">
              <div className="bg-gov-navy text-white px-4 py-3">
                <span className="text-sm font-bold">{t("HELPDESK", "हेल्पडेस्क")}</span>
              </div>
              <div className="p-4 space-y-2.5">
                <div className="flex items-center gap-2.5">
                  <Phone size={13} className="text-gov-blue" />
                  <span className="text-xs text-gov-gray-700">1800-XXX-XXXX (Toll Free)</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <Mail size={13} className="text-gov-blue" />
                  <span className="text-xs text-gov-gray-700">help@margdarshak.gov.in</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <MapPin size={13} className="text-gov-blue" />
                  <span className="text-xs text-gov-gray-700">CSC e-Governance, New Delhi</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
