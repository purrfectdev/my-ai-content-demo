import { prisma } from "@/prisma/prisma";
import { NextResponse } from "next/server";

function generateCode() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

export async function POST(req: Request) {
  const { email } = await req.json();

  if (!email || !email.includes("@")) {
    return NextResponse.json({ error: "邮箱格式不正确" }, { status: 400 });
  }

  const code = generateCode();
  const expiresAt = new Date(Date.now() + 10 * 60 * 1000);

  await prisma.verificationCode.deleteMany({ where: { email } });
  await prisma.verificationCode.create({
    data: { email, code, expiresAt },
  });

  // 开发环境打印到终端
  console.log(`[验证码] ${email} -> ${code}`);

  return NextResponse.json({
    success: true,
    message: "验证码已发送（请查看终端）",
    devCode: code, // 开发时方便，上线前删掉
  });
}
