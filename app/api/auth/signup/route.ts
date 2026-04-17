import { prisma } from "@/prisma/prisma";
import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key";

export async function POST(req: Request) {
  try {
    const { email, password, code } = await req.json();

    // 1. 校验参数
    if (!email || !password || !code) {
      return NextResponse.json({ error: "参数不完整" }, { status: 400 });
    }

    // 2. 校验密码强度
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumber = /[0-9]/.test(password);
    if (password.length < 8 || !hasUpperCase || !hasLowerCase || !hasNumber) {
      return NextResponse.json(
        { error: "密码不符合强度要求" },
        { status: 400 },
      );
    }

    // 3. 校验验证码
    const verificationRecord = await prisma.verificationCode.findFirst({
      where: {
        email,
        code,
        expiresAt: { gt: new Date() },
      },
    });

    if (!verificationRecord) {
      return NextResponse.json(
        { error: "验证码错误或已过期" },
        { status: 400 },
      );
    }

    // 4. 检查邮箱是否已注册
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return NextResponse.json({ error: "邮箱已被注册" }, { status: 400 });
    }

    // 5. 加密密码并创建用户
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        role: "user",
      },
    });

    // 6. 删除已使用的验证码
    await prisma.verificationCode.delete({
      where: { id: verificationRecord.id },
    });

    // 7. 生成 JWT token
    const token = jwt.sign(
      { userId: user.id, email: user.email, role: user.role },
      JWT_SECRET,
      { expiresIn: "7d" },
    );

    // 8. 保存 session
    await prisma.session.create({
      data: {
        userId: user.id,
        token,
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      },
    });

    // 9. 返回用户信息（不返回密码）
    const { password: _, ...userWithoutPassword } = user;
    return NextResponse.json({
      success: true,
      token,
      user: userWithoutPassword,
    });
  } catch (error) {
    console.error("注册错误:", error);
    return NextResponse.json({ error: "注册失败，请重试" }, { status: 500 });
  }
}
