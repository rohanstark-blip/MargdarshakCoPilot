import { useState, useRef, useCallback, type FormEvent, type DragEvent } from "react";
import {
  Upload,
  FileCheck,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Send,
  Loader2,
  ArrowRight,
  RotateCcw,
  Fingerprint,
} from "lucide-react";
import { cn } from "@/lib/utils";

const API = "http://localhost:8000";

type VStatus = "idle" | "loading" | "success" | "mismatch" | "error";

interface VResult {
  status: string;
  matched_name?: string;
  match_score_name?: number;
  matched_dob?: string;
  match_score_dob?: number;
  details?: string;
  reason?: string;
  match_score?: number;
  recommendation?: string;
}

interface Msg {
  role: "user" | "assistant";
  content: string;
}

// ─── Score Block ──────────────────────────────────────

function ScoreBlock({ label, value, match }: { label: string; value: number; match: string }) {
  const color = value >= 85 ? "bg-verify-pass" : value >= 50 ? "bg-verify-warn" : "bg-verify-fail";
  return (
    <div className="border-[3px] border-brutal-black bg-white p-4 shadow-brutal-sm">
      <div className="flex items-baseline justify-between mb-3">
        <span className="font-mono text-xs font-bold uppercase">{label}</span>
        <span className={cn(
          "font-mono text-2xl font-bold",
          value >= 85 ? "text-verify-pass" : value >= 50 ? "text-verify-warn" : "text-verify-fail"
        )}>
          {Math.round(value)}%
        </span>
      </div>
      <div className="h-3 bg-brutal-grey border border-brutal-black">
        <div className={cn("h-full", color)} style={{ width: `${value}%`, transition: "width 0.6s ease" }} />
      </div>
      <p className="font-mono text-xs text-brutal-darkgrey mt-2 truncate">{match}</p>
    </div>
  );
}

// ─── App ──────────────────────────────────────────────

export default function App() {
  const [name, setName] = useState("");
  const [dob, setDob] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [dragActive, setDragActive] = useState(false);
  const [status, setStatus] = useState<VStatus>("idle");
  const [result, setResult] = useState<VResult | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  const [messages, setMessages] = useState<Msg[]>([]);
  const [chatLoading, setChatLoading] = useState(false);
  const chatEnd = useRef<HTMLDivElement>(null);

  const inferCode = (r: VResult) => {
    if (!r.reason) return "DOC_UNREADABLE";
    if (r.reason.toLowerCase().includes("name")) return "NAME_MISMATCH";
    if (r.reason.toLowerCase().includes("date")) return "AGE_MISMATCH";
    return "DOC_UNREADABLE";
  };

  const handleDrag = useCallback((e: DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(e.type === "dragenter" || e.type === "dragover");
  }, []);

  const handleDrop = useCallback((e: DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    const f = e.dataTransfer.files[0];
    if (f?.type === "application/pdf") setFile(f);
  }, []);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!file) return;
    setStatus("loading");
    setResult(null);

    const fd = new FormData();
    fd.append("name", name);
    fd.append("dob", dob);
    fd.append("document", file);

    try {
      const res = await fetch(`${API}/validate-form`, { method: "POST", body: fd });
      const data: VResult = await res.json();
      setResult(data);
      if (data.status === "success") setStatus("success");
      else if (data.status === "mismatch") {
        setStatus("mismatch");
        askChat(inferCode(data));
      } else setStatus("error");
    } catch {
      setStatus("error");
      setResult({ status: "error", reason: "Network error", details: "Backend unreachable." });
    }
  };

  const askChat = async (code: string) => {
    const labels: Record<string, string> = {
      NAME_MISMATCH: "नाम मिसमैच",
      AGE_MISMATCH: "आयु / DOB त्रुटि",
      DOC_UNREADABLE: "दस्तावेज़ पढ़ने में त्रुटि",
    };
    setMessages((p) => [...p, { role: "user", content: labels[code] || code }]);
    setChatLoading(true);
    try {
      const res = await fetch(`${API}/chat-help`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ error_code: code }),
      });
      const data = await res.json();
      setMessages((p) => [...p, { role: "assistant", content: data.reply }]);
    } catch {
      setMessages((p) => [...p, { role: "assistant", content: "सर्वर उपलब्ध नहीं है।" }]);
    } finally {
      setChatLoading(false);
      setTimeout(() => chatEnd.current?.scrollIntoView({ behavior: "smooth" }), 80);
    }
  };

  const reset = () => { setName(""); setDob(""); setFile(null); setStatus("idle"); setResult(null); };

  const topics = [
    { code: "NAME_MISMATCH", hi: "नाम मिसमैच", en: "Name mismatch" },
    { code: "AGE_MISMATCH", hi: "आयु त्रुटि", en: "DOB issue" },
    { code: "DOC_UNREADABLE", hi: "दस्तावेज़ त्रुटि", en: "Bad document" },
  ];

  return (
    <div className="min-h-screen bg-cream flex flex-col">

      {/* ═══ HEADER ═══ */}
      <header className="bg-brutal-black text-white">
        <div className="max-w-[1400px] mx-auto px-6 lg:px-10 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-saffron flex items-center justify-center shadow-brutal-sm">
              <Fingerprint size={24} className="text-white" />
            </div>
            <div>
              <h1 className="font-mono text-xl font-bold tracking-tight leading-none">
                MARGDARSHAK
              </h1>
              <p className="font-mono text-[10px] text-brutal-darkgrey tracking-[0.3em] mt-1">
                CSC OPERATOR CO-PILOT
              </p>
            </div>
          </div>
          <div className="hidden md:flex items-center gap-3">
            <div className="bg-lime text-brutal-black font-mono text-xs font-bold px-3 py-1.5 shadow-brutal-sm">
              SYSTEM ONLINE
            </div>
          </div>
        </div>
      </header>

      {/* Saffron bar */}
      <div className="h-2 bg-saffron" />

      {/* ═══ MAIN ═══ */}
      <main className="flex-1 max-w-[1400px] mx-auto w-full px-6 lg:px-10 py-8 lg:py-10">
        <div className="grid lg:grid-cols-12 gap-6 lg:gap-8">

          {/* ─── LEFT: FORM (7-8 cols) ─── */}
          <section className="lg:col-span-7 xl:col-span-8">

            {/* Section tag */}
            <div className="inline-block bg-brutal-black text-white font-mono text-xs font-bold px-3 py-1.5 mb-4 shadow-brutal-sm">
              01 — DOCUMENT VERIFICATION
            </div>

            <div className="bg-white border-[3px] border-brutal-black shadow-brutal-lg">
              <form onSubmit={handleSubmit}>
                <div className="p-6 lg:p-8 space-y-6">

                  {/* Name */}
                  <div className="animate-slide-up d2">
                    <label className="block font-mono text-xs font-bold uppercase tracking-wider mb-2">
                      Applicant Name <span className="text-saffron">*</span>
                    </label>
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Rajesh Kumar Singh"
                      required
                      className="brutal-input"
                    />
                  </div>

                  {/* DOB */}
                  <div className="animate-slide-up d3">
                    <label className="block font-mono text-xs font-bold uppercase tracking-wider mb-2">
                      Date of Birth <span className="text-saffron">*</span>
                    </label>
                    <input
                      type="text"
                      value={dob}
                      onChange={(e) => setDob(e.target.value)}
                      placeholder="DD-MM-YYYY"
                      required
                      className="brutal-input font-mono"
                    />
                  </div>

                  {/* Upload */}
                  <div className="animate-slide-up d4">
                    <label className="block font-mono text-xs font-bold uppercase tracking-wider mb-2">
                      Document Upload <span className="text-saffron">*</span>
                    </label>
                    <div
                      onClick={() => fileRef.current?.click()}
                      onDragEnter={handleDrag}
                      onDragLeave={handleDrag}
                      onDragOver={handleDrag}
                      onDrop={handleDrop}
                      className={cn(
                        "brutal-upload",
                        dragActive && "dragging",
                        file && "has-file"
                      )}
                    >
                      <input
                        ref={fileRef}
                        type="file"
                        accept=".pdf"
                        onChange={(e) => setFile(e.target.files?.[0] || null)}
                        className="hidden"
                      />
                      {file ? (
                        <div className="flex items-center justify-center gap-3">
                          <FileCheck size={22} className="text-brutal-black" />
                          <div className="text-left">
                            <p className="font-bold text-sm">{file.name}</p>
                            <p className="font-mono text-xs text-brutal-darkgrey">
                              {(file.size / 1024).toFixed(1)} KB — click to replace
                            </p>
                          </div>
                        </div>
                      ) : (
                        <div className="flex flex-col items-center gap-2">
                          <Upload size={28} className="text-brutal-darkgrey" />
                          <p className="text-sm font-medium">
                            Drop PDF or <span className="text-saffron font-bold underline decoration-2 underline-offset-2">browse</span>
                          </p>
                          <p className="font-mono text-[11px] text-brutal-darkgrey">
                            Aadhaar / Pension / Domicile
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Action bar */}
                <div className="border-t-2.5 border-brutal-black px-6 lg:px-8 py-4 flex items-center gap-3 bg-cream/50 animate-slide-up d5">
                  <button
                    type="submit"
                    disabled={!name || !dob || !file || status === "loading"}
                    className={cn(
                      "flex items-center gap-2 px-8 py-3.5 font-bold text-sm uppercase tracking-wider transition-all",
                      "bg-saffron text-white border-[3px] border-brutal-black shadow-brutal",
                      "hover:shadow-brutal-lg hover:-translate-x-0.5 hover:-translate-y-0.5",
                      "active:shadow-none active:translate-x-1 active:translate-y-1",
                      "disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:shadow-brutal disabled:hover:translate-x-0 disabled:hover:translate-y-0"
                    )}
                  >
                    {status === "loading" ? (
                      <>
                        <Loader2 size={16} className="animate-spin" />
                        Verifying...
                      </>
                    ) : (
                      <>
                        Verify
                        <ArrowRight size={16} />
                      </>
                    )}
                  </button>

                  {status !== "idle" && status !== "loading" && (
                    <button
                      type="button"
                      onClick={reset}
                      className="flex items-center gap-2 px-5 py-3.5 font-bold text-sm border-[3px] border-brutal-black bg-white shadow-brutal-sm hover:shadow-brutal hover:-translate-x-0.5 hover:-translate-y-0.5 active:shadow-none active:translate-x-0.5 active:translate-y-0.5 transition-all"
                    >
                      <RotateCcw size={14} />
                      Clear
                    </button>
                  )}
                </div>
              </form>

              {/* ─── RESULTS ─── */}
              {result && status !== "loading" && (
                <div className="border-t-2.5 border-brutal-black p-6 lg:p-8">

                  {status === "success" && (
                    <div className="space-y-6 animate-fade-in">
                      <div className="flex items-start justify-between gap-4 flex-wrap">
                        <div className="stamp-box text-verify-pass animate-stamp-slam">
                          <span className="flex items-center gap-2">
                            <CheckCircle2 size={18} />
                            VERIFIED
                          </span>
                        </div>
                        <span className="font-mono text-xs text-brutal-darkgrey pt-2">
                          All checks passed
                        </span>
                      </div>
                      <div className="grid sm:grid-cols-2 gap-4">
                        <ScoreBlock
                          label="Name"
                          value={result.match_score_name ?? 0}
                          match={result.matched_name ?? "—"}
                        />
                        <ScoreBlock
                          label="D.O.B."
                          value={result.match_score_dob ?? 0}
                          match={result.matched_dob ?? "—"}
                        />
                      </div>
                    </div>
                  )}

                  {status === "mismatch" && (
                    <div className="space-y-4 animate-fade-in">
                      <div className="stamp-box text-verify-fail animate-stamp-slam">
                        <span className="flex items-center gap-2">
                          <AlertTriangle size={18} />
                          MISMATCH
                        </span>
                      </div>
                      <div className="bg-verify-fail/5 border-l-4 border-verify-fail p-4">
                        <p className="text-sm font-medium leading-relaxed">{result.reason}</p>
                        {result.recommendation && (
                          <p className="text-xs text-brutal-darkgrey mt-2">{result.recommendation}</p>
                        )}
                      </div>
                    </div>
                  )}

                  {status === "error" && (
                    <div className="space-y-4 animate-fade-in">
                      <div className="flex items-center gap-2 font-mono text-sm font-bold text-verify-fail">
                        <XCircle size={18} />
                        ERROR
                      </div>
                      <div className="bg-verify-fail/5 border-l-4 border-verify-fail p-4">
                        <p className="text-sm font-medium">{result.reason}</p>
                        {result.details && (
                          <p className="font-mono text-xs text-brutal-darkgrey mt-1">{result.details}</p>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </section>

          {/* ─── RIGHT: CHAT (4-5 cols) ─── */}
          <section className="lg:col-span-5 xl:col-span-4 animate-slide-up d3">

            <div className="inline-block bg-saffron text-white font-mono text-xs font-bold px-3 py-1.5 mb-4 shadow-brutal-sm">
              02 — सहायक HELPDESK
            </div>

            <div className="bg-white border-[3px] border-brutal-black shadow-brutal-lg flex flex-col h-[520px] lg:h-[calc(100vh-14rem)] lg:sticky lg:top-8">

              {/* Chat header */}
              <div className="px-5 py-3 border-b-2.5 border-brutal-black bg-lime flex items-center justify-between">
                <span className="font-mono text-sm font-bold">सहायक</span>
                <span className="font-mono text-[10px] font-bold text-brutal-darkgrey">HINDI AI HELP</span>
              </div>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-4 space-y-3 chat-scroll bg-cream/30">
                {messages.length === 0 ? (
                  <div className="h-full flex flex-col justify-center px-2">
                    <h3 className="font-mono text-lg font-bold mb-1">
                      सहायता चाहिए?
                    </h3>
                    <p className="text-sm text-brutal-darkgrey mb-6">
                      Get help with validation errors in Hindi.
                    </p>
                    <div className="space-y-2">
                      {topics.map((t) => (
                        <button
                          key={t.code}
                          onClick={() => askChat(t.code)}
                          disabled={chatLoading}
                          className="w-full flex items-center justify-between px-4 py-3 border-2 border-brutal-black bg-white text-left hover:bg-lime hover:shadow-brutal-sm hover:-translate-x-0.5 hover:-translate-y-0.5 active:shadow-none active:translate-x-0 active:translate-y-0 transition-all group disabled:opacity-40"
                        >
                          <div>
                            <span className="text-sm font-bold block">{t.hi}</span>
                            <span className="font-mono text-[10px] text-brutal-darkgrey">{t.en}</span>
                          </div>
                          <ArrowRight size={14} className="text-brutal-darkgrey group-hover:text-brutal-black transition-colors" />
                        </button>
                      ))}
                    </div>
                  </div>
                ) : (
                  <>
                    {messages.map((msg, i) => (
                      <div
                        key={i}
                        className={cn("flex", msg.role === "user" ? "justify-end" : "justify-start")}
                      >
                        <div
                          className={cn(
                            "max-w-[85%] px-4 py-3 text-sm leading-relaxed border-2 border-brutal-black",
                            msg.role === "user"
                              ? "bg-saffron text-white shadow-brutal-sm"
                              : "bg-white shadow-brutal-sm"
                          )}
                        >
                          {msg.content}
                        </div>
                      </div>
                    ))}
                    {chatLoading && (
                      <div className="flex justify-start">
                        <div className="bg-white border-2 border-brutal-black shadow-brutal-sm px-4 py-3">
                          <div className="flex gap-2">
                            {[0, 1, 2].map((i) => (
                              <span
                                key={i}
                                className="w-2 h-2 bg-brutal-black rounded-full animate-bounce"
                                style={{ animationDelay: `${i * 150}ms` }}
                              />
                            ))}
                          </div>
                        </div>
                      </div>
                    )}
                    <div ref={chatEnd} />
                  </>
                )}
              </div>

              {/* Quick sends */}
              {messages.length > 0 && (
                <div className="px-4 py-3 border-t-2.5 border-brutal-black bg-cream/50">
                  <div className="flex gap-2 flex-wrap">
                    {topics.map((t) => (
                      <button
                        key={t.code}
                        onClick={() => askChat(t.code)}
                        disabled={chatLoading}
                        className="flex items-center gap-1.5 px-3 py-1.5 font-mono text-[11px] font-bold border-2 border-brutal-black bg-white hover:bg-lime transition-colors disabled:opacity-40"
                      >
                        <Send size={10} />
                        {t.en}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </section>
        </div>
      </main>

      {/* ═══ FOOTER ═══ */}
      <footer className="bg-brutal-black text-white mt-auto">
        <div className="max-w-[1400px] mx-auto px-6 lg:px-10 h-12 flex items-center justify-between">
          <span className="font-mono text-[10px] tracking-wider text-brutal-darkgrey">
            MARGDARSHAK CO-PILOT — DIGITAL INDIA
          </span>
          <span className="font-mono text-[10px] tracking-wider text-brutal-darkgrey">
            AI VALIDATION ENGINE V1.0
          </span>
        </div>
      </footer>
    </div>
  );
}
