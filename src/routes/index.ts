import { Router, Request, Response } from "express";
import order from "./order";
import webhook from "./webhook";


const routes = Router();

routes.use("/order", order);
routes.use("/webhook", webhook);

export default routes;


