"use client";

import { useState } from "react";
import { useSession, signIn, signOut } from "next-auth/react";

const LANGUAGES = [
  { code: "en", name: "English 英语" },
  { code: "es", name: "Español 西班牙语" },
  { code: "pt", name: "Português 葡萄牙语" },
  { code: "ar", name: "العربية 阿拉伯语" },
  { code: "fr", name: "Français 法语" },
  { code: "de", name: "Deutsch 德语" },
  { code: "ru", name: "Русский 俄语" },
  { code: "ja", name: "日本語 日语" },
  { code: "ko", name: "한국어 韩语" },
  { code: "it", name: "Italiano 意大利语" },
];

const STYLES = [
  { code: "formal", name: "正式", icon: "👔" },
  { code: "friendly", name: "友好", icon: "😊" },
  { code: "concise", name: "简洁", icon: "⚡" },
];

export default function Home() {
  const { data: session } = useSession();
  const isPro = (session?.user as any)?.plan === "pro";
  const [productName, setProductName] = useState("");
  const [productDesc, setProductDesc] = useState("");
  const [targetMarket, setTargetMarket] = useState("美国");
  const [language, setLanguage] = useState("en");
  const [style, setStyle] = useState("formal");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState("");
  const [copied, setCopied] = useState(false);
  const [usageCount, setUsageCount] = useState(0);

  const generate = async () => {
    if (!productName.trim() || !productDesc.trim()) {
      alert("请填写产品名称和产品描述");
      return;
    }
    setLoading(true);
    setResult("");
    setCopied(false);
    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productName, productDesc, targetMarket, language, style, userEmail: session?.user?.email }),
      });
      const data = await res.json();
      if (data.error) {
        alert(data.error);
      } else {
        setResult(data.email);
        setUsageCount((prev) => prev + 1);
      }
    } catch {
      alert("生成失败，请重试");
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(result);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <main className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900">
      {/* Header */}
      <header className="border-b border-slate-700/50 backdrop-blur-sm">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="text-2xl">✉️</div>
            <div>
              <h1 className="text-xl font-bold text-white">MailForge</h1>
              <p className="text-xs text-slate-400">AI外贸开发信生成器</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {process.env.NEXT_PUBLIC_GOOGLE_ENABLED && session ? (
              <div className="flex items-center gap-3">
                <span className="text-sm text-slate-300">
                  {session.user?.name}
                  {(session.user as any)?.plan === "pro" && (
                    <span className="ml-1 text-xs bg-blue-600 px-2 py-0.5 rounded">Pro</span>
                  )}
                </span>
                <button onClick={() => signOut()} className="text-xs text-slate-500 hover:text-white">退出</button>
              </div>
            ) : process.env.NEXT_PUBLIC_GOOGLE_ENABLED ? (
              <button onClick={() => signIn("google")} className="text-sm text-slate-300 hover:text-white border border-slate-600 px-3 py-1.5 rounded-lg">
                登录
              </button>
            ) : null}
            <a href="#pricing" className="text-sm bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-lg transition">
              升级Pro ✨
            </a>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="max-w-4xl mx-auto px-4 pt-12 pb-8 text-center">
        <h2 className="text-4xl font-bold text-white mb-4">
          写出让老外<span className="text-blue-400">秒回</span>的开发信
        </h2>
        <p className="text-lg text-slate-300 mb-2">
          1分钟生成专业外贸开发信，支持10种语言
        </p>
        <p className="text-sm text-slate-500">
          已有 1,000+ 外贸卖家在使用
        </p>
      </section>

      {/* Main Form */}
      <section className="max-w-3xl mx-auto px-4 pb-8">
        <div className="bg-slate-800/50 border border-slate-700/50 rounded-2xl p-6 space-y-5">
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1.5">
              产品名称 <span className="text-red-400">*</span>
            </label>
            <input
              type="text" value={productName} onChange={(e) => setProductName(e.target.value)}
              placeholder='例如："蓝牙降噪耳机 Pro X3"'
              className="w-full bg-slate-900/50 border border-slate-600 rounded-lg px-4 py-2.5 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1.5">
              产品描述 <span className="text-red-400">*</span>
            </label>
            <textarea
              value={productDesc} onChange={(e) => setProductDesc(e.target.value)}
              placeholder="描述你的产品：功能特点、规格、价格区间、起订量、认证等..."
              rows={3}
              className="w-full bg-slate-900/50 border border-slate-600 rounded-lg px-4 py-2.5 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1.5">目标市场</label>
              <input
                type="text" value={targetMarket} onChange={(e) => setTargetMarket(e.target.value)}
                placeholder="例如：美国、中东、东南亚"
                className="w-full bg-slate-900/50 border border-slate-600 rounded-lg px-4 py-2.5 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1.5">开发信语言</label>
              <select
                value={language} onChange={(e) => setLanguage(e.target.value)}
                className="w-full bg-slate-900/50 border border-slate-600 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {LANGUAGES.map((l) => (
                  <option key={l.code} value={l.code}>{l.name}</option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1.5">邮件风格</label>
            <div className="flex gap-3">
              {STYLES.map((s) => (
                <button
                  key={s.code} onClick={() => setStyle(s.code)}
                  className={`flex-1 py-2.5 px-4 rounded-lg border text-sm font-medium transition ${
                    style === s.code
                      ? "bg-blue-600 border-blue-500 text-white"
                      : "bg-slate-900/30 border-slate-600 text-slate-400 hover:border-slate-500"
                  }`}
                >
                  {s.icon} {s.name}
                </button>
              ))}
            </div>
          </div>

          <button
            onClick={generate} disabled={loading}
            className="w-full bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 disabled:from-slate-600 disabled:to-slate-600 text-white font-semibold py-3 rounded-lg transition text-lg"
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
                生成中...
              </span>
            ) : "✨ 生成开发信"}
          </button>

          <p className="text-center text-xs text-slate-500">
            今日剩余：{isPro ? "无限" : <>{session ? 5 - usageCount : 3 - usageCount}/{session ? 5 : 3}</>} 次 ·{" "}
            <a href="#pricing" className="text-blue-400 hover:underline">升级无限次</a>
          </p>
        </div>
      </section>

      {/* Result */}
      {result && (
        <section className="max-w-3xl mx-auto px-4 pb-8">
          <div className="bg-slate-800/50 border border-slate-700/50 rounded-2xl p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-white">📧 你的开发信</h3>
              <div className="flex gap-2">
                <button onClick={copyToClipboard}
                  className="text-sm bg-slate-700 hover:bg-slate-600 text-white px-4 py-2 rounded-lg transition flex items-center gap-1.5">
                  {copied ? "✅ 已复制！" : "📋 复制"}
                </button>
                <button onClick={generate}
                  className="text-sm bg-slate-700 hover:bg-slate-600 text-white px-4 py-2 rounded-lg transition flex items-center gap-1.5">
                  🔄 重新生成
                </button>
              </div>
            </div>
            <div className="bg-slate-900/50 rounded-lg p-4 text-slate-200 whitespace-pre-wrap font-mono text-sm leading-relaxed border border-slate-700/50">
              {result}
            </div>
          </div>
        </section>
      )}

      {/* Features */}
      <section className="max-w-4xl mx-auto px-4 py-12">
        <h3 className="text-2xl font-bold text-white text-center mb-8">为什么选 MailForge？</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            { icon: "🌍", title: "10种语言", desc: "英语、西班牙语、阿拉伯语、葡萄牙语、法语等，覆盖全球主要市场" },
            { icon: "⚡", title: "30秒出结果", desc: "只需描述产品，AI立刻生成专业开发信" },
            { icon: "📈", title: "更高回复率", desc: "AI优化的标题和内容，让买家真正回复你" },
          ].map((f, i) => (
            <div key={i} className="bg-slate-800/30 border border-slate-700/50 rounded-xl p-5 text-center">
              <div className="text-3xl mb-3">{f.icon}</div>
              <h4 className="text-white font-semibold mb-2">{f.title}</h4>
              <p className="text-sm text-slate-400">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="max-w-3xl mx-auto px-4 py-12">
        <h3 className="text-2xl font-bold text-white text-center mb-8">简单定价</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-slate-800/50 border border-slate-700/50 rounded-2xl p-6">
            <h4 className="text-lg font-semibold text-white mb-1">免费版</h4>
            <p className="text-3xl font-bold text-white mb-4">
              ¥0<span className="text-sm text-slate-400">/永久</span>
            </p>
            <ul className="space-y-2 text-sm text-slate-300 mb-6">
              <li>✅ 每天3次生成</li>
              <li>✅ 10种语言</li>
              <li>✅ 3种邮件风格</li>
              <li>❌ 无模板库</li>
              <li>❌ 无批量生成</li>
            </ul>
            <button className="w-full bg-slate-700 hover:bg-slate-600 text-white py-2.5 rounded-lg transition">
              免费开始使用
            </button>
          </div>
          <div className="bg-gradient-to-b from-blue-900/50 to-slate-800/50 border border-blue-500/50 rounded-2xl p-6 relative">
            <div className="absolute -top-3 right-4 bg-blue-500 text-white text-xs px-3 py-1 rounded-full font-medium">
              推荐
            </div>
            <h4 className="text-lg font-semibold text-white mb-1">Pro版</h4>
            <p className="text-3xl font-bold text-white mb-4">
              $9.9<span className="text-sm text-slate-400">/月</span>
            </p>
            <ul className="space-y-2 text-sm text-slate-300 mb-6">
              <li>✅ 无限次生成</li>
              <li>✅ 10种语言</li>
              <li>✅ 所有邮件风格</li>
              <li>✅ 模板库</li>
              <li>✅ 优先生成速度</li>
            </ul>
            <form action="https://www.paypal.com/cgi-bin/webscr" method="post" target="_blank">
              <input type="hidden" name="cmd" value="_xclick-subscriptions" />
              <input type="hidden" name="business" value="gerylove5927@gmail.com" />
              <input type="hidden" name="item_name" value="MailForge Pro - Monthly Subscription" />
              <input type="hidden" name="a3" value="9.90" />
              <input type="hidden" name="p3" value="1" />
              <input type="hidden" name="t3" value="M" />
              <input type="hidden" name="currency_code" value="USD" />
              <input type="hidden" name="return" value="https://forge.aisense.top" />
              <button type="submit" className="w-full bg-blue-600 hover:bg-blue-500 text-white py-2.5 rounded-lg transition font-semibold">
                订阅 Pro ✨
              </button>
            </form>
          </div>
        </div>
        <div className="text-center mt-4">
          <p className="text-sm text-slate-400">
            💡 年付更划算：
          </p>
          <form action="https://www.paypal.com/cgi-bin/webscr" method="post" target="_blank" className="inline-block mt-2">
            <input type="hidden" name="cmd" value="_xclick-subscriptions" />
            <input type="hidden" name="business" value="gerylove5927@gmail.com" />
            <input type="hidden" name="item_name" value="MailForge Pro - Yearly Subscription" />
            <input type="hidden" name="a3" value="49.00" />
            <input type="hidden" name="p3" value="1" />
            <input type="hidden" name="t3" value="Y" />
            <input type="hidden" name="currency_code" value="USD" />
            <input type="hidden" name="return" value="https://forge.aisense.top" />
            <button type="submit" className="text-blue-400 hover:text-blue-300 text-sm underline">
              $49/年（省$69）
            </button>
          </form>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-700/50 py-6">
        <div className="max-w-4xl mx-auto px-4 text-center text-sm text-slate-500">
          <p>
            © 2026 MailForge by{" "}
            <a href="https://aisense.top" className="text-blue-400 hover:underline">AI Sense</a>{" "}
            · Powered by AI
          </p>
        </div>
      </footer>
    </main>
  );
}
