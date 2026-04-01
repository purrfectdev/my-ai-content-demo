// app/page.tsx
"use client";

import { useState } from "react";
import { Sparkles, Copy, Check, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type ContentType = "title" | "content" | "seo";

export default function Home() {
  const [prompt, setPrompt] = useState("");
  const [type, setType] = useState<ContentType>("title");
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  const generateContent = async () => {
    if (!prompt.trim()) return;

    setLoading(true);
    setResult("");

    try {
      const response = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt, type }),
      });

      const reader = response.body?.getReader();
      const decoder = new TextDecoder();

      while (reader) {
        const { done, value } = await reader.read();
        if (done) break;
        const chunk = decoder.decode(value);
        setResult((prev) => prev + chunk);
      }
    } catch (error) {
      console.error(error);
      setResult("生成失败，请重试");
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
    <main className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 bg-white px-4 py-2 rounded-full shadow-sm mb-4">
            <Sparkles className="w-5 h-5 text-purple-500" />
            <span className="text-sm font-medium text-gray-600">AI 驱动</span>
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-3">
            AI 内容生成工作台
          </h1>
          <p className="text-lg text-gray-600">
            输入关键词，AI 帮你生成高质量标题、文案或 SEO 描述
          </p>
        </div>

        {/* 输入卡片 */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>生成配置</CardTitle>
            <CardDescription>选择内容类型，输入关键词</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Select
              value={type}
              onValueChange={(v) => setType(v as ContentType)}
            >
              <SelectTrigger>
                <SelectValue placeholder="选择内容类型" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="title">
                  📝 标题生成 - 生成3个吸引人的标题
                </SelectItem>
                <SelectItem value="content">
                  📄 文案撰写 - 生成300字营销文案
                </SelectItem>
                <SelectItem value="seo">
                  🔍 SEO描述 - 生成150字SEO描述
                </SelectItem>
              </SelectContent>
            </Select>

            <Textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="输入关键词，比如：猫粮推荐、夏季连衣裙、新能源汽车..."
              className="resize-none"
              rows={3}
            />

            <Button
              onClick={generateContent}
              disabled={loading || !prompt.trim()}
              className="w-full"
              size="lg"
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                  生成中...
                </>
              ) : (
                <>
                  <Sparkles className="w-5 h-5 mr-2" />
                  生成内容
                </>
              )}
            </Button>
          </CardContent>
        </Card>

        {/* 结果卡片 */}
        {result && (
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>生成结果</CardTitle>
                <CardDescription>AI 生成的内容如下</CardDescription>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={copyToClipboard}
                className="gap-2"
              >
                {copied ? (
                  <>
                    <Check className="w-4 h-4" />
                    已复制
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4" />
                    复制
                  </>
                )}
              </Button>
            </CardHeader>
            <CardContent>
              <div className="bg-muted rounded-lg p-5 whitespace-pre-wrap font-mono text-sm">
                {result}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </main>
  );
}
