"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/useAuthStore";
import { FullscreenLoader } from "@/app/components/FullscreenLoader";

export default function SignInPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const setAuth = useAuthStore((state) => state.setAuth);

  const [isSigningIn, setIsSigningIn] = useState(false);

  const handleSignin = async () => {
    if (!email || !email.includes("@")) {
      setError("请输入正确的邮箱地址");
      return;
    }
    if (!password) {
      setError("请输入密码");
      return;
    }

    setIsSigningIn(true);
    setError("");

    try {
      const res = await fetch("/api/auth/signin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (res.ok) {
        // localStorage.setItem("token", data.token);
        // localStorage.setItem("user", JSON.stringify(data.user));
        // 更新 Zustand store
        setAuth(data.user, data.token);
        window.location.href = "/dashboard";
      } else {
        setError(data.error || "登录失败");
      }
    } catch {
      setError("网络错误，请重试");
    } finally {
      setIsSigningIn(false);
    }
  };

  return (
    <>
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100">
        <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md">
          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold text-gray-900">登录</h1>
            <p className="text-gray-600 mt-2">输入邮箱和密码登录</p>
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              邮箱地址
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="your@email.com"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              disabled={isSigningIn}
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              密码
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="请输入密码"
              onKeyDown={(e) => e.key === "Enter" && handleSignin()}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              disabled={isSigningIn}
            />
          </div>

          {error && (
            <div className="mb-4 p-3 bg-red-50 text-red-600 text-sm rounded-lg">
              {error}
            </div>
          )}

          <button
            onClick={handleSignin}
            disabled={isSigningIn}
            className="w-full py-2 bg-purple-600 hover:bg-purple-700 disabled:bg-gray-400 text-white font-medium rounded-lg transition-colors"
          >
            {isSigningIn ? "登录中..." : "登录"}
          </button>

          <div className="text-center text-sm text-gray-600 mt-6">
            <a
              href="/forgot-password"
              className="text-purple-600 hover:underline"
            >
              忘记密码？
            </a>
          </div>

          <p className="text-center text-sm text-gray-600 mt-4">
            还没有账号？{" "}
            <a href="/signup" className="text-purple-600 hover:underline">
              立即注册
            </a>
          </p>
        </div>
      </div>
      {/* 全屏 Loading */}
      {/* <FullscreenLoader isLoading={isSigningIn} text="正在登录..." /> */}
    </>
  );
}
