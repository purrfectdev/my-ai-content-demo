import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/prisma/prisma";

export async function POST(request: NextRequest) {
  try {
    const authHeader = request.headers.get("authorization");
    const token = authHeader?.startsWith("Bearer ")
      ? authHeader.substring(7)
      : null;

    if (token) {
      await prisma.session.deleteMany({
        where: { token },
      });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("退出失败:", error);
    return NextResponse.json({ error: "退出失败" }, { status: 500 });
  }
}
