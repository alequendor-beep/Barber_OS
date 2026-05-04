import { Router, type IRouter } from "express";
import { eq } from "drizzle-orm";
import { db, clientsTable, appointmentsTable, barbersTable, servicesTable } from "@workspace/db";
import {
  CreateClientBody,
  GetClientAppointmentsParams,
  ListClientsResponse,
  GetClientAppointmentsResponse,
} from "@workspace/api-zod";

const router: IRouter = Router();

router.get("/clients", async (_req, res): Promise<void> => {
  const clients = await db.select().from(clientsTable).orderBy(clientsTable.createdAt);
  res.json(ListClientsResponse.parse(clients));
});

router.post("/clients", async (req, res): Promise<void> => {
  const body = CreateClientBody.safeParse(req.body);
  if (!body.success) {
    res.status(400).json({ error: body.error.message });
    return;
  }
  const [client] = await db.insert(clientsTable).values(body.data).returning();
  res.status(201).json(client);
});

router.get("/clients/:clientId/appointments", async (req, res): Promise<void> => {
  const params = GetClientAppointmentsParams.safeParse(req.params);
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }
  const rows = await db
    .select()
    .from(appointmentsTable)
    .leftJoin(barbersTable, eq(appointmentsTable.barberId, barbersTable.id))
    .leftJoin(servicesTable, eq(appointmentsTable.serviceId, servicesTable.id))
    .where(eq(appointmentsTable.clientId, params.data.clientId))
    .orderBy(appointmentsTable.date);

  const result = rows.map((r) => ({
    ...r.appointments,
    barberName: r.barbers?.name ?? null,
    clientName: null,
    serviceName: r.services?.name ?? null,
    servicePrice: r.services?.price ? parseFloat(r.services.price) : null,
    serviceDuration: r.services?.durationMinutes ?? null,
  }));

  res.json(GetClientAppointmentsResponse.parse(result));
});

export default router;
