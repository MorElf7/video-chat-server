import { Router } from "express";
import expressAsyncHandler from "express-async-handler";
import { RoomController } from "../controllers/room.controller";
import { auth } from "../middlewares/auth";

const router = Router();

export default (app: Router) => {
	app.use("/room", router);

	router.get("/", auth(), expressAsyncHandler(RoomController.getRooms));

	router.post("/", auth(), expressAsyncHandler(RoomController.createRoom));

	router.get("/:roomId", auth(), expressAsyncHandler(RoomController.getRoomById));

	router.delete("/:roomId", auth(), expressAsyncHandler(RoomController.getRoomById));
};
