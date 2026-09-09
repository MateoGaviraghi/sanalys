import { createEnv } from "@t3-oss/env-nextjs"
import { z } from "zod"

/**
 * Variable names are fixed by docs/06-SEGURIDAD.md section 6. Values live only in the
 * Vercel env store and, locally, in an untracked .env.local. There is no .env.example.
 *
 * Variables whose provider is not wired yet are declared optional and marked with the
 * work unit that makes them required (TD-006 in docs/10-MEMORY.md).
 */
export const env = createEnv({
  server: {
    /** Pooled Neon connection string, role `sanalys_app`. */
    DATABASE_URL: z.url(),
    /** required at WU-12 */
    CLERK_SECRET_KEY: z.string().min(1).optional(),
    /** required at WU-15 */
    R2_ACCOUNT_ID: z.string().min(1).optional(),
    /** required at WU-15 */
    R2_ACCESS_KEY_ID: z.string().min(1).optional(),
    /** required at WU-15 */
    R2_SECRET_ACCESS_KEY: z.string().min(1).optional(),
    /** required at WU-15 */
    R2_BUCKET: z.string().min(1).optional(),
    /** required at WU-12 */
    SENTRY_DSN: z.url().optional(),
    /** required at WU-22 */
    WEB_REVALIDATE_URL: z.url().optional(),
    /** required at WU-22 — shared with web/ */
    REVALIDATE_SECRET: z.string().min(32).optional(),
  },
  client: {
    /** required at WU-12 */
    NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY: z.string().min(1).optional(),
  },
  runtimeEnv: {
    DATABASE_URL: process.env.DATABASE_URL,
    CLERK_SECRET_KEY: process.env.CLERK_SECRET_KEY,
    R2_ACCOUNT_ID: process.env.R2_ACCOUNT_ID,
    R2_ACCESS_KEY_ID: process.env.R2_ACCESS_KEY_ID,
    R2_SECRET_ACCESS_KEY: process.env.R2_SECRET_ACCESS_KEY,
    R2_BUCKET: process.env.R2_BUCKET,
    SENTRY_DSN: process.env.SENTRY_DSN,
    WEB_REVALIDATE_URL: process.env.WEB_REVALIDATE_URL,
    REVALIDATE_SECRET: process.env.REVALIDATE_SECRET,
    NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY: process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY,
  },
  emptyStringAsUndefined: true,
  skipValidation: process.env.SKIP_ENV_VALIDATION === "1",
})
