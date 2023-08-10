import { Router } from "express";
import authRoutes from "./auth.routes";
import chatRoutes from "./chat.routes";
import roomRoutes from "./room.routes";
import userRoutes from "./user.routes";

export default () => {
	const app = Router();
	authRoutes(app);
	roomRoutes(app);
	userRoutes(app);
	chatRoutes(app);
	return app;
};
