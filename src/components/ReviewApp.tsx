"use client";

import { useEffect, useRef, useState } from "react";

type Level = "high" | "medium" | "low";
type Review = {
  _id: string;
  fileName: string;
  createdAt: string;
  result: {
    summary: string;
    riskLevel: Level;
    risks: { clause: string; level: Level; issue: string; suggestion: string }[];
    missingClauses: string[];
  };
};

const LEVEL_STYLE: Record<Level, string> = {
  high: "bg-risk-high-bg text-risk-high",
  medium: "bg-risk-mid-bg text-risk-mid",
  low: "bg-risk-low-bg text-risk-low",
};
const LEVEL_TEXT: Record<Level, string> = { high: "高風險", medium: "中風險", low: "低風險" };

function Badge({ level }: { level: Level }) {
  return (
    <span className={`shrink-0 rounded-full px-2.5 py-0.5 text-xs font-semibold ${LEVEL_STYLE[level]}`}>
      {LEVEL_TEXT[level]}
    </span>
  );
}

export default function ReviewApp() {
  const inputRef = useRef<HTMLInputElement>(null);
  const [file, setFile] = useState<File | null>(null);
  const [dragging, setDragging] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [current, setCurrent] = useState<Review | null>(null);
  const [history, setHistory] = useState<Review[]>([]);

  async function loadHistory() {
    const res = await fetch("/api/reviews");
    if (res.ok) setHistory(await res.json());
  }

  useEffect(() => {
    fetch("/api/reviews")
      .then((res) => (res.ok ? res.json() : []))
      .then(setHistory)
      .catch(() => {});
  }, []);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!file) return;
    setLoading(true);
    setError("");
    setCurrent(null);
    try {
      const body = new FormData();
      body.append("file", file);
      const res = await fetch("/api/review", { method: "POST", body });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "審查失敗");
      setCurrent(data);
      setFile(null);
      if (inputRef.current) inputRef.current.value = "";
      loadHistory();
    } catch (err) {
      setError(err instanceof Error ? err.message : "審查失敗");
    } finally {
      setLoading(false);
    }
  }

  function pick(f: File | undefined) {
    if (f) setFile(f);
  }

  return (
    <div className="space-y-12">
      <form onSubmit={submit} className="space-y-4">
        <div
          onDragOver={(e) => {
            e.preventDefault();
            setDragging(true);
          }}
          onDragLeave={() => setDragging(false)}
          onDrop={(e) => {
            e.preventDefault();
            setDragging(false);
            pick(e.dataTransfer.files[0]);
          }}
          onClick={() => inputRef.current?.click()}
          className={`shadow-card flex cursor-pointer flex-col items-center gap-3 rounded-3xl border-2 border-dashed px-6 py-14 text-center transition ${
            dragging ? "border-accent bg-accent-tint/50" : "border-line bg-surface hover:border-accent/60"
          }`}
        >
          <span className="grid size-12 place-items-center rounded-2xl bg-accent-tint text-accent" aria-hidden>
            <svg viewBox="0 0 24 24" className="size-6" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 16V4m0 0l-4 4m4-4l4 4" />
              <path d="M4 16v3a1 1 0 001 1h14a1 1 0 001-1v-3" />
            </svg>
          </span>
          {file ? (
            <>
              <p className="font-medium">{file.name}</p>
              <p className="text-xs text-ink-soft">{(file.size / 1024).toFixed(0)} KB · 點擊可更換檔案</p>
            </>
          ) : (
            <>
              <p className="font-medium">拖曳合約到這裡,或點擊選擇檔案</p>
              <p className="text-xs text-ink-soft">支援 PDF、TXT、MD · 單檔 4MB 內</p>
            </>
          )}
          <input
            ref={inputRef}
            type="file"
            accept=".pdf,.txt,.md"
            className="sr-only"
            onChange={(e) => pick(e.target.files?.[0])}
          />
        </div>

        <button
          disabled={!file || loading}
          className="w-full rounded-full bg-accent py-3.5 text-sm font-medium text-accent-ink transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-40 sm:w-auto sm:px-10"
        >
          {loading ? "AI 審查中,請稍候…" : "開始審查"}
        </button>
      </form>

      {error && (
        <p role="alert" className="rounded-2xl bg-risk-high-bg px-5 py-4 text-sm text-risk-high">
          {error}
        </p>
      )}

      {current && (
        <section className="fade-up space-y-3">
          <h2 className="font-serif text-xl font-bold">本次審查結果</h2>
          <ReviewCard review={current} />
        </section>
      )}

      <section className="space-y-4">
        <h2 className="font-serif text-xl font-bold">歷史紀錄</h2>
        {history.length === 0 && (
          <p className="rounded-2xl border border-dashed border-line px-5 py-8 text-center text-sm text-ink-soft">
            尚無紀錄,上傳你的第一份合約吧。
          </p>
        )}
        <div className="space-y-3">
          {history.map((r) => (
            <details key={r._id} className="group rounded-2xl border border-line bg-surface transition open:shadow-card">
              <summary className="flex cursor-pointer list-none items-center gap-3 px-5 py-4 text-sm">
                <Badge level={r.result.riskLevel} />
                <span className="min-w-0 flex-1 truncate font-medium">{r.fileName}</span>
                <time className="hidden text-xs text-ink-soft sm:block">{new Date(r.createdAt).toLocaleString()}</time>
                <span className="text-lg text-ink-soft transition group-open:rotate-45" aria-hidden>+</span>
              </summary>
              <div className="border-t border-line p-5">
                <ReviewCard review={r} bare />
              </div>
            </details>
          ))}
        </div>
      </section>
    </div>
  );
}

function ReviewCard({ review, bare = false }: { review: Review; bare?: boolean }) {
  const { result } = review;
  return (
    <div className={`space-y-6 text-sm ${bare ? "" : "shadow-card rounded-3xl border border-line bg-surface p-6 sm:p-8"}`}>
      <div className="flex flex-wrap items-center gap-3">
        <Badge level={result.riskLevel} />
        <span className="font-medium">{review.fileName}</span>
        <a
          href={`/api/reviews/${review._id}/file`}
          target="_blank"
          rel="noreferrer"
          className="ml-auto font-medium text-accent underline underline-offset-4"
        >
          檢視原檔
        </a>
      </div>

      <p className="leading-relaxed text-ink-soft">{result.summary}</p>

      {result.risks.length > 0 && (
        <div className="space-y-3">
          <p className="font-medium">風險條款({result.risks.length})</p>
          <ul className="space-y-3">
            {result.risks.map((r, i) => (
              <li key={i} className="rounded-2xl border border-line bg-paper/60 p-4">
                <div className="flex items-start gap-2.5">
                  <Badge level={r.level} />
                  <span className="font-medium leading-snug">{r.clause}</span>
                </div>
                <p className="mt-2.5 leading-relaxed text-ink-soft">{r.issue}</p>
                <p className="mt-2 rounded-lg bg-accent-tint/60 px-3 py-2 leading-relaxed text-accent">
                  <span className="font-semibold">建議 </span>
                  {r.suggestion}
                </p>
              </li>
            ))}
          </ul>
        </div>
      )}

      {result.missingClauses.length > 0 && (
        <div className="space-y-2">
          <p className="font-medium">建議補充條款</p>
          <ul className="flex flex-wrap gap-2">
            {result.missingClauses.map((c, i) => (
              <li key={i} className="rounded-full border border-line bg-paper px-3 py-1 text-ink-soft">
                {c}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
