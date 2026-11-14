import bcrypt from "bcryptjs";
import { createSession } from "@/lib/auth";
import { connectDB } from "@/lib/mongodb";
import { User } from "@/models/User";

// 用來在查無使用者時仍執行一次比對,避免用回應時間判斷 Email 是否存在
const DUMMY_HASH = bcrypt.hashSync("dummy-password-for-timing", 12);

export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => null);
    const email = typeof body?.email === "string" ? body.email.trim().toLowerCase() : "";
    const password = typeof body?.password === "string" ? body.password : "";

    await connectDB();
    const user = email ? await User.findOne({ email }) : null;
    const ok = await bcrypt.compare(password, user?.passwordHash ?? DUMMY_HASH);

    if (!user || !ok) {
      return Response.json({ error: "Email 或密碼錯誤" }, { status: 401 });
    }

    await createSession({ userId: user.id, email: user.email });
    return Response.json({ email: user.email });
  } catch (e) {
    console.error(e);
    return Response.json({ error: "登入失敗" }, { status: 500 });
  }
}
