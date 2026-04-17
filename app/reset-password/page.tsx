"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { toast } from "sonner"; // 改用 sonner

export default function ResetPasswordPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [validating, setValidating] = useState(true);
  const [validToken, setValidToken] = useState(false);

  // 验证 token 有效性
  useEffect(() => {
    if (!token) {
      setValidating(false);
      setError("无效的重置链接");
      return;
    }

    const validateToken = async () => {
      try {
        const res = await fetch(
          `/api/auth/validate-reset-token?token=${token}`,
        );
        const data = await res.json();

        if (res.ok) {
          setValidToken(true);
        } else {
          setError(data.error || "链接已过期或无效");
        }
      } catch {
        setError("验证失败，请重试");
      } finally {
        setValidating(false);
      }
    };

    validateToken();
  }, [token]);

  // 密码强度验证
  const validatePassword = (pwd: string) => {
    const hasUpperCase = /[A-Z]/.test(pwd);
    const hasLowerCase = /[a-z]/.test(pwd);
    const hasNumber = /[0-9]/.test(pwd);
    const isValidLength = pwd.length >= 8;

    if (!isValidLength) return "密码长度至少8位";
    if (!hasUpperCase) return "密码必须包含至少一个大写字母";
    if (!hasLowerCase) return "密码必须包含至少一个小写字母";
    if (!hasNumber) return "密码必须包含至少一个数字";
    return null;
  };

  const handleResetPassword = async () => {
    const passwordError = validatePassword(password);
    if (passwordError) {
      setError(passwordError);
      return;
    }

    if (password !== confirmPassword) {
      setError("两次输入的密码不一致");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, newPassword: password }),
      });

      const data = await res.json();

      if (res.ok) {
        // 使用 sonner 的 success 方法
        toast.success("密码重置成功", {
          description: "请使用新密码登录",
          duration: 2000,
        });
        router.push("/signin");
      } else {
        setError(data.error || "重置失败");
      }
    } catch {
      setError("网络错误，请重试");
    } finally {
      setLoading(false);
    }
  };

  if (validating) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100">
        <div className="text-gray-500">验证中...</div>
      </div>
    );
  }

  if (!validToken) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100">
        <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md text-center">
          <div className="text-6xl mb-4">🔗</div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">链接无效</h1>
          <p className="text-gray-600 mb-4">
            {error || "重置链接已过期或无效"}
          </p>
          <Link
            href="/forgot-password"
            className="text-purple-600 hover:underline"
          >
            重新获取重置链接
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100">
      <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-gray-900">设置新密码</h1>
          <p className="text-gray-600 mt-2">请输入新密码</p>
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            新密码
          </label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="至少8位，包含大写、小写、数字"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
            disabled={loading}
          />
          <p className="text-xs text-gray-500 mt-1">
            密码必须包含：大写字母、小写字母、数字，至少8位
          </p>
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            确认新密码
          </label>
          <input
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="再次输入新密码"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
            disabled={loading}
          />
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-50 text-red-600 text-sm rounded-lg">
            {error}
          </div>
        )}

        <button
          onClick={handleResetPassword}
          disabled={loading}
          className="w-full py-2 bg-purple-600 hover:bg-purple-700 disabled:bg-gray-400 text-white font-medium rounded-lg transition-colors"
        >
          {loading ? "重置中..." : "重置密码"}
        </button>

        <p className="text-center text-sm text-gray-600 mt-6">
          <Link href="/signin" className="text-purple-600 hover:underline">
            返回登录
          </Link>
        </p>
      </div>
    </div>
  );
}
