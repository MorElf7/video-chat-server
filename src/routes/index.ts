import { Router } from "express";
import authRoutes from "./auth.routes";
import roomRoutes from "./room.routes";

export default () => {
	const app = Router();
	authRoutes(app);
	roomRoutes(app);
	return app;
};
