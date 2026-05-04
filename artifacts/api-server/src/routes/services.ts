import { Router, type IRouter } from "express";
import { eq } from "drizzle-orm";
import { db, servicesTable } from "@workspace/db";
import {
  CreateServiceBody,
  CreateServiceParams,
  ListServicesParams,
  ListServicesResponse,
} from "@workspace/api-zod";

const router: IRouter = Router();

router.get("/barbershops/:barbershopId/services", async (req, res): Promise<void> => {
  const params = ListServicesParams.safeParse(req.params);
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }
  const services = await db
    .select()
    .from(servicesTable)
    .where(eq(servicesTable.barbershopId, params.data.barbershopId))
    .orderBy(servicesTable.createdAt);
  res.json(ListServicesResponse.parse(services.map((s) => ({ ...s, price: parseFloat(s.price) }))));
});

router.post("/barbershops/:barbershopId/services", async (req, res): Promise<void> => {
  const params = CreateServiceParams.safeParse(req.params);
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }
  const body = CreateServiceBody.safeParse(req.body);
  if (!body.success) {
    res.status(400).json({ error: body.error.message });
    return;
  }
  const [service] = await db
    .insert(servicesTable)
    .values({ ...body.data, barbershopId: params.data.barbershopId, price: String(body.data.price) })
    .returning();
  res.status(201).json({ ...service, price: parseFloat(service.price) });
});

export default router;
