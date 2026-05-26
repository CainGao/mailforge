"use client";

import { useState } from "react";

const LANGUAGES = [
  { code: "en", name: "English" },
  { code: "es", name: "Español" },
  { code: "pt", name: "Português" },
  { code: "ar", name: "العربية" },
  { code: "fr", name: "Français" },
  { code: "de", name: "Deutsch" },
  { code: "ru", name: "Русский" },
  { code: "ja", name: "日本語" },
  { code: "ko", name: "한국어" },
  { code: "it", name: "Italiano" },
];

const STYLES = [
  { code: "formal", name: "Formal", icon: "👔" },
  { code: "friendly", name: "Friendly", icon: "😊" },
  { code: "concise", name: "Concise", icon: "⚡" },
];

export default function Home() {
  const [productName, setProductName] = useState("");
  const [productDesc, setProductDesc] = useState("");
  const [targetMarket, setTargetMarket] = useState("United States");
  const [language, setLanguage] = useState("en");
  const [style, setStyle] = useState("formal");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState("");
  const [copied, setCopied] = useState(false);
  const [usageCount, setUsageCount] = useState(0);

  const generate = async () => {
    if (!productName.trim() || !productDesc.trim()) {
      alert("Please fill in product name and description");
      return;
    }

    setLoading(true);
    setResult("");
    setCopied(false);

    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          productName,
          productDesc,
          targetMarket,
          language,
          style,
        }),
      });

      const data = await res.json();
      if (data.error) {
        alert(data.error);
        if (data.limit) {
          // show upgrade prompt
        }
      } else {
        setResult(data.email);
        setUsageCount((prev) => prev + 1);
      }
    } catch {
      alert("Failed to generate. Please try again.");
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
              <p className="text-xs text-slate-400">
                AI-Powered Trade Email Generator
              </p>
            </div>
          </div>
          <a
            href="#pricing"
            className="text-sm bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-lg transition"
          >
            Get Pro ✨
          </a>
        </div>
      </header>

      {/* Hero */}
      <section className="max-w-4xl mx-auto px-4 pt-12 pb-8 text-center">
        <h2 className="text-4xl font-bold text-white mb-4">
          Write Trade Emails That <span className="text-blue-400">Get Replies</span>
        </h2>
        <p className="text-lg text-slate-300 mb-2">
          1 minute to generate a professional cold email in 10+ languages
        </p>
        <p className="text-sm text-slate-500">
          Used by 1,000+ foreign trade sellers worldwide
        </p>
      </section>

      {/* Main Form */}
      <section className="max-w-3xl mx-auto px-4 pb-8">
        <div className="bg-slate-800/50 border border-slate-700/50 rounded-2xl p-6 space-y-5">
          {/* Product Name */}
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1.5">
              Product Name <span className="text-red-400">*</span>
            </label>
            <input
              type="text"
              value={productName}
              onChange={(e) => setProductName(e.target.value)}
              placeholder='e.g. "Bluetooth Earbuds Pro X3"'
              className="w-full bg-slate-900/50 border border-slate-600 rounded-lg px-4 py-2.5 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {/* Product Description */}
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1.5">
              Product Description <span className="text-red-400">*</span>
            </label>
            <textarea
              value={productDesc}
              onChange={(e) => setProductDesc(e.target.value)}
              placeholder="Describe your product: features, specs, price range, MOQ, certifications..."
              rows={3}
              className="w-full bg-slate-900/50 border border-slate-600 rounded-lg px-4 py-2.5 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
            />
          </div>

          {/* Target Market & Language */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1.5">
                Target Market
              </label>
              <input
                type="text"
                value={targetMarket}
                onChange={(e) => setTargetMarket(e.target.value)}
                placeholder="e.g. United States"
                className="w-full bg-slate-900/50 border border-slate-600 rounded-lg px-4 py-2.5 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1.5">
                Email Language
              </label>
              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
                className="w-full bg-slate-900/50 border border-slate-600 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                {LANGUAGES.map((l) => (
                  <option key={l.code} value={l.code}>
                    {l.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Style */}
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1.5">
              Email Style
            </label>
            <div className="flex gap-3">
              {STYLES.map((s) => (
                <button
                  key={s.code}
                  onClick={() => setStyle(s.code)}
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

          {/* Generate Button */}
          <button
            onClick={generate}
            disabled={loading}
            className="w-full bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 disabled:from-slate-600 disabled:to-slate-600 text-white font-semibold py-3 rounded-lg transition text-lg"
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
                Generating...
              </span>
            ) : (
              "✨ Generate Email"
            )}
          </button>

          <p className="text-center text-xs text-slate-500">
            Free: {3 - usageCount}/3 remaining today ·{" "}
            <a href="#pricing" className="text-blue-400 hover:underline">
              Upgrade for unlimited
            </a>
          </p>
        </div>
      </section>

      {/* Result */}
      {result && (
        <section className="max-w-3xl mx-auto px-4 pb-8">
          <div className="bg-slate-800/50 border border-slate-700/50 rounded-2xl p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-white">
                📧 Your Email
              </h3>
              <div className="flex gap-2">
                <button
                  onClick={copyToClipboard}
                  className="text-sm bg-slate-700 hover:bg-slate-600 text-white px-4 py-2 rounded-lg transition flex items-center gap-1.5"
                >
                  {copied ? "✅ Copied!" : "📋 Copy"}
                </button>
                <button
                  onClick={generate}
                  className="text-sm bg-slate-700 hover:bg-slate-600 text-white px-4 py-2 rounded-lg transition flex items-center gap-1.5"
                >
                  🔄 Regenerate
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
        <h3 className="text-2xl font-bold text-white text-center mb-8">
          Why MailForge?
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            {
              icon: "🌍",
              title: "10+ Languages",
              desc: "Generate emails in English, Spanish, Arabic, Portuguese, French and more",
            },
            {
              icon: "⚡",
              title: "Ready in 30 Seconds",
              desc: "Just describe your product and get a professional email instantly",
            },
            {
              icon: "📈",
              title: "Higher Reply Rate",
              desc: "AI-optimized subject lines and content that buyers actually respond to",
            },
          ].map((f, i) => (
            <div
              key={i}
              className="bg-slate-800/30 border border-slate-700/50 rounded-xl p-5 text-center"
            >
              <div className="text-3xl mb-3">{f.icon}</div>
              <h4 className="text-white font-semibold mb-2">{f.title}</h4>
              <p className="text-sm text-slate-400">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="max-w-3xl mx-auto px-4 py-12">
        <h3 className="text-2xl font-bold text-white text-center mb-8">
          Simple Pricing
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Free */}
          <div className="bg-slate-800/50 border border-slate-700/50 rounded-2xl p-6">
            <h4 className="text-lg font-semibold text-white mb-1">Free</h4>
            <p className="text-3xl font-bold text-white mb-4">
              $0<span className="text-sm text-slate-400">/forever</span>
            </p>
            <ul className="space-y-2 text-sm text-slate-300 mb-6">
              <li>✅ 3 emails per day</li>
              <li>✅ 10+ languages</li>
              <li>✅ 3 email styles</li>
              <li>❌ No template library</li>
              <li>❌ No bulk generation</li>
            </ul>
            <button className="w-full bg-slate-700 hover:bg-slate-600 text-white py-2.5 rounded-lg transition">
              Get Started Free
            </button>
          </div>
          {/* Pro */}
          <div className="bg-gradient-to-b from-blue-900/50 to-slate-800/50 border border-blue-500/50 rounded-2xl p-6 relative">
            <div className="absolute -top-3 right-4 bg-blue-500 text-white text-xs px-3 py-1 rounded-full font-medium">
              Popular
            </div>
            <h4 className="text-lg font-semibold text-white mb-1">Pro</h4>
            <p className="text-3xl font-bold text-white mb-4">
              $9.9<span className="text-sm text-slate-400">/month</span>
            </p>
            <ul className="space-y-2 text-sm text-slate-300 mb-6">
              <li>✅ Unlimited emails</li>
              <li>✅ 10+ languages</li>
              <li>✅ All email styles</li>
              <li>✅ Template library</li>
              <li>✅ Priority generation</li>
            </ul>
            <button className="w-full bg-blue-600 hover:bg-blue-500 text-white py-2.5 rounded-lg transition font-semibold">
              Subscribe Now ✨
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-700/50 py-6">
        <div className="max-w-4xl mx-auto px-4 text-center text-sm text-slate-500">
          <p>
            © 2026 MailForge by{" "}
            <a href="https://aisense.top" className="text-blue-400 hover:underline">
              AI Sense
            </a>{" "}
            · Powered by AI
          </p>
        </div>
      </footer>
    </main>
  );
}
