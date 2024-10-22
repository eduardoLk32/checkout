import { createEnv } from "@t3-oss/env-nextjs";
import { z } from "zod";

console.log("process.env.NODE_ENV", process.env);

export const env = createEnv({
  server: {
    NODE_ENV: z.enum(["development", "production"]).default("development"),
    NEXT_PUBLIC_APP_URL: z.string().url().min(1),
    NEXT_PUBLIC_PRIMEPAG_API_URL: z.string().min(1),
    NEXT_PUBLIC_PRIMEPAG_CLIENT_ID: z.string().url().min(1),
    NEXT_PUBLIC_PRIMEPAG_CLIENT_SECRET: z.string().min(1),
  },
  client: {
    NODE_ENV: z.enum(["development", "production"]).default("development"),
    NEXT_PUBLIC_APP_URL: z.string().url().min(1),
    NEXT_PUBLIC_PRIMEPAG_API_URL: z.string().min(1),
    NEXT_PUBLIC_PRIMEPAG_CLIENT_ID: z.string().url().min(1),
    NEXT_PUBLIC_PRIMEPAG_CLIENT_SECRET: z.string().min(1),
  },
  runtimeEnv: {
    NODE_ENV: process.env.NODE_ENV,
    VERCEL_URL: process.env.VERCEL_URL,
    NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL,
    NODE_ENV: z.enum(["development", "production"]).default("development"),
    NEXT_PUBLIC_APP_URL: z.string().url().min(1),
    NEXT_PUBLIC_PRIMEPAG_API_URL: z.string().min(1),
    NEXT_PUBLIC_PRIMEPAG_CLIENT_ID: z.string().url().min(1),
    NEXT_PUBLIC_PRIMEPAG_CLIENT_SECRET: z.string().min(1),
  },
});
