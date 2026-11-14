import { getSession } from "@/lib/auth";
import { connectDB } from "@/lib/mongodb";
import { Review } from "@/models/Review";

export async function GET() {
  const session = await getSession();
  if (!session) return Response.json({ error: "請先登入" }, { status: 401 });

  try {
    await connectDB();
    // 只取自己的紀錄;不回傳 blobUrl(私有檔案需透過 /api/reviews/[id]/file 下載)
    const reviews = await Review.find({ userId: session.userId })
      .select("-blobUrl -userId")
      .sort({ createdAt: -1 })
      .limit(50)
      .lean();
    return Response.json(reviews);
  } catch (e) {
    console.error(e);
    return Response.json({ error: "讀取失敗" }, { status: 500 });
  }
}
