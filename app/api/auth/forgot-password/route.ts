import { prisma } from "@/prisma/prisma";
import { NextResponse } from "next/server";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

function generateCode() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

export async function POST(req: Request) {
  const { email } = await req.json();

  if (!email || !email.includes("@")) {
    return NextResponse.json({ error: "邮箱格式不正确" }, { status: 400 });
  }

  // 检查邮箱是否存在
  const user = await prisma.user.findUnique({
    where: { email },
  });

  if (!user) {
    // 为了安全，不告诉用户邮箱不存在，统一返回成功
    return NextResponse.json({
      success: true,
      message: "如果邮箱已注册，验证码已发送",
    });
  }

  const code = generateCode();
  const expiresAt = new Date(Date.now() + 10 * 60 * 1000);

  // 删除旧的验证码
  await prisma.verificationCode.deleteMany({ where: { email } });

  // 存储新验证码
  await prisma.verificationCode.create({
    data: { email, code, expiresAt },
  });

  // 发送邮件
  try {
    await resend.emails.send({
      from: "你的应用名 <onboarding@resend.dev>",
      to: email,
      subject: "【AI 内容生成器】重置密码验证码",
      html: `
        <div style="font-family: sans-serif; max-width: 500px; margin: 0 auto;">
          <h2 style="color: #333;">重置密码</h2>
          <p>您正在申请重置密码，验证码是：</p>
          <div style="font-size: 32px; font-weight: bold; background: #f0f0f0; display: inline-block; padding: 12px 24px; border-radius: 8px; letter-spacing: 4px;">
            ${code}
          </div>
          <p style="color: #666; margin-top: 20px;">验证码 10 分钟内有效，请勿泄露给他人。</p>
          <p style="color: #999; font-size: 12px;">如果不是您本人操作，请忽略此邮件。</p>
        </div>
      `,
    });

    console.log(`[重置密码] ${email} -> ${code}`);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("发送失败:", error);
    return NextResponse.json({ error: "邮件发送失败" }, { status: 500 });
  }
}
