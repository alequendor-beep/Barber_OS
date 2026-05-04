import { Router, type IRouter } from "express";
import { eq } from "drizzle-orm";
import { db, barbersTable } from "@workspace/db";
import {
  CreateBarberBody,
  CreateBarberParams,
  ListBarbersParams,
  ListBarbersResponse,
} from "@workspace/api-zod";

const router: IRouter = Router();

router.get("/barbershops/:barbershopId/barbers", async (req, res): Promise<void> => {
  const params = ListBarbersParams.safeParse(req.params);
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }
  const barbers = await db
    .select()
    .from(barbersTable)
    .where(eq(barbersTable.barbershopId, params.data.barbershopId))
    .orderBy(barbersTable.createdAt);
  res.json(ListBarbersResponse.parse(barbers));
});

router.post("/barbershops/:barbershopId/barbers", async (req, res): Promise<void> => {
  const params = CreateBarberParams.safeParse(req.params);
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }
  const body = CreateBarberBody.safeParse(req.body);
  if (!body.success) {
    res.status(400).json({ error: body.error.message });
    return;
  }
  const [barber] = await db
    .insert(barbersTable)
    .values({ ...body.data, barbershopId: params.data.barbershopId })
    .returning();
  res.status(201).json(barber);
});

export default router;
