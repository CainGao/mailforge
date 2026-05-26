export default function AuthSignin() {
  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center px-4">
      <div className="bg-slate-800 border border-slate-700 rounded-2xl p-8 max-w-md w-full text-center">
        <div className="text-4xl mb-4">✉️</div>
        <h1 className="text-xl font-bold text-white mb-3">登录 MailForge</h1>
        <p className="text-slate-400 mb-6 text-sm">
          登录功能正在配置中，请稍后再试。
        </p>
        <a
          href="https://forge.aisense.top"
          className="inline-block bg-slate-700 hover:bg-slate-600 text-white px-6 py-2.5 rounded-lg transition"
        >
          ← 返回首页
        </a>
      </div>
    </div>
  );
}
