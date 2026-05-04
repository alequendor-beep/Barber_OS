import { Router, type IRouter } from "express";
import { eq, and, count, sql } from "drizzle-orm";
import { db, barbershopsTable, barbersTable, servicesTable, clientsTable, appointmentsTable } from "@workspace/db";
import {
  CreateBarbershopBody,
  GetBarbershopParams,
  GetBarbershopDashboardParams,
  ListBarbershopsResponse,
  GetBarbershopResponse,
  GetBarbershopDashboardResponse,
} from "@workspace/api-zod";

const router: IRouter = Router();

router.get("/barbershops", async (_req, res): Promise<void> => {
  const shops = await db.select().from(barbershopsTable).orderBy(barbershopsTable.createdAt);
  res.json(ListBarbershopsResponse.parse(shops));
});

router.post("/barbershops", async (req, res): Promise<void> => {
  const parsed = CreateBarbershopBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }
  const slug = parsed.data.name
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9-]/g, "")
    .slice(0, 80);
  const [shop] = await db
    .insert(barbershopsTable)
    .values({ ...parsed.data, slug })
    .returning();
  res.status(201).json(GetBarbershopResponse.parse(shop));
});

router.get("/barbershops/:barbershopId", async (req, res): Promise<void> => {
  const params = GetBarbershopParams.safeParse(req.params);
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }
  const [shop] = await db
    .select()
    .from(barbershopsTable)
    .where(eq(barbershopsTable.id, params.data.barbershopId));
  if (!shop) {
    res.status(404).json({ error: "Barbershop not found" });
    return;
  }
  res.json(GetBarbershopResponse.parse(shop));
});

router.get("/barbershops/:barbershopId/dashboard", async (req, res): Promise<void> => {
  const params = GetBarbershopDashboardParams.safeParse(req.params);
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }
  const { barbershopId } = params.data;
  const today = new Date().toISOString().split("T")[0];

  const todayAppointments = await db
    .select()
    .from(appointmentsTable)
    .leftJoin(barbersTable, eq(appointmentsTable.barberId, barbersTable.id))
    .leftJoin(clientsTable, eq(appointmentsTable.clientId, clientsTable.id))
    .leftJoin(servicesTable, eq(appointmentsTable.serviceId, servicesTable.id))
    .where(
      and(
        eq(appointmentsTable.barbershopId, barbershopId),
        eq(appointmentsTable.date, today)
      )
    )
    .orderBy(appointmentsTable.time);

  const todayCount = todayAppointments.length;

  const now = new Date();
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1).toISOString().split("T")[0];
  const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0).toISOString().split("T")[0];

  const monthAppointments = await db
    .select()
    .from(appointmentsTable)
    .leftJoin(servicesTable, eq(appointmentsTable.serviceId, servicesTable.id))
    .where(
      and(
        eq(appointmentsTable.barbershopId, barbershopId),
        sql`${appointmentsTable.date} >= ${startOfMonth}`,
        sql`${appointmentsTable.date} <= ${endOfMonth}`,
        eq(appointmentsTable.status, "completed")
      )
    );

  const monthRevenue = monthAppointments.reduce((sum, row) => {
    return sum + (row.services ? parseFloat(row.services.price ?? "0") : 0);
  }, 0);

  const [clientCountRow] = await db.select({ cnt: count() }).from(clientsTable);
  const totalClients = clientCountRow?.cnt ?? 0;

  const completedCount = monthAppointments.length;
  const completionRate = monthAppointments.length > 0
    ? Math.round((completedCount / Math.max(monthAppointments.length, 1)) * 100)
    : 0;

  const upcomingAppointments = todayAppointments
    .filter((row) => row.appointments.status !== "cancelled" && row.appointments.status !== "completed")
    .slice(0, 5)
    .map((row) => ({
      ...row.appointments,
      barberName: row.barbers?.name ?? null,
      clientName: row.clients?.name ?? null,
      serviceName: row.services?.name ?? null,
      servicePrice: row.services?.price ? parseFloat(row.services.price) : null,
      serviceDuration: row.services?.durationMinutes ?? null,
    }));

  // Revenue by day for the last 7 days
  const revenueByDay = Array.from({ length: 7 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (6 - i));
    const dateStr = d.toISOString().split("T")[0];
    return { date: dateStr, revenue: 0, appointments: 0 };
  });

  const allAppts = await db
    .select()
    .from(appointmentsTable)
    .leftJoin(servicesTable, eq(appointmentsTable.serviceId, servicesTable.id))
    .where(
      and(
        eq(appointmentsTable.barbershopId, barbershopId),
        sql`${appointmentsTable.date} >= ${revenueByDay[0].date}`
      )
    );

  for (const row of allAppts) {
    const entry = revenueByDay.find((d) => d.date === row.appointments.date);
    if (entry) {
      entry.appointments++;
      if (row.appointments.status === "completed") {
        entry.revenue += parseFloat(row.services?.price ?? "0");
      }
    }
  }

  res.json(
    GetBarbershopDashboardResponse.parse({
      todayAppointments: todayCount,
      monthRevenue,
      totalClients: Number(totalClients),
      completionRate,
      upcomingAppointments,
      revenueByDay,
    })
  );
});

export default router;
