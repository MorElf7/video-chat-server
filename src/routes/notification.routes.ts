import { Router } from "express";
import expressAsyncHandler from "express-async-handler";
import { NotificationController } from "../controllers/notification.controller";
import { auth } from "../middlewares/auth";

const router = Router();

export default (app: Router) => {
	app.use("/notification", router);

	router.get("/", auth(), expressAsyncHandler(NotificationController.getNotifications));

	router.post("/", auth(), expressAsyncHandler(NotificationController.readAllNotifications));

	router.post("/:notificationId", auth(), expressAsyncHandler(NotificationController.readNotification));
};
