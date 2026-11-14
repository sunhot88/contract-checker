import OpenAI from "openai";

const SYSTEM_PROMPT = `你是專業的合約審查助手。請審查使用者提供的合約,以繁體中文回覆,並只輸出 JSON,格式如下:
{
  "summary": "合約整體摘要(100~200字)",
  "riskLevel": "high | medium | low",
  "risks": [{ "clause": "相關條款或原文片段", "level": "high | medium | low", "issue": "風險說明", "suggestion": "修改建議" }],
  "missingClauses": ["建議補充但缺少的條款"]
}
若內容不是合約,summary 說明原因,risks 與 missingClauses 回傳空陣列,riskLevel 為 low。本結果僅供參考,不構成法律意見。`;

export type ReviewResult = {
  summary: string;
  riskLevel: "high" | "medium" | "low";
  risks: { clause: string; level: "high" | "medium" | "low"; issue: string; suggestion: string }[];
  missingClauses: string[];
};

export async function reviewContract(file: File): Promise<ReviewResult> {
  const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
  const isPdf = file.type === "application/pdf" || file.name.toLowerCase().endsWith(".pdf");

  const content = isPdf
    ? [
        {
          type: "input_file" as const,
          filename: file.name,
          file_data: `data:application/pdf;base64,${Buffer.from(await file.arrayBuffer()).toString("base64")}`,
        },
        { type: "input_text" as const, text: "請審查這份合約,並以 JSON 格式輸出。" },
      ]
    : [{ type: "input_text" as const, text: `請審查這份合約,並以 JSON 格式輸出:\n\n${await file.text()}` }];

  const response = await client.responses.create({
    model: process.env.OPENAI_MODEL ?? "gpt-4o",
    instructions: SYSTEM_PROMPT,
    input: [{ role: "user", content }],
    text: { format: { type: "json_object" } },
  });

  return JSON.parse(response.output_text) as ReviewResult;
}
