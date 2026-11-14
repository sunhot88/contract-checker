import bcrypt from "bcryptjs";
import { createSession } from "@/lib/auth";
import { connectDB } from "@/lib/mongodb";
import { User } from "@/models/User";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => null);
    const email = typeof body?.email === "string" ? body.email.trim().toLowerCase() : "";
    const password = typeof body?.password === "string" ? body.password : "";

    if (!EMAIL_RE.test(email) || email.length > 254) {
      return Response.json({ error: "Email 格式不正確" }, { status: 400 });
    }
    if (password.length < 8 || password.length > 72) {
      return Response.json({ error: "密碼長度需為 8~72 字元" }, { status: 400 });
    }

    await connectDB();
    if (await User.exists({ email })) {
      return Response.json({ error: "此 Email 已被註冊" }, { status: 409 });
    }

    const passwordHash = await bcrypt.hash(password, 12);
    const user = await User.create({ email, passwordHash });
    await createSession({ userId: user.id, email: user.email });

    return Response.json({ email: user.email }, { status: 201 });
  } catch (e) {
    if ((e as { code?: number }).code === 11000) {
      return Response.json({ error: "此 Email 已被註冊" }, { status: 409 });
    }
    console.error(e);
    return Response.json({ error: "註冊失敗" }, { status: 500 });
  }
}
