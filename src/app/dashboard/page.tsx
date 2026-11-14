import { redirect } from "next/navigation";
import ReviewApp from "@/components/ReviewApp";
import { getSession } from "@/lib/auth";

export default async function DashboardPage() {
  if (!(await getSession())) redirect("/login");

  return (
    <div className="bg-glow">
      <div className="mx-auto max-w-4xl space-y-10 px-5 py-14">
        <header>
          <p className="text-sm font-medium text-accent">我的工作區</p>
          <h1 className="mt-2 font-serif text-3xl font-bold tracking-tight sm:text-4xl">合約審查</h1>
          <p className="mt-3 max-w-xl text-sm leading-relaxed text-ink-soft">
            上傳合約(PDF / TXT / MD,4MB 內),AI 會標出風險與建議。你的合約只有你自己看得到。
          </p>
        </header>
        <ReviewApp />
      </div>
    </div>
  );
}
