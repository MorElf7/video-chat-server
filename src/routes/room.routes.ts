import { Router } from "express";
import expressAsyncHandler from "express-async-handler";
import { RoomController } from "../controllers/room.controller";
import { auth } from "../middlewares/auth";

const router = Router();

export default (app: Router) => {
	app.use("/room", router);

	router.get("/", auth(), expressAsyncHandler(RoomController.getRooms));

	
	router.post("/", auth(), expressAsyncHandler(RoomController.saveRoom));

	router.get("/user", auth(), expressAsyncHandler(RoomController.getUserRooms));

	router.get("/call/:roomId", auth(), expressAsyncHandler(RoomController.getRoomByCallRoomId));

	router.get("/:roomId/chat", auth(), expressAsyncHandler(RoomController.getChatsByRoomId));

	router.get("/:roomId", auth(), expressAsyncHandler(RoomController.getRoomById));

	router.delete("/:roomId", auth(), expressAsyncHandler(RoomController.deleteRoomById));
};
