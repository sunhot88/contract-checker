"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

const inputCls =
  "mt-2 w-full rounded-xl border border-line bg-paper/60 px-4 py-3 text-sm outline-none transition placeholder:text-ink-soft/60 focus:border-accent focus:bg-surface focus:ring-4 focus:ring-accent/10";

export default function AuthForm({ mode }: { mode: "login" | "register" }) {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const isLogin = mode === "login";

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res = await fetch(`/api/auth/${mode}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "操作失敗");
      router.push("/dashboard");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "操作失敗");
      setLoading(false);
    }
  }

  return (
    <div className="bg-glow">
      <div className="mx-auto flex min-h-[calc(100vh-8rem)] max-w-6xl items-center justify-center px-5 py-16">
        <div className="shadow-card fade-up w-full max-w-md rounded-3xl border border-line bg-surface p-8 sm:p-10">
          <h1 className="font-serif text-3xl font-bold tracking-tight">{isLogin ? "歡迎回來" : "建立你的帳號"}</h1>
          <p className="mt-2 text-sm text-ink-soft">
            {isLogin ? "登入後繼續審查你的合約。" : "只需 Email 與密碼,立即開始審查第一份合約。"}
          </p>

          <form onSubmit={submit} className="mt-8 space-y-5">
            <label className="block text-sm font-medium">
              Email
              <input
                type="email"
                required
                autoComplete="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={inputCls}
              />
            </label>
            <label className="block text-sm font-medium">
              密碼{!isLogin && <span className="ml-1.5 font-normal text-ink-soft">至少 8 字元</span>}
              <input
                type="password"
                required
                minLength={isLogin ? undefined : 8}
                maxLength={72}
                autoComplete={isLogin ? "current-password" : "new-password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className={inputCls}
              />
            </label>

            {error && (
              <p role="alert" className="rounded-xl bg-risk-high-bg px-4 py-3 text-sm text-risk-high">
                {error}
              </p>
            )}

            <button
              disabled={loading}
              className="w-full rounded-full bg-accent py-3.5 text-sm font-medium text-accent-ink transition hover:opacity-90 disabled:opacity-50"
            >
              {loading ? "處理中…" : isLogin ? "登入" : "建立帳號"}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-ink-soft">
            {isLogin ? "還沒有帳號?" : "已經有帳號?"}{" "}
            <Link href={isLogin ? "/register" : "/login"} className="font-medium text-accent underline underline-offset-4">
              {isLogin ? "免費註冊" : "前往登入"}
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
