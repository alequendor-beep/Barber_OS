import { Router, type IRouter } from "express";
import healthRouter from "./health";
import barbershopsRouter from "./barbershops";
import barbersRouter from "./barbers";
import servicesRouter from "./services";
import clientsRouter from "./clients";
import appointmentsRouter from "./appointments";

const router: IRouter = Router();

router.use(healthRouter);
router.use(barbershopsRouter);
router.use(barbersRouter);
router.use(servicesRouter);
router.use(clientsRouter);
router.use(appointmentsRouter);

export default router;
