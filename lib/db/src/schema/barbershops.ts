import { pgTable, text, serial, timestamp, varchar } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const barbershopsTable = pgTable("barbershops", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  slug: varchar("slug", { length: 100 }).notNull().unique(),
  address: text("address").notNull(),
  phone: varchar("phone", { length: 30 }).notNull(),
  description: text("description").notNull(),
  logoUrl: text("logo_url"),
  coverUrl: text("cover_url"),
  openTime: varchar("open_time", { length: 10 }).notNull().default("08:00"),
  closeTime: varchar("close_time", { length: 10 }).notNull().default("20:00"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export const insertBarbershopSchema = createInsertSchema(barbershopsTable).omit({ id: true, createdAt: true });
export type InsertBarbershop = z.infer<typeof insertBarbershopSchema>;
export type Barbershop = typeof barbershopsTable.$inferSelect;
