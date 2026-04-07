import { prisma } from "@/prisma/prisma";
import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";

const SECRET = process.env.JWT_SECRET || "fallback-secret";

export async function POST(req: Request) {
  const { email, code } = await req.json();

  const record = await prisma.verificationCode.findFirst({
    where: {
      email,
      code,
      expiresAt: { gt: new Date() },
    },
  });

  if (!record) {
    return NextResponse.json({ error: "验证码错误或过期" }, { status: 400 });
  }

  let user = await prisma.user.findUnique({ where: { email } });
  if (!user) {
    user = await prisma.user.create({ data: { email } });
  }

  await prisma.verificationCode.deleteMany({ where: { email } });

  const token = jwt.sign({ userId: user.id, email }, SECRET, {
    expiresIn: "7d",
  });

  return NextResponse.json({
    success: true,
    token,
    user: { id: user.id, email: user.email },
  });
}
