import { prisma } from "@/prisma/prisma";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const token = searchParams.get("token");

  if (!token) {
    return NextResponse.json({ error: "缺少 token" }, { status: 400 });
  }

  const record = await prisma.passwordResetToken.findFirst({
    where: {
      token,
      expiresAt: { gt: new Date() },
    },
  });

  if (!record) {
    return NextResponse.json({ error: "链接已过期或无效" }, { status: 400 });
  }

  return NextResponse.json({ success: true, email: record.email });
}
