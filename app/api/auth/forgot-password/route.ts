import { prisma } from "@/prisma/prisma";
import { NextResponse } from "next/server";
import { Resend } from "resend";
import { toast } from "sonner";
import crypto from "crypto";

const resend = new Resend(process.env.RESEND_API_KEY);
const BASE_URL = process.env.NEXTAUTH_URL || "http://localhost:3000";

export async function POST(req: Request) {
  const { email } = await req.json();

  if (!email || !email.includes("@")) {
    return NextResponse.json({ error: "邮箱格式不正确" }, { status: 400 });
  }

  // 检查邮箱是否存在
  const user = await prisma.user.findUnique({
    where: { email },
  });

  // 为了安全，即使用户不存在也返回成功（不暴露用户是否存在）
  if (!user) {
    return NextResponse.json({ success: true });
  }

  // 生成唯一的重置 token
  const token = crypto.randomBytes(32).toString("hex");
  const expiresAt = new Date(Date.now() + 60 * 60 * 1000); // 1小时有效

  // 删除旧的 token
  await prisma.passwordResetToken.deleteMany({
    where: { email },
  });

  // 存储新 token
  await prisma.passwordResetToken.create({
    data: { email, token, expiresAt },
  });

  // 发送重置链接邮件
  const resetLink = `${BASE_URL}/reset-password?token=${token}`;

  try {
    await resend.emails.send({
      from: "你的应用名 <onboarding@resend.dev>",
      to: email,
      subject: "【AI 内容生成器】重置密码",
      html: `
        <div style="font-family: sans-serif; max-width: 500px; margin: 0 auto;">
          <h2 style="color: #333;">重置密码</h2>
          <p>您正在申请重置密码，请点击下面的链接：</p>
          <a href="${resetLink}" style="display: inline-block; background: #7c3aed; color: white; padding: 12px 24px; border-radius: 8px; text-decoration: none; margin: 20px 0;">
            重置密码
          </a>
          <p style="color: #666;">链接 1 小时内有效，请勿泄露给他人。</p>
          <p style="color: #999; font-size: 12px;">如果按钮无法点击，请复制以下链接到浏览器打开：<br/>${resetLink}</p>
          <p style="color: #999; font-size: 12px;">如果不是您本人操作，请忽略此邮件。</p>
        </div>
      `,
    });

    console.log(`[重置密码] 已发送链接到 ${email}`);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("发送失败:", error);
    return NextResponse.json({ error: "邮件发送失败" }, { status: 500 });
  }
}
