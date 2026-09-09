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
    /** Pooled Neon connection string, role `sanalys_web`. */
    DATABASE_URL: z.url(),
    /** required at WU-08 */
    RESEND_API_KEY: z.string().min(1).optional(),
    /** required at WU-08 */
    RESEND_FROM: z.string().min(1).optional(),
    /** required at WU-05 */
    SENTRY_DSN: z.url().optional(),
    /** required at WU-10 — shared with sistema/ to trigger ISR revalidation */
    REVALIDATE_SECRET: z.string().min(32).optional(),
  },
  client: {
    NEXT_PUBLIC_SITE_URL: z.url(),
  },
  runtimeEnv: {
    DATABASE_URL: process.env.DATABASE_URL,
    RESEND_API_KEY: process.env.RESEND_API_KEY,
    RESEND_FROM: process.env.RESEND_FROM,
    SENTRY_DSN: process.env.SENTRY_DSN,
    REVALIDATE_SECRET: process.env.REVALIDATE_SECRET,
    NEXT_PUBLIC_SITE_URL: process.env.NEXT_PUBLIC_SITE_URL,
  },
  emptyStringAsUndefined: true,
  skipValidation: process.env.SKIP_ENV_VALIDATION === "1",
})
