import { prisma } from "@/prisma/prisma";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const { secret, email } = await req.json();

  // 用一个简单的密钥保护，上线前改掉
  if (secret !== "admin-setup-key-123") {
    return NextResponse.json({ error: "无权限" }, { status: 403 });
  }

  const user = await prisma.user.upsert({
    where: { email },
    update: { role: "admin" },
    create: {
      email,
      role: "admin",
    },
  });

  return NextResponse.json({ success: true, user });
}
