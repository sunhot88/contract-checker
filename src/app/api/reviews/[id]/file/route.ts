import { get } from "@vercel/blob";
import { isValidObjectId } from "mongoose";
import { getSession } from "@/lib/auth";
import { connectDB } from "@/lib/mongodb";
import { Review } from "@/models/Review";

export async function GET(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await getSession();
  if (!session) return Response.json({ error: "請先登入" }, { status: 401 });

  const { id } = await params;
  if (!isValidObjectId(id)) return Response.json({ error: "找不到檔案" }, { status: 404 });

  try {
    await connectDB();
    // 同時比對 userId:別人的紀錄一律當作不存在
    const review = await Review.findOne({ _id: id, userId: session.userId }).lean();
    if (!review) return Response.json({ error: "找不到檔案" }, { status: 404 });

    const blob = await get(review.blobUrl, { access: "private" });
    if (!blob || blob.statusCode !== 200) return Response.json({ error: "找不到檔案" }, { status: 404 });

    return new Response(blob.stream, {
      headers: {
        "Content-Type": blob.blob.contentType,
        "Content-Disposition": `inline; filename*=UTF-8''${encodeURIComponent(review.fileName)}`,
        "Cache-Control": "private, no-store",
        "X-Content-Type-Options": "nosniff",
      },
    });
  } catch (e) {
    console.error(e);
    return Response.json({ error: "讀取檔案失敗" }, { status: 500 });
  }
}
