import { useState, useRef, useCallback, type FormEvent, type DragEvent, type ReactNode } from "react";
import {
  Upload, FileCheck, CheckCircle2, XCircle, AlertTriangle,
  Send, Loader2, ArrowRight, RotateCcw,
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

interface Msg { role: "user" | "assistant"; content: string; }

function ScoreBlock({ label, value, match }: { label: string; value: number; match: string }) {
  const color = value >= 85 ? "bg-verify-pass" : value >= 50 ? "bg-verify-warn" : "bg-verify-fail";
  return (
    <div className="bg-gov-gray-50 border border-gov-gray-200 rounded-md p-4">
      <div className="flex items-baseline justify-between mb-2">
        <span className="text-xs font-semibold text-gov-gray-500 uppercase">{label}</span>
        <span className={cn("text-xl font-bold", value >= 85 ? "text-verify-pass" : value >= 50 ? "text-verify-warn" : "text-verify-fail")}>
          {Math.round(value)}%
        </span>
      </div>
      <div className="h-2 bg-gov-gray-200 rounded-full overflow-hidden">
        <div className={cn("h-full rounded-full", color)} style={{ width: `${value}%`, transition: "width 0.6s ease" }} />
      </div>
      <p className="text-xs text-gov-gray-500 mt-2 truncate">{match}</p>
    </div>
  );
}

interface FormShellProps {
  title: string;
  titleHindi: string;
  children: (props: { name: string; setName: (v: string) => void; dob: string; setDob: (v: string) => void }) => ReactNode;
}

export default function FormShell({ title, titleHindi, children }: FormShellProps) {
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
    e.preventDefault(); e.stopPropagation();
    setDragActive(e.type === "dragenter" || e.type === "dragover");
  }, []);

  const handleDrop = useCallback((e: DragEvent) => {
    e.preventDefault(); e.stopPropagation();
    setDragActive(false);
    const f = e.dataTransfer.files[0];
    if (f?.type === "application/pdf") setFile(f);
  }, []);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!file) return;
    setStatus("loading"); setResult(null);
    const fd = new FormData();
    fd.append("name", name);
    fd.append("dob", dob);
    fd.append("document", file);
    try {
      const res = await fetch(`${API}/validate-form`, { method: "POST", body: fd });
      const data: VResult = await res.json();
      setResult(data);
      if (data.status === "success") setStatus("success");
      else if (data.status === "mismatch") { setStatus("mismatch"); askChat(inferCode(data)); }
      else setStatus("error");
    } catch {
      setStatus("error");
      setResult({ status: "error", reason: "Network error", details: "Backend unreachable." });
    }
  };

  const askChat = async (code: string) => {
    const labels: Record<string, string> = {
      NAME_MISMATCH: "नाम मिसमैच", AGE_MISMATCH: "आयु / DOB त्रुटि", DOC_UNREADABLE: "दस्तावेज़ त्रुटि",
    };
    setMessages((p) => [...p, { role: "user", content: labels[code] || code }]);
    setChatLoading(true);
    try {
      const res = await fetch(`${API}/chat-help`, {
        method: "POST", headers: { "Content-Type": "application/json" },
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
    <div className="max-w-[1200px] mx-auto w-full px-4 lg:px-8 py-8">
      {/* Breadcrumb */}
      <div className="text-xs text-gov-gray-500 mb-4">
        <span className="hover:text-gov-blue cursor-pointer">Home</span>
        <span className="mx-2">/</span>
        <span className="hover:text-gov-blue cursor-pointer">Services</span>
        <span className="mx-2">/</span>
        <span className="text-gov-blue font-medium">{title}</span>
      </div>

      {/* Page heading */}
      <div className="mb-6">
        <h1 className="text-xl font-bold text-gov-gray-800">{title}</h1>
        <p className="text-sm text-gov-saffron font-medium">{titleHindi}</p>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* FORM (2/3) */}
        <section className="lg:col-span-2">
          <div className="bg-white rounded-md border border-gov-gray-200 shadow-sm overflow-hidden">
            <form onSubmit={handleSubmit}>
              {/* Form header */}
              <div className="bg-gov-blue text-white px-6 py-3 flex items-center justify-between">
                <span className="text-sm font-bold">Application Form</span>
                <span className="text-xs text-white/60">
                  <span className="text-gov-saffron">*</span> Required fields
                </span>
              </div>

              <div className="p-6 space-y-5">
                {children({ name, setName, dob, setDob })}

                {/* Separator */}
                <div className="border-t border-dashed border-gov-gray-300" />

                {/* Upload */}
                <div>
                  <label className="block text-xs font-semibold text-gov-gray-600 uppercase tracking-wider mb-2">
                    Upload Supporting Document (PDF) <span className="text-red-500">*</span>
                  </label>
                  <div
                    onClick={() => fileRef.current?.click()}
                    onDragEnter={handleDrag} onDragLeave={handleDrag}
                    onDragOver={handleDrag} onDrop={handleDrop}
                    className={cn("gov-upload", dragActive && "dragging", file && "has-file")}
                  >
                    <input ref={fileRef} type="file" accept=".pdf"
                      onChange={(e) => setFile(e.target.files?.[0] || null)} className="hidden" />
                    {file ? (
                      <div className="flex items-center justify-center gap-3">
                        <FileCheck size={20} className="text-verify-pass" />
                        <div className="text-left">
                          <p className="text-sm font-semibold text-gov-gray-800">{file.name}</p>
                          <p className="text-xs text-gov-gray-500">{(file.size / 1024).toFixed(1)} KB — click to replace</p>
                        </div>
                      </div>
                    ) : (
                      <div className="flex flex-col items-center gap-2">
                        <Upload size={24} className="text-gov-gray-400" />
                        <p className="text-sm text-gov-gray-500">
                          Drop PDF or <span className="text-gov-blue-light font-semibold cursor-pointer">browse files</span>
                        </p>
                        <p className="text-[11px] text-gov-gray-400">Aadhaar / Pension / Domicile / PAN</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Action bar */}
              <div className="border-t border-gov-gray-200 px-6 py-4 bg-gov-gray-50 flex items-center gap-3">
                <button type="submit" disabled={!name || !dob || !file || status === "loading"}
                  className="flex items-center gap-2 px-6 py-2.5 bg-gov-blue text-white text-sm font-semibold rounded hover:bg-gov-blue-hover transition-colors shadow-sm disabled:opacity-40 disabled:cursor-not-allowed">
                  {status === "loading" ? (<><Loader2 size={15} className="animate-spin" />Verifying...</>)
                    : (<>Verify & Submit<ArrowRight size={15} /></>)}
                </button>
                {status !== "idle" && status !== "loading" && (
                  <button type="button" onClick={reset}
                    className="flex items-center gap-2 px-4 py-2.5 text-sm font-medium text-gov-gray-600 border border-gov-gray-300 rounded hover:bg-gov-gray-100 transition-colors">
                    <RotateCcw size={14} /> Clear Form
                  </button>
                )}
              </div>
            </form>

            {/* Results */}
            {result && status !== "loading" && (
              <div className="border-t border-gov-gray-200 p-6 animate-fade-in">
                {status === "success" && (
                  <div className="space-y-5">
                    <div className="flex items-center gap-3">
                      <div className="stamp-box text-verify-pass">
                        <CheckCircle2 size={15} /> VERIFIED
                      </div>
                      <span className="text-xs text-gov-gray-500">All checks passed</span>
                    </div>
                    <div className="grid sm:grid-cols-2 gap-4">
                      <ScoreBlock label="Name" value={result.match_score_name ?? 0} match={result.matched_name ?? "—"} />
                      <ScoreBlock label="D.O.B." value={result.match_score_dob ?? 0} match={result.matched_dob ?? "—"} />
                    </div>
                  </div>
                )}
                {status === "mismatch" && (
                  <div className="space-y-3">
                    <div className="stamp-box text-verify-fail"><AlertTriangle size={15} /> MISMATCH</div>
                    <div className="bg-red-50 border-l-4 border-verify-fail rounded-r-md p-4">
                      <p className="text-sm text-gov-gray-700">{result.reason}</p>
                      {result.recommendation && <p className="text-xs text-gov-gray-500 mt-2">{result.recommendation}</p>}
                    </div>
                  </div>
                )}
                {status === "error" && (
                  <div className="space-y-3">
                    <div className="flex items-center gap-2 text-verify-fail text-sm font-bold"><XCircle size={16} /> ERROR</div>
                    <div className="bg-red-50 border-l-4 border-verify-fail rounded-r-md p-4">
                      <p className="text-sm text-gov-gray-700">{result.reason}</p>
                      {result.details && <p className="text-xs text-gov-gray-500 mt-1">{result.details}</p>}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </section>

        {/* CHAT SIDEBAR (1/3) */}
        <section>
          <div className="bg-white rounded-md border border-gov-gray-200 shadow-sm flex flex-col h-[480px] lg:h-[600px] lg:sticky lg:top-4 overflow-hidden">
            <div className="bg-gov-saffron text-white px-4 py-3 flex items-center justify-between">
              <span className="text-sm font-bold">सहायक / AI Help</span>
              <div className="flex items-center gap-1.5">
                <div className="w-2 h-2 rounded-full bg-white/60 animate-pulse" />
                <span className="text-[10px] text-white/80">Online</span>
              </div>
            </div>
            <div className="flex-1 overflow-y-auto p-4 space-y-3 chat-scroll">
              {messages.length === 0 ? (
                <div className="h-full flex flex-col justify-center px-1">
                  <h3 className="text-base font-bold text-gov-gray-800 mb-1">सहायता चाहिए?</h3>
                  <p className="text-xs text-gov-gray-500 mb-5">Validation errors explained in Hindi.</p>
                  <div className="space-y-2">
                    {topics.map((t) => (
                      <button key={t.code} onClick={() => askChat(t.code)} disabled={chatLoading}
                        className="w-full flex items-center justify-between px-3.5 py-2.5 rounded-md border border-gov-gray-200 text-left hover:border-gov-blue-light hover:bg-gov-gray-50 transition-all group disabled:opacity-40">
                        <div>
                          <span className="text-sm font-semibold text-gov-gray-800 block">{t.hi}</span>
                          <span className="text-[10px] text-gov-gray-400">{t.en}</span>
                        </div>
                        <ArrowRight size={13} className="text-gov-gray-400 group-hover:text-gov-blue-light" />
                      </button>
                    ))}
                  </div>
                </div>
              ) : (
                <>
                  {messages.map((msg, i) => (
                    <div key={i} className={cn("flex", msg.role === "user" ? "justify-end" : "justify-start")}>
                      <div className={cn("max-w-[85%] px-3.5 py-2.5 text-sm leading-relaxed rounded-lg",
                        msg.role === "user" ? "bg-gov-blue text-white" : "bg-gov-gray-100 text-gov-gray-800")}>
                        {msg.content}
                      </div>
                    </div>
                  ))}
                  {chatLoading && (
                    <div className="flex justify-start">
                      <div className="bg-gov-gray-100 rounded-lg px-4 py-3">
                        <div className="flex gap-1.5">
                          {[0, 1, 2].map((i) => (
                            <span key={i} className="w-1.5 h-1.5 bg-gov-gray-400 rounded-full animate-bounce" style={{ animationDelay: `${i * 150}ms` }} />
                          ))}
                        </div>
                      </div>
                    </div>
                  )}
                  <div ref={chatEnd} />
                </>
              )}
            </div>
            {messages.length > 0 && (
              <div className="px-3 py-2.5 border-t border-gov-gray-200 bg-gov-gray-50">
                <div className="flex gap-2 flex-wrap">
                  {topics.map((t) => (
                    <button key={t.code} onClick={() => askChat(t.code)} disabled={chatLoading}
                      className="flex items-center gap-1 px-2.5 py-1 text-[11px] font-medium text-gov-gray-600 border border-gov-gray-200 rounded hover:border-gov-blue-light hover:text-gov-blue transition-colors disabled:opacity-40">
                      <Send size={9} />{t.en}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </section>
      </div>
    </div>
  );
}
