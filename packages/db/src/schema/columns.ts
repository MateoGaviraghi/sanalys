import { sql } from "drizzle-orm"
import { timestamp, uuid } from "drizzle-orm/pg-core"

/**
 * Column helpers every table shares (docs/03-DATOS.md section 1).
 * `uuid_generate_v7()` comes from the pg_uuidv7 extension, enabled in migrations/0001_init.sql.
 */
export const id = () => uuid("id").primaryKey().default(sql`uuid_generate_v7()`)

export const createdAt = () =>
  timestamp("created_at", { withTimezone: true }).notNull().defaultNow()

/** Maintained by the touch_updated_at trigger, never written by the app. */
export const updatedAt = () => timestamp("updated_at", { withTimezone: true })

/** Every point in time is stored as timestamptz in UTC and rendered in Buenos Aires. */
export const tstz = (name: string) => timestamp(name, { withTimezone: true })
