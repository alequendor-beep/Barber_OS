import { pgTable, text, serial, timestamp, integer } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";
import { barbershopsTable } from "./barbershops";

export const barbersTable = pgTable("barbers", {
  id: serial("id").primaryKey(),
  barbershopId: integer("barbershop_id").notNull().references(() => barbershopsTable.id),
  name: text("name").notNull(),
  photoUrl: text("photo_url"),
  bio: text("bio").notNull().default(""),
  specialties: text("specialties").notNull().default(""),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export const insertBarberSchema = createInsertSchema(barbersTable).omit({ id: true, createdAt: true });
export type InsertBarber = z.infer<typeof insertBarberSchema>;
export type Barber = typeof barbersTable.$inferSelect;
