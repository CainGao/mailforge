export default function AuthError() {
  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center px-4">
      <div className="bg-slate-800 border border-slate-700 rounded-2xl p-8 max-w-md w-full text-center">
        <div className="text-4xl mb-4">😅</div>
        <h1 className="text-xl font-bold text-white mb-3">登录遇到问题</h1>
        <p className="text-slate-400 mb-6 text-sm">
          抱歉，登录功能正在配置中。你可以直接使用免费额度（每天3次），无需登录。
        </p>
        <a
          href="https://forge.aisense.top"
          className="inline-block bg-blue-600 hover:bg-blue-500 text-white px-6 py-2.5 rounded-lg transition"
        >
          ← 返回首页
        </a>
      </div>
    </div>
  );
}
