"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { toast } from "sonner";
import { useAuthStore } from "@/store/useAuthStore";
import { FullscreenLoader } from "./FullscreenLoader";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

export default function Navbar() {
  const router = useRouter();
  const { isLoggedIn, user, clearAuth } = useAuthStore();
  const [showConfirm, setShowConfirm] = useState(false);
  const [isSigningOut, setIsSigningOut] = useState(false);

  const handleSignOut = async () => {
    setShowConfirm(false);
    setIsSigningOut(true);

    try {
      const res = await fetch("/api/auth/signout", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      if (res.ok) {
        toast.success("已安全退出");
        clearAuth(); // 清除 Zustand 状态和 localStorage
        setTimeout(() => router.push("/signin"), 500);
      } else {
        toast.error("退出失败");
        // setIsSigningOut(false);
      }
    } catch {
      toast.error("网络错误");
    } finally {
      setIsSigningOut(false);
    }
  };

  return (
    <>
      <nav className="flex items-center justify-between px-6 py-4 border-b">
        <Link href="/" className="text-xl font-bold">
          AI 内容生成器
        </Link>

        <div className="flex items-center gap-4">
          {isLoggedIn ? (
            <>
              <Link href="/dashboard">工作台</Link>
              <Link href="/history">历史记录</Link>
              <span className="text-sm text-gray-500">{user?.email}</span>
              <button
                onClick={() => setShowConfirm(true)}
                disabled={isSigningOut}
                className="px-4 py-2 bg-red-500 hover:bg-red-600 disabled:bg-gray-400 text-white rounded-lg transition-colors"
              >
                退出登录
              </button>
            </>
          ) : (
            <>
              <Link href="/signin">登录</Link>
              <Link href="/signup">注册</Link>
            </>
          )}
        </div>
      </nav>

      {/* 二次确认弹窗 */}
      <AlertDialog open={showConfirm} onOpenChange={setShowConfirm}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>确认退出</AlertDialogTitle>
            <AlertDialogDescription>
              退出后需要重新登录才能继续使用。确定要退出吗？
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>取消</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleSignOut}
              className="bg-red-500 hover:bg-red-600"
            >
              确定退出
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* 全屏 Loading */}
      <FullscreenLoader isLoading={isSigningOut} text="正在安全退出..." />
    </>
  );
}
