import { prisma } from "@/prisma/prisma";
import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";

export async function POST(req: Request) {
  const { email, code, newPassword } = await req.json();

  if (!email || !code || !newPassword) {
    return NextResponse.json({ error: "参数不完整" }, { status: 400 });
  }

  // 1. 验证密码强度
  const hasUpperCase = /[A-Z]/.test(newPassword);
  const hasLowerCase = /[a-z]/.test(newPassword);
  const hasNumber = /[0-9]/.test(newPassword);
  if (newPassword.length < 8 || !hasUpperCase || !hasLowerCase || !hasNumber) {
    return NextResponse.json({ error: "密码不符合强度要求" }, { status: 400 });
  }

  // 2. 验证验证码
  const record = await prisma.verificationCode.findFirst({
    where: {
      email,
      code,
      expiresAt: { gt: new Date() },
    },
  });

  if (!record) {
    return NextResponse.json({ error: "验证码错误或已过期" }, { status: 400 });
  }

  // 3. 更新密码
  const hashedPassword = await bcrypt.hash(newPassword, 10);
  await prisma.user.update({
    where: { email },
    data: { password: hashedPassword },
  });

  // 4. 删除该邮箱的所有 session（强制其他设备下线）
  await prisma.session.deleteMany({
    where: { user: { email } },
  });

  // 5. 删除验证码
  await prisma.verificationCode.delete({ where: { id: record.id } });

  return NextResponse.json({ success: true, message: "密码重置成功" });
}
