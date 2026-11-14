import Link from "next/link";
import { Suspense } from "react";
import { getSession } from "@/lib/auth";
import LogoutButton from "./LogoutButton";

export function Logo({ className = "" }: { className?: string }) {
  return (
    <span className={`inline-flex items-center gap-2.5 ${className}`}>
      <span className="grid size-8 place-items-center rounded-lg bg-accent text-accent-ink" aria-hidden>
        <svg viewBox="0 0 24 24" className="size-4.5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M7 3h7l5 5v13H7z" />
          <path d="M10.5 14.5l2 2 3.5-4" />
        </svg>
      </span>
      <span className="font-serif text-xl font-bold tracking-tight">Clause</span>
    </span>
  );
}

const btnPrimary = "rounded-full bg-accent px-4 py-2 font-medium text-accent-ink transition hover:opacity-90";

async function AuthNav() {
  const session = await getSession();

  return session ? (
    <>
      <Link href="/dashboard" className={btnPrimary}>
        我的工作區
      </Link>
      <span className="hidden max-w-40 truncate text-ink-soft lg:inline">{session.email}</span>
      <LogoutButton />
    </>
  ) : (
    <GuestNav />
  );
}

function GuestNav() {
  return (
    <>
      <Link href="/login" className="px-3 py-2 text-ink-soft transition hover:text-ink">
        登入
      </Link>
      <Link href="/register" className={btnPrimary}>
        免費開始
      </Link>
    </>
  );
}

export default function Header() {
  return (
    <header className="sticky top-0 z-40 border-b border-line/70 bg-paper/80 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-5">
        <Link href="/" aria-label="Clause 首頁">
          <Logo />
        </Link>

        <nav className="hidden items-center gap-8 text-sm text-ink-soft md:flex" aria-label="主要導覽">
          <Link href="/#how" className="transition hover:text-ink">
            流程
          </Link>
          <Link href="/#features" className="transition hover:text-ink">
            功能
          </Link>
          <Link href="/#security" className="transition hover:text-ink">
            安全
          </Link>
          <Link href="/#faq" className="transition hover:text-ink">
            常見問題
          </Link>
        </nav>

        <div className="flex items-center gap-2.5 text-sm">
          <Suspense fallback={<GuestNav />}>
            <AuthNav />
          </Suspense>
        </div>
      </div>
    </header>
  );
}
