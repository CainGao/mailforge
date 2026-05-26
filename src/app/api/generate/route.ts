// @ts-nocheck
import { NextRequest, NextResponse } from "next/server";
import { createClient, SupabaseClient } from "@supabase/supabase-js";

const FREE_LIMIT = 3;
const LOGGED_IN_FREE_LIMIT = 5;
const PRO_LIMIT = 1000;

function getSupabase(): SupabaseClient | null {
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_KEY;
  if (!url || !key) return null;
  return createClient(url, key);
}

const LANGUAGE_NAMES: Record<string, string> = {
  en: "English", es: "Spanish", pt: "Portuguese", ar: "Arabic",
  fr: "French", de: "German", ru: "Russian", ja: "Japanese",
  ko: "Korean", it: "Italian",
};

const STYLE_PROMPTS: Record<string, string> = {
  formal: "Write in a formal, professional business tone.",
  friendly: "Write in a warm, approachable tone. Be personable but professional.",
  concise: "Write in a concise, direct style. Get straight to the point.",
};

export async function POST(req: NextRequest) {
  try {
    const { productName, productDesc, targetMarket, language, style, userEmail } = await req.json();

    if (!productName || !productDesc) {
      return NextResponse.json({ error: "请填写产品名称和产品描述" }, { status: 400 });
    }

    const supabase = getSupabase();
    const isPro = await checkProStatus(userEmail, supabase);

    const limit = isPro ? PRO_LIMIT : (userEmail ? LOGGED_IN_FREE_LIMIT : FREE_LIMIT);
    const used = await getTodayUsage(userEmail, supabase);
    if (used >= limit) {
      const msg = isPro
        ? `今日已使用${used}次，Pro版每日上限${PRO_LIMIT}次`
        : userEmail
          ? "今日免费次数已用完，升级Pro版每日1000次"
          : "今日免费次数已用完，请登录后继续使用";
      return NextResponse.json({ error: msg, limit: true });
      await incrementUsage(userEmail, supabase);
    }

    const langName = LANGUAGE_NAMES[language] || "English";
    const styleInstruction = STYLE_PROMPTS[style] || STYLE_PROMPTS.formal;

    const prompt = `You are an expert foreign trade email writer with 15 years of experience in international B2B sales.

TASK: Write a professional cold outreach email for the following product:

PRODUCT: ${productName}
DESCRIPTION: ${productDesc}
TARGET MARKET: ${targetMarket}
LANGUAGE: Write the entire email in ${langName}
STYLE: ${styleInstruction}

REQUIREMENTS:
1. Start with "Subject: " followed by a compelling subject line
2. Opening hook that grabs attention
3. 2-3 key benefits (not features)
4. One proof point (price, certification, or unique advantage)
5. Clear call-to-action
6. Professional signature placeholder
7. 150-250 words
8. No generic phrases like "I hope this email finds you well"
9. Make it feel personal, not templated
10. If Arabic, use proper RTL formatting

Write ONLY the email content.`;

    const aiResult = await callAI(prompt);
    if (!aiResult) {
      return NextResponse.json({ error: "AI生成失败，请重试" }, { status: 500 });
    }

    return NextResponse.json({ email: aiResult });
  } catch (error) {
    console.error("Generate error:", error);
    return NextResponse.json({ error: "服务器错误" }, { status: 500 });
  }
}

async function checkProStatus(email?: string, supabase?: SupabaseClient | null): Promise<boolean> {
  if (!email || !supabase) return false;
  const { data } = await supabase.from("users").select("plan, plan_expires_at").eq("email", email).single();
  if (!data || data.plan !== "pro") return false;
  if (data.plan_expires_at && new Date(data.plan_expires_at) < new Date()) return false;
  return true;
}

async function getTodayUsage(email?: string, supabase?: SupabaseClient | null): Promise<number> {
  if (!email || !supabase) return 0;
  const today = new Date().toISOString().split("T")[0];
  const { data } = await supabase.from("usage").select("count").eq("email", email).eq("date", today).single();
  return data?.count || 0;
}

async function incrementUsage(email?: string, supabase?: SupabaseClient | null): Promise<void> {
  if (!email || !supabase) return;
  const today = new Date().toISOString().split("T")[0];
  const { data } = await supabase.from("usage").select("count").eq("email", email).eq("date", today).single();
  if (data) {
    await supabase.from("usage").update({ count: data.count + 1 }).eq("email", email).eq("date", today);
  } else {
    await supabase.from("usage").insert({ email, date: today, count: 1 });
  }
}

async function callAI(prompt: string): Promise<string | null> {
  const model = process.env.AI_MODEL || "glm-5";
  if (!process.env.ZHIPU_API_KEY) return null;
  try {
    const res = await fetch("https://open.bigmodel.cn/api/coding/paas/v4/chat/completions", {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${process.env.ZHIPU_API_KEY}` },
      body: JSON.stringify({ model, messages: [{ role: "user", content: prompt }], temperature: 0.7, max_tokens: 1000 }),
    });
    const data = await res.json();
    // GLM-5 may return content in reasoning_content when reasoning mode is active
    const content = data.choices?.[0]?.message?.content?.trim();
    const reasoningContent = data.choices?.[0]?.message?.reasoning_content?.trim();
    return (content || reasoningContent) || null;
  } catch (e) {
    console.error("AI error:", e);
    return null;
  }
}
