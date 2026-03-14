import { Link, useLocation, Outlet } from "react-router-dom";
import { Fingerprint, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { useLang } from "@/context/LangContext";

const navItemsData = {
  en: [
    { path: "/", label: "HOME" },
    {
      label: "SERVICES",
      children: [
        { path: "/old-age-pension", label: "Old Age Pension" },
        { path: "/domicile-certificate", label: "Domicile Certificate" },
        { path: "/income-certificate", label: "Income Certificate" },
        { path: "/caste-certificate", label: "Caste Certificate" },
      ],
    },
    { path: "#downloads", label: "DOWNLOADS" },
    { path: "#contact", label: "CONTACT US" },
  ],
  hi: [
    { path: "/", label: "होम" },
    {
      label: "सेवाएं",
      children: [
        { path: "/old-age-pension", label: "वृद्धा पेंशन योजना" },
        { path: "/domicile-certificate", label: "निवास प्रमाण पत्र" },
        { path: "/income-certificate", label: "आय प्रमाण पत्र" },
        { path: "/caste-certificate", label: "जाति प्रमाण पत्र" },
      ],
    },
    { path: "#downloads", label: "डाउनलोड" },
    { path: "#contact", label: "संपर्क करें" },
  ],
};

export default function Layout() {
  const location = useLocation();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const { lang, setLang, t } = useLang();
  const navItems = navItemsData[lang];
  const now = new Date();
  const locale = lang === "hi" ? "hi-IN" : "en-IN";
  const dateStr = now.toLocaleDateString(locale, { weekday: "long", year: "numeric", month: "long", day: "numeric" });
  const timeStr = now.toLocaleTimeString(locale, { hour: "2-digit", minute: "2-digit", second: "2-digit" });

  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Top bar — dark navy like NTA */}
      <div className="bg-gov-navy text-white text-xs">
        <div className="max-w-[1200px] mx-auto px-4 lg:px-8 py-1.5 flex items-center justify-between">
          <span className="uppercase tracking-wider text-[11px]">
            {dateStr} - {timeStr} IST
          </span>
          <div className="flex items-center gap-4">
            <span className="text-gov-gray-400 text-[11px]">Screen Reader Access</span>
            <span className="text-gov-gray-400 text-[11px]">Skip to Main Content</span>
          </div>
        </div>
      </div>

      {/* Main nav bar — NTA style: logo left, items in row, emblem + lang right */}
      <nav className="bg-white border-b border-gov-gray-200">
        <div className="max-w-[1200px] mx-auto px-4 lg:px-8 flex items-center h-[42px] gap-6">
          {/* Logo + emblem */}
          <Link to="/" className="flex items-center gap-2.5 flex-shrink-0">
            <div className="w-11 h-11 bg-gov-blue rounded flex items-center justify-center">
              <Fingerprint size={22} className="text-white" />
            </div>
            <div className="leading-tight">
              <span className="text-gov-blue font-bold text-[15px] block">मार्गदर्शक</span>
              <span className="text-gov-gray-500 text-[9px] font-medium tracking-wider uppercase block">CSC Co-Pilot Portal</span>
            </div>
          </Link>

          {/* Nav links — NTA style inline */}
          <div className="hidden md:flex items-center gap-0 flex-1">
            {navItems.map((item) =>
              item.children ? (
                <div
                  key={item.label}
                  className="relative"
                  onMouseEnter={() => setDropdownOpen(true)}
                  onMouseLeave={() => setDropdownOpen(false)}
                >
                  <button
                    className={cn(
                      "flex items-center gap-1 px-4 h-[42px] text-[13px] font-semibold transition-colors border-b-2",
                      item.children.some((c) => c.path === location.pathname)
                        ? "bg-gov-blue text-white border-gov-blue"
                        : "text-gov-gray-600 hover:text-gov-blue border-transparent"
                    )}
                  >
                    {item.label}
                    <ChevronDown size={11} />
                  </button>
                  {dropdownOpen && (
                    <div className="absolute top-full left-0 bg-white border border-gov-gray-200 shadow-lg z-50 min-w-[300px]">
                      {item.children.map((child) => (
                        <Link
                          key={child.path}
                          to={child.path}
                          className={cn(
                            "block px-4 py-3 text-[13px] font-medium border-b border-gov-gray-100 transition-colors",
                            location.pathname === child.path
                              ? "bg-gov-blue text-white"
                              : "text-gov-gray-600 hover:bg-gov-blue hover:text-white"
                          )}
                          onClick={() => setDropdownOpen(false)}
                        >
                          {child.label}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              ) : (
                <Link
                  key={item.path}
                  to={item.path}
                  className={cn(
                    "px-4 h-[42px] flex items-center text-[13px] font-semibold transition-colors border-b-2",
                    location.pathname === item.path
                      ? "bg-gov-blue text-white border-gov-blue"
                      : "text-gov-gray-600 hover:text-gov-blue border-transparent"
                  )}
                >
                  {item.label}
                </Link>
              )
            )}
          </div>

          {/* Right side: emblem text + language selector */}
          <div className="hidden lg:flex items-center gap-4 flex-shrink-0">
            <div className="text-right leading-tight">
              <span className="text-[10px] font-bold text-gov-gray-700 block">{t("Digital India", "डिजिटल इंडिया")}</span>
              <span className="text-[9px] text-gov-gray-400 block">{t("डिजिटल इंडिया", "Digital India")}</span>
            </div>
            <div className="flex items-center rounded-full overflow-hidden border border-gov-blue">
              <button
                onClick={() => setLang("en")}
                className={cn("px-3 py-1.5 text-xs font-semibold transition-colors", lang === "en" ? "bg-gov-blue text-white" : "bg-white text-gov-blue")}
              >
                EN
              </button>
              <button
                onClick={() => setLang("hi")}
                className={cn("px-3 py-1.5 text-xs font-semibold transition-colors", lang === "hi" ? "bg-gov-blue text-white" : "bg-white text-gov-blue")}
              >
                हिं
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Page content */}
      <main className="flex-1 bg-gov-gray-50">
        <Outlet />
      </main>

      {/* Footer */}
      <footer className="bg-gov-navy text-white">
        <div className="max-w-[1200px] mx-auto px-4 lg:px-8 py-8">
          <div className="grid sm:grid-cols-3 gap-8 mb-6">
            <div>
              <h4 className="text-sm font-bold mb-3 text-white">{t("Services", "सेवाएं")}</h4>
              <div className="space-y-2">
                {navItems[1].children?.map((s) => (
                  <Link key={s.path} to={s.path} className="block text-xs text-gov-gray-400 hover:text-white transition-colors">
                    {s.label}
                  </Link>
                ))}
              </div>
            </div>
            <div>
              <h4 className="text-sm font-bold mb-3 text-white">{t("Quick Links", "त्वरित लिंक")}</h4>
              <div className="space-y-2">
                <span className="block text-xs text-gov-gray-400">CSC Portal (csc.gov.in)</span>
                <span className="block text-xs text-gov-gray-400">eDistrict Portal</span>
                <span className="block text-xs text-gov-gray-400">UMANG Mobile App</span>
                <span className="block text-xs text-gov-gray-400">DigiLocker</span>
              </div>
            </div>
            <div>
              <h4 className="text-sm font-bold mb-3 text-white">{t("Helpline", "हेल्पलाइन")}</h4>
              <p className="text-xs text-gov-gray-400">Toll Free: 1800-XXX-XXXX</p>
              <p className="text-xs text-gov-gray-400 mt-1">Email: help@margdarshak.gov.in</p>
              <p className="text-xs text-gov-gray-400 mt-1">CSC e-Governance, New Delhi</p>
            </div>
          </div>
          <div className="border-t border-gov-gray-700 pt-4 mt-2 flex items-center justify-between">
            <span className="text-[11px] text-gov-gray-500">
              © 2026 Margdarshak — CSC Co-Pilot Portal | Government of India
            </span>
            <span className="text-[11px] text-gov-gray-500">
              AI Validation Engine v1.0
            </span>
          </div>
        </div>
      </footer>
    </div>
  );
}
