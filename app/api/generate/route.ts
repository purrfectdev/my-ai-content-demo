// app/api/generate/route.ts
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const { prompt, type } = await req.json();

  const systemPrompts = {
    title:
      "你是一个专业的文案撰写专家。根据用户输入的关键词，生成3个吸引人的标题。每个标题占一行，不要加序号。",
    content:
      "你是一个资深内容创作者。根据用户输入的关键词，生成一篇300字左右的营销文案，语言生动有感染力。",
    seo: "你是一个SEO优化专家。根据用户输入的关键词，生成一段150字左右的SEO描述，包含关键词，自然流畅。",
  };

  try {
    const response = await fetch(
      "https://api.deepseek.com/v1/chat/completions",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.DEEPSEEK_API_KEY}`,
        },
        body: JSON.stringify({
          model: "deepseek-chat",
          messages: [
            {
              role: "system",
              content: systemPrompts[type as keyof typeof systemPrompts],
            },
            { role: "user", content: prompt },
          ],
          stream: true,
        }),
      },
    );

    return new Response(response.body, {
      headers: {
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache",
      },
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "生成失败" }, { status: 500 });
  }
}
