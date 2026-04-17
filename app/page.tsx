// app/page.tsx
"use client";

const features = [
  {
    title: "📝 标题生成",
    description: "输入关键词，AI 自动生成 3 个吸引人的标题",
    icon: "🎯",
  },
  {
    title: "📄 文案撰写",
    description: "生成 300 字左右的营销文案，语言生动有感染力",
    icon: "✍️",
  },
  {
    title: "🔍 SEO 描述",
    description: "生成 150 字左右的 SEO 描述，自然包含关键词",
    icon: "📈",
  },
  {
    title: "💾 历史记录",
    description: "所有生成内容自动保存，随时查看和复用",
    icon: "📚",
  },
  {
    title: "👥 团队协作",
    description: "支持多人使用，各自管理自己的内容",
    icon: "🤝",
  },
  {
    title: "🔐 安全私密",
    description: "数据隔离，只有你自己能看到生成的内容",
    icon: "🛡️",
  },
];

export default function HomePage() {
  return (
    <main className="pt-16">
      {/* Hero 区域 */}
      <section className="bg-gradient-to-br from-purple-50 to-white py-20">
        <div className="max-w-4xl mx-auto text-center px-4">
          <h1 className="text-5xl font-bold text-gray-900 mb-6">
            AI 内容生成器
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            输入关键词，AI 帮你生成高质量标题、营销文案和 SEO 描述
          </p>
          <div className="flex gap-4 justify-center">
            <a
              href="/signin
"
              className="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition"
            >
              立即体验
            </a>
            <a
              href="#features"
              className="px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition"
            >
              了解更多
            </a>
          </div>
        </div>
      </section>

      {/* 功能展示区域 */}
      <section id="features" className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
            核心功能
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition"
              >
                <div className="text-4xl mb-4">{feature.icon}</div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  {feature.title}
                </h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA 区域 */}
      <section className="bg-purple-600 py-16">
        <div className="max-w-4xl mx-auto text-center px-4">
          <h2 className="text-3xl font-bold text-white mb-4">
            准备好提升内容创作效率了吗？
          </h2>
          <p className="text-purple-100 mb-8">立即开始使用 AI 生成高质量内容</p>
          <a
            href="/signin"
            className="px-6 py-3 bg-white text-purple-600 rounded-lg hover:bg-gray-100 transition font-medium"
          >
            免费开始使用
          </a>
        </div>
      </section>
    </main>
  );
}
