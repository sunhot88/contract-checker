import { put } from "@vercel/blob";
import { getSession } from "@/lib/auth";
import { connectDB } from "@/lib/mongodb";
import { reviewContract } from "@/lib/openai";
import { Review } from "@/models/Review";

export const maxDuration = 120;

const MAX_SIZE = 4 * 1024 * 1024; // Vercel 函式請求上限約 4.5MB
const ALLOWED_EXT = [".pdf", ".txt", ".md"];

export async function POST(request: Request) {
  const session = await getSession();
  if (!session) return Response.json({ error: "請先登入" }, { status: 401 });

  try {
    const form = await request.formData();
    const file = form.get("file");

    if (!(file instanceof File) || file.size === 0) {
      return Response.json({ error: "請上傳檔案" }, { status: 400 });
    }
    if (file.size > MAX_SIZE) {
      return Response.json({ error: "檔案不可超過 4MB" }, { status: 400 });
    }
    if (!ALLOWED_EXT.some((ext) => file.name.toLowerCase().endsWith(ext))) {
      return Response.json({ error: "僅支援 PDF、TXT、MD 檔案" }, { status: 400 });
    }

    // 1. 先呼叫 OpenAI 審查(失敗就不會留下孤兒檔案)  2. 以私有方式存到 Vercel Blob
    const result = await reviewContract(file);
    const blob = await put(`contracts/${session.userId}/${file.name}`, file, {
      access: "private",
      addRandomSuffix: true,
    });

    // 3. 存進 MongoDB,綁定會員
    await connectDB();
    const review = await Review.create({
      userId: session.userId,
      fileName: file.name,
      fileSize: file.size,
      fileType: file.type,
      blobUrl: blob.url,
      result,
    });

    return Response.json(
      {
        _id: review.id,
        fileName: review.fileName,
        createdAt: review.get("createdAt"),
        result: review.result,
      },
      { status: 201 },
    );
  } catch (e) {
    console.error(e);
    return Response.json({ error: e instanceof Error ? e.message : "審查失敗" }, { status: 500 });
  }
}
