import { config } from "dotenv";
import { defineConfig, env } from "prisma/config";

// 手动加载 .env 文件
config({ path: ".env" });

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
  },
  datasource: {
    url: env("DATABASE_URL"),
  },
});
