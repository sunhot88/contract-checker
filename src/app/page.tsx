import Link from "next/link";
import { getSession } from "@/lib/auth";

const STEPS = [
  { n: "01", title: "上傳合約", body: "拖曳 PDF、TXT 或 Markdown 檔案。檔案以私有方式加密儲存,只有你能開啟。" },
  { n: "02", title: "AI 逐條審閱", body: "模型通讀全文,辨識不對等條款、模糊用語與潛在的違約風險。" },
  { n: "03", title: "取得審查報告", body: "數秒內獲得白話摘要、風險分級、修改建議,以及合約中缺少的重要條款。" },
];

const FEATURES = [
  { title: "風險分級標示", body: "每個問題條款都標上高、中、低風險,讓你一眼看出該先談哪一條。" },
  { title: "白話合約摘要", body: "把冗長的法律文字濃縮成一段看得懂的重點,不必逐字啃完。" },
  { title: "具體修改建議", body: "不只指出問題,還告訴你可以怎麼改、該向對方要求什麼。" },
  { title: "缺漏條款提醒", body: "找出合約裡該有卻沒有的條款,例如不可抗力、違約賠償、爭議解決。" },
  { title: "私有安全儲存", body: "原檔存放於私有儲存空間,需登入並通過本人驗證才能開啟。" },
  { title: "完整歷史紀錄", body: "每次審查自動保存,隨時回頭比對不同版本的合約。" },
];

const FAQ = [
  { q: "AI 的審查結果可以取代律師嗎?", a: "不行。Clause 是協助你快速掌握風險與重點的工具,結果僅供參考,不構成法律意見。涉及重大權益的合約,請務必諮詢專業律師。" },
  { q: "我的合約會被其他人看到嗎?", a: "不會。每份合約都綁定你的帳號,原檔以私有方式儲存,只有登入後的本人可以檢視與下載。" },
  { q: "支援哪些檔案格式?檔案大小有限制嗎?", a: "目前支援 PDF、TXT 與 Markdown,單檔上限 4MB。Word 檔案支援正在規劃中。" },
  { q: "掃描版的 PDF 也能審查嗎?", a: "建議使用可選取文字的 PDF 以獲得最佳結果;純圖片掃描檔的辨識品質可能較不穩定。" },
];

function ResultPreview() {
  return (
    <div className="relative mx-auto w-full max-w-md">
      <div className="absolute -inset-4 -z-10 rotate-2 rounded-[2rem] bg-accent-tint/70" aria-hidden />
      <div className="shadow-card rounded-2xl border border-line bg-surface p-5">
        <div className="flex items-center justify-between border-b border-line pb-4">
          <div className="flex items-center gap-3">
            <span className="grid size-9 place-items-center rounded-lg bg-paper-2 font-mono text-[10px] font-medium text-ink-soft">PDF</span>
            <div>
              <p className="text-sm font-medium">房屋租賃契約書.pdf</p>
              <p className="text-xs text-ink-soft">審查完成 · 4.6 秒</p>
            </div>
          </div>
          <span className="rounded-full bg-risk-high-bg px-2.5 py-1 text-xs font-medium text-risk-high">高風險</span>
        </div>

        <p className="py-4 text-sm leading-relaxed text-ink-soft">
          本合約對承租方較為不利,含有單方解約與模糊的修繕責任條款,簽署前建議協商以下 3 點。
        </p>

        <ul className="space-y-2.5">
          {[
            { level: "高", cls: "bg-risk-high-bg text-risk-high", t: "出租人得隨時單方終止租約", s: "建議:加入合理預告期與補償條款" },
            { level: "中", cls: "bg-risk-mid-bg text-risk-mid", t: "修繕責任歸屬未明確", s: "建議:區分自然損耗與人為損壞" },
            { level: "低", cls: "bg-risk-low-bg text-risk-low", t: "押金返還期限偏長", s: "建議:約定於搬離後 14 日內返還" },
          ].map((r) => (
            <li key={r.t} className="rounded-xl border border-line bg-paper/60 p-3">
              <div className="flex items-center gap-2">
                <span className={`rounded px-1.5 py-0.5 text-[11px] font-semibold ${r.cls}`}>{r.level}</span>
                <span className="text-sm font-medium">{r.t}</span>
              </div>
              <p className="mt-1 pl-0.5 text-xs text-ink-soft">{r.s}</p>
            </li>
          ))}
        </ul>
      </div>
      <p className="mt-3 text-center text-xs text-ink-soft">示意畫面</p>
    </div>
  );
}

export default async function LandingPage() {
  const session = await getSession();
  const primaryHref = session ? "/dashboard" : "/register";
  const primaryLabel = session ? "前往我的工作區" : "免費開始審查";

  return (
    <>
      {/* Hero */}
      <section className="bg-glow">
        <div className="mx-auto grid max-w-6xl items-center gap-14 px-5 pb-20 pt-16 md:pt-24 lg:grid-cols-[1.15fr_1fr]">
          <div className="fade-up">
            <p className="mb-6 inline-flex items-center gap-2 rounded-full border border-line bg-surface px-3.5 py-1.5 text-xs text-ink-soft">
              <span className="size-1.5 rounded-full bg-accent" aria-hidden />
              AI 合約審查助手
            </p>
            <h1 className="font-serif text-4xl font-bold leading-[1.18] tracking-tight sm:text-5xl lg:text-6xl">
              簽名之前,
              <br />
              先讀懂每一條<span className="text-accent">風險</span>。
            </h1>
            <p className="mt-6 max-w-xl text-lg leading-relaxed text-ink-soft">
              上傳合約,數秒內獲得白話摘要、風險分級與具體修改建議。不必再獨自面對密密麻麻的條文。
            </p>
            <div className="mt-9 flex flex-wrap items-center gap-3">
              <Link href={primaryHref} className="rounded-full bg-accent px-7 py-3.5 text-sm font-medium text-accent-ink transition hover:opacity-90">
                {primaryLabel} →
              </Link>
              <Link href="/#how" className="rounded-full border border-line bg-surface px-7 py-3.5 text-sm font-medium transition hover:border-ink">
                看看如何運作
              </Link>
            </div>
            <p className="mt-6 text-xs text-ink-soft">支援 PDF · TXT · Markdown　|　私有儲存　|　結果僅供參考,不構成法律意見</p>
          </div>

          <div className="fade-up [animation-delay:150ms]">
            <ResultPreview />
          </div>
        </div>
      </section>

      {/* How it works */}
      <section id="how" className="scroll-mt-20 border-y border-line bg-surface">
        <div className="mx-auto max-w-6xl px-5 py-24">
          <div className="max-w-2xl">
            <p className="text-sm font-medium text-accent">運作流程</p>
            <h2 className="mt-3 font-serif text-3xl font-bold tracking-tight sm:text-4xl">三個步驟,從上傳到看懂</h2>
          </div>
          <ol className="mt-14 grid gap-px overflow-hidden rounded-2xl border border-line bg-line md:grid-cols-3">
            {STEPS.map((s) => (
              <li key={s.n} className="bg-surface p-8">
                <span className="font-mono text-sm text-accent">{s.n}</span>
                <h3 className="mt-6 font-serif text-xl font-bold">{s.title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-ink-soft">{s.body}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="scroll-mt-20">
        <div className="mx-auto max-w-6xl px-5 py-24">
          <div className="max-w-2xl">
            <p className="text-sm font-medium text-accent">功能特色</p>
            <h2 className="mt-3 font-serif text-3xl font-bold tracking-tight sm:text-4xl">
              把律師的審閱習慣,<br className="hidden sm:block" />變成你的日常工具
            </h2>
          </div>
          <div className="mt-14 grid gap-x-10 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
            {FEATURES.map((f, i) => (
              <div key={f.title} className="border-t border-ink pt-5">
                <span className="font-mono text-xs text-ink-soft">{String(i + 1).padStart(2, "0")}</span>
                <h3 className="mt-3 font-serif text-lg font-bold">{f.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-ink-soft">{f.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Security */}
      <section id="security" className="scroll-mt-20 bg-ink text-paper">
        <div className="mx-auto grid max-w-6xl gap-12 px-5 py-24 lg:grid-cols-2 lg:items-center">
          <div>
            <p className="text-sm font-medium text-accent-tint">安全與隱私</p>
            <h2 className="mt-3 font-serif text-3xl font-bold tracking-tight sm:text-4xl">你的合約,只有你看得到。</h2>
            <p className="mt-5 max-w-lg leading-relaxed text-paper/70">
              合約往往包含最敏感的商業與個人資訊。我們從一開始就把隔離與保密當成基本要求,而不是附加功能。
            </p>
          </div>
          <ul className="space-y-4">
            {[
              ["帳號綁定", "每份合約與審查結果都綁定上傳者帳號,其他會員無法讀取。"],
              ["私有儲存", "原檔存放於私有空間,下載需通過登入與擁有者驗證。"],
              ["密碼加密", "密碼經 bcrypt 雜湊後儲存,我們不會、也無法看到你的明文密碼。"],
            ].map(([t, d]) => (
              <li key={t} className="flex gap-4 rounded-xl border border-paper/15 bg-paper/5 p-5">
                <span className="mt-0.5 grid size-6 shrink-0 place-items-center rounded-full bg-accent-tint text-ink" aria-hidden>
                  <svg viewBox="0 0 24 24" className="size-3.5" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M5 12l5 5 9-10" />
                  </svg>
                </span>
                <div>
                  <p className="font-medium">{t}</p>
                  <p className="mt-1 text-sm leading-relaxed text-paper/65">{d}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="scroll-mt-20">
        <div className="mx-auto max-w-3xl px-5 py-24">
          <p className="text-sm font-medium text-accent">常見問題</p>
          <h2 className="mt-3 font-serif text-3xl font-bold tracking-tight sm:text-4xl">你可能想知道</h2>
          <div className="mt-10 divide-y divide-line border-y border-line">
            {FAQ.map((f) => (
              <details key={f.q} className="group py-5">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-medium">
                  {f.q}
                  <span className="text-xl text-ink-soft transition group-open:rotate-45" aria-hidden>+</span>
                </summary>
                <p className="mt-3 pr-8 text-sm leading-relaxed text-ink-soft">{f.a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="px-5 pb-24">
        <div className="mx-auto max-w-6xl overflow-hidden rounded-3xl bg-accent px-8 py-16 text-center text-accent-ink sm:px-16">
          <h2 className="font-serif text-3xl font-bold tracking-tight sm:text-4xl">下一份合約,先讓 Clause 看一遍。</h2>
          <p className="mx-auto mt-4 max-w-xl text-accent-ink/75">註冊只需 Email 與密碼,立即上傳第一份合約。</p>
          <Link href={primaryHref} className="mt-8 inline-block rounded-full bg-paper px-8 py-3.5 text-sm font-medium text-ink transition hover:bg-white">
            {primaryLabel} →
          </Link>
        </div>
      </section>
    </>
  );
}
