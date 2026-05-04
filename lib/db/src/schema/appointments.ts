import { pgTable, text, serial, timestamp, integer, varchar } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";
import { barbershopsTable } from "./barbershops";
import { barbersTable } from "./barbers";
import { clientsTable } from "./clients";
import { servicesTable } from "./services";

export const appointmentsTable = pgTable("appointments", {
  id: serial("id").primaryKey(),
  barbershopId: integer("barbershop_id").notNull().references(() => barbershopsTable.id),
  barberId: integer("barber_id").notNull().references(() => barbersTable.id),
  clientId: integer("client_id").notNull().references(() => clientsTable.id),
  serviceId: integer("service_id").notNull().references(() => servicesTable.id),
  date: varchar("date", { length: 10 }).notNull(),
  time: varchar("time", { length: 8 }).notNull(),
  status: varchar("status", { length: 20 }).notNull().default("confirmed"),
  notes: text("notes"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export const insertAppointmentSchema = createInsertSchema(appointmentsTable).omit({ id: true, createdAt: true });
export type InsertAppointment = z.infer<typeof insertAppointmentSchema>;
export type Appointment = typeof appointmentsTable.$inferSelect;
