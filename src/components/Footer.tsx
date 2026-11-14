import Link from "next/link";
import { Logo } from "./Header";

async function Year() {
  "use cache";
  return new Date().getFullYear();
}

export default function Footer() {
  return (
    <footer className="border-t border-line bg-paper-2/60">
      <div className="mx-auto grid max-w-6xl gap-10 px-5 py-14 md:grid-cols-[1.4fr_1fr_1fr]">
        <div className="space-y-4">
          <Logo />
          <p className="max-w-xs text-sm leading-relaxed text-ink-soft">
            讓每個人在簽名之前,都能讀懂合約裡真正重要的事。
          </p>
        </div>
        <div className="space-y-3 text-sm">
          <p className="font-medium">產品</p>
          <ul className="space-y-2 text-ink-soft">
            <li><Link href="/#how" className="hover:text-ink">運作流程</Link></li>
            <li><Link href="/#features" className="hover:text-ink">功能特色</Link></li>
            <li><Link href="/#faq" className="hover:text-ink">常見問題</Link></li>
          </ul>
        </div>
        <div className="space-y-3 text-sm">
          <p className="font-medium">帳號</p>
          <ul className="space-y-2 text-ink-soft">
            <li><Link href="/login" className="hover:text-ink">登入</Link></li>
            <li><Link href="/register" className="hover:text-ink">註冊</Link></li>
            <li><Link href="/dashboard" className="hover:text-ink">我的工作區</Link></li>
          </ul>
        </div>
      </div>
      <div className="border-t border-line">
        <div className="mx-auto flex max-w-6xl flex-col gap-2 px-5 py-5 text-xs text-ink-soft sm:flex-row sm:justify-between">
          <p>© <Year /> Clause. All rights reserved.</p>
          <p>AI 審查結果僅供參考,不構成法律意見;重要合約請諮詢專業律師。</p>
        </div>
      </div>
    </footer>
  );
}
