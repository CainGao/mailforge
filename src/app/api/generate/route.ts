import { NextRequest, NextResponse } from "next/server";

const STYLE_PROMPTS: Record<string, string> = {
  formal:
    "Write in a formal, professional business tone. Use proper salutations and closings. Be respectful and use industry-standard language.",
  friendly:
    "Write in a warm, approachable tone. Be personable but still professional. Use a conversational style that builds rapport.",
  concise:
    "Write in a concise, direct style. Get straight to the point. Short paragraphs, clear value proposition, and a strong call-to-action.",
};

const LANGUAGE_NAMES: Record<string, string> = {
  en: "English",
  es: "Spanish",
  pt: "Portuguese",
  ar: "Arabic",
  fr: "French",
  de: "German",
  ru: "Russian",
  ja: "Japanese",
  ko: "Korean",
  it: "Italian",
};

export async function POST(req: NextRequest) {
  try {
    const { productName, productDesc, targetMarket, language, style } =
      await req.json();

    if (!productName || !productDesc) {
      return NextResponse.json(
        { error: "Product name and description are required" },
        { status: 400 }
      );
    }

    const langName = LANGUAGE_NAMES[language] || "English";
    const styleInstruction = STYLE_PROMPTS[style] || STYLE_PROMPTS.formal;

    const prompt = `You are an expert foreign trade email writer with 15 years of experience in international B2B sales.

TASK: Write a professional cold outreach email (development letter/开发信) for the following product:

PRODUCT: ${productName}
DESCRIPTION: ${productDesc}
TARGET MARKET: ${targetMarket}
LANGUAGE: Write the entire email in ${langName}
STYLE: ${styleInstruction}

REQUIREMENTS:
1. Start with a compelling subject line prefixed with "Subject: "
2. Opening hook that grabs attention (mention a pain point or opportunity)
3. Brief but powerful product introduction (2-3 key benefits, not features)
4. One specific proof point (price advantage, certification, or unique selling point)
5. Clear, low-pressure call-to-action (ask for a reply or short call)
6. Professional signature placeholder
7. Keep it between 150-250 words
8. Do NOT use generic phrases like "I hope this email finds you well"
9. Make it feel personal, not templated
10. If writing in Arabic, use proper right-to-left formatting

Write ONLY the email content, no explanations or meta-text.`;

    // Try Zhipu (GLM) first, then DeepSeek, then OpenAI as fallback
    const aiResult = await callAI(prompt);

    if (!aiResult) {
      return NextResponse.json(
        { error: "AI generation failed. Please try again." },
        { status: 500 }
      );
    }

    return NextResponse.json({ email: aiResult });
  } catch (error) {
    console.error("Generate error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

async function callAI(prompt: string): Promise<string | null> {
  // Zhipu GLM-4
  if (process.env.ZHIPU_API_KEY) {
    try {
      const res = await fetch(
        "https://open.bigmodel.cn/api/coding/paas/v4/chat/completions",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${process.env.ZHIPU_API_KEY}`,
          },
          body: JSON.stringify({
            model: process.env.AI_MODEL || "glm-5",
            messages: [{ role: "user", content: prompt }],
            temperature: 0.7,
            max_tokens: 1000,
          }),
        }
      );
      const data = await res.json();
      if (data.choices?.[0]?.message?.content) {
        return data.choices[0].message.content.trim();
      }
    } catch (e) {
      console.error("Zhipu error:", e);
    }
  }

  // DeepSeek fallback
  if (process.env.DEEPSEEK_API_KEY) {
    try {
      const res = await fetch(
        "https://api.deepseek.com/v1/chat/completions",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${process.env.DEEPSEEK_API_KEY}`,
          },
          body: JSON.stringify({
            model: "deepseek-chat",
            messages: [{ role: "user", content: prompt }],
            temperature: 0.7,
            max_tokens: 1000,
          }),
        }
      );
      const data = await res.json();
      if (data.choices?.[0]?.message?.content) {
        return data.choices[0].message.content.trim();
      }
    } catch (e) {
      console.error("DeepSeek error:", e);
    }
  }

  // OpenAI fallback
  if (process.env.OPENAI_API_KEY) {
    try {
      const res = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
        },
        body: JSON.stringify({
          model: "gpt-4o-mini",
          messages: [{ role: "user", content: prompt }],
          temperature: 0.7,
          max_tokens: 1000,
        }),
      });
      const data = await res.json();
      if (data.choices?.[0]?.message?.content) {
        return data.choices[0].message.content.trim();
      }
    } catch (e) {
      console.error("OpenAI error:", e);
    }
  }

  return null;
}
