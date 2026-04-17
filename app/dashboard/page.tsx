// app/dashboard/page.tsx
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function DashboardPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [prompt, setPrompt] = useState("");
  const [type, setType] = useState("title");
  const [result, setResult] = useState("");
  const [generating, setGenerating] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/signin");
    } else {
      setLoading(false);
    }
  }, [router]);

  const handleGenerate = async () => {
    if (!prompt.trim()) return;

    setGenerating(true);
    setResult("");

    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt, type }),
      });

      const reader = res.body?.getReader();
      const decoder = new TextDecoder();

      while (reader) {
        const { done, value } = await reader.read();
        if (done) break;
        setResult((prev) => prev + decoder.decode(value));
      }
    } catch (error) {
      setResult("生成失败，请重试");
    } finally {
      setGenerating(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100">
        <div className="text-gray-500">加载中...</div>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 py-12 px-4">
      {/* 主容器：居中偏上 */}
      <div className="max-w-3xl mx-auto mt-8 md:mt-12 lg:mt-16">
        {/* 卡片 - 全包围阴影 */}
        <div className="bg-white rounded-2xl shadow-[0_20px_50px_-15px_rgba(0,0,0,0.25)] p-6 md:p-8">
          {/* 标题区域 */}
          <div className="text-center mb-8">
            <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent">
              AI 内容生成工作台
            </h1>
            <p className="text-gray-500 mt-2 text-sm md:text-base">
              输入关键词，AI 帮你生成高质量内容
            </p>
          </div>

          {/* 类型选择 */}
          <div className="flex flex-wrap gap-3 mb-6 justify-center">
            {[
              {
                value: "title",
                label: "📝 标题生成",
                color: "from-blue-500 to-cyan-500",
              },
              {
                value: "content",
                label: "📄 文案撰写",
                color: "from-purple-500 to-pink-500",
              },
              {
                value: "seo",
                label: "🔍 SEO描述",
                color: "from-green-500 to-emerald-500",
              },
            ].map((item) => (
              <button
                key={item.value}
                onClick={() => setType(item.value)}
                className={`px-5 py-2.5 rounded-xl font-medium transition-all duration-200 transform hover:scale-105 ${
                  type === item.value
                    ? `bg-gradient-to-r ${item.color} text-white shadow-md shadow-purple-200`
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200 hover:shadow-sm"
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>

          {/* 输入框区域 */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              输入关键词或需求
            </label>
            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="例如：猫粮推荐、夏季连衣裙、新能源汽车、咖啡机评测..."
              className="w-full p-4 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none transition-shadow hover:shadow-md"
              rows={3}
            />
          </div>

          {/* 生成按钮 */}
          <button
            onClick={handleGenerate}
            disabled={generating || !prompt.trim()}
            className="w-full py-3 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 disabled:from-gray-300 disabled:to-gray-300 text-white font-medium rounded-xl transition-all duration-200 transform hover:scale-[1.02] disabled:hover:scale-100 shadow-md shadow-purple-200"
          >
            {generating ? (
              <span className="flex items-center justify-center gap-2">
                <svg
                  className="animate-spin h-5 w-5 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                AI 正在思考中...
              </span>
            ) : (
              "✨ 生成内容"
            )}
          </button>

          {/* 结果展示区域 */}
          {result && (
            <div className="mt-8 p-5 bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl border border-gray-200 animate-fadeIn">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-1 h-6 bg-gradient-to-b from-purple-500 to-indigo-500 rounded-full"></div>
                <h3 className="font-semibold text-gray-900">生成结果</h3>
              </div>
              <div className="whitespace-pre-wrap text-gray-700 leading-relaxed">
                {result}
              </div>
            </div>
          )}
        </div>

        {/* 底部提示 */}
        <div className="text-center mt-8">
          <p className="text-xs text-gray-400">
            基于 AI 技术生成，仅供参考使用
          </p>
        </div>
      </div>

      {/* 添加淡入动画 */}
      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out;
        }
      `}</style>
    </main>
  );
}
