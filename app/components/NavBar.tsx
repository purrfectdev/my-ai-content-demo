/* eslint-disable react-hooks/set-state-in-effect */
"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";
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

interface User {
  id: string;
  email: string;
  role?: string;
}

export default function NavBar() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    // 直接从 localStorage 读取用户信息
    const stored = localStorage.getItem("user");
    if (stored) {
      setUser(JSON.parse(stored));
    }
  }, []); // 只在组件挂载时读一次

  const [showConfirm, setShowConfirm] = useState(false);

  const handleSignOut = async () => {
    setShowConfirm(false); // 关闭弹窗
    const loadingToast = toast.loading("正在退出...");

    try {
      const res = await fetch("/api/auth/signout", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      if (res.ok) {
        toast.dismiss(loadingToast);
        toast.success("已安全退出");
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        setTimeout(() => router.push("/signin"), 1000);
      } else {
        toast.dismiss(loadingToast);
        toast.error("退出失败");
      }
    } catch {
      toast.dismiss(loadingToast);
      toast.error("网络错误");
    }
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white border-b border-gray-200 px-6 py-4">
      <div className="max-w-6xl mx-auto flex justify-between items-center">
        <Link href="/" className="text-xl font-bold text-purple-600">
          AI 内容生成器
        </Link>

        <div className="flex items-center gap-4">
          {user ? (
            <>
              <span className="text-sm text-gray-600">
                {user.email}
                {user.role === "admin" && (
                  <span className="ml-2 px-2 py-0.5 text-xs bg-purple-100 text-purple-700 rounded-full">
                    管理员
                  </span>
                )}
              </span>
              <Link
                href="/dashboard"
                className="text-sm text-gray-600 hover:text-purple-600"
              >
                工作台
              </Link>
              {user.role === "admin" && (
                <Link
                  href="/admin"
                  className="text-sm text-gray-600 hover:text-purple-600"
                >
                  管理后台
                </Link>
              )}
              <button
                onClick={() => setShowConfirm(true)}
                className="px-4 py-2 text-sm bg-red-500 text-white rounded-lg hover:bg-red-600"
              >
                退出
              </button>
            </>
          ) : (
            <Link
              href="/signin"
              className="px-4 py-2 text-sm bg-purple-600 text-white rounded-lg hover:bg-purple-700"
            >
              登录 / 注册
            </Link>
          )}
        </div>
      </div>

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
    </nav>
  );
}
