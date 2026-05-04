import { Router, type IRouter } from "express";
import { eq, and } from "drizzle-orm";
import { db, appointmentsTable, barbersTable, clientsTable, servicesTable } from "@workspace/db";
import {
  CreateAppointmentBody,
  CreateAppointmentParams,
  UpdateAppointmentBody,
  UpdateAppointmentParams,
  ListAppointmentsParams,
  ListAppointmentsQueryParams,
  ListAppointmentsResponse,
  UpdateAppointmentResponse,
} from "@workspace/api-zod";

const router: IRouter = Router();

router.get("/barbershops/:barbershopId/appointments", async (req, res): Promise<void> => {
  const params = ListAppointmentsParams.safeParse(req.params);
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }
  const query = ListAppointmentsQueryParams.safeParse(req.query);
  if (!query.success) {
    res.status(400).json({ error: query.error.message });
    return;
  }

  const conditions = [eq(appointmentsTable.barbershopId, params.data.barbershopId)];
  if (query.data.date) {
    conditions.push(eq(appointmentsTable.date, query.data.date));
  }
  if (query.data.status) {
    conditions.push(eq(appointmentsTable.status, query.data.status));
  }

  const rows = await db
    .select()
    .from(appointmentsTable)
    .leftJoin(barbersTable, eq(appointmentsTable.barberId, barbersTable.id))
    .leftJoin(clientsTable, eq(appointmentsTable.clientId, clientsTable.id))
    .leftJoin(servicesTable, eq(appointmentsTable.serviceId, servicesTable.id))
    .where(and(...conditions))
    .orderBy(appointmentsTable.date, appointmentsTable.time);

  const result = rows.map((r) => ({
    ...r.appointments,
    barberName: r.barbers?.name ?? null,
    clientName: r.clients?.name ?? null,
    serviceName: r.services?.name ?? null,
    servicePrice: r.services?.price ? parseFloat(r.services.price) : null,
    serviceDuration: r.services?.durationMinutes ?? null,
  }));

  res.json(ListAppointmentsResponse.parse(result));
});

router.post("/barbershops/:barbershopId/appointments", async (req, res): Promise<void> => {
  const params = CreateAppointmentParams.safeParse(req.params);
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }
  const body = CreateAppointmentBody.safeParse(req.body);
  if (!body.success) {
    res.status(400).json({ error: body.error.message });
    return;
  }
  const [appt] = await db
    .insert(appointmentsTable)
    .values({ ...body.data, barbershopId: params.data.barbershopId })
    .returning();
  res.status(201).json({ ...appt, barberName: null, clientName: null, serviceName: null, servicePrice: null, serviceDuration: null });
});

router.patch("/appointments/:appointmentId", async (req, res): Promise<void> => {
  const params = UpdateAppointmentParams.safeParse(req.params);
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }
  const body = UpdateAppointmentBody.safeParse(req.body);
  if (!body.success) {
    res.status(400).json({ error: body.error.message });
    return;
  }

  const updateData: Record<string, unknown> = {};
  if (body.data.status) updateData.status = body.data.status;
  if (body.data.date) updateData.date = body.data.date;
  if (body.data.time) updateData.time = body.data.time;
  if (body.data.notes !== undefined) updateData.notes = body.data.notes;

  const [appt] = await db
    .update(appointmentsTable)
    .set(updateData)
    .where(eq(appointmentsTable.id, params.data.appointmentId))
    .returning();

  if (!appt) {
    res.status(404).json({ error: "Appointment not found" });
    return;
  }

  res.json(UpdateAppointmentResponse.parse({ ...appt, barberName: null, clientName: null, serviceName: null, servicePrice: null, serviceDuration: null }));
});

export default router;
