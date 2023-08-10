import { Router } from "express";
import expressAsyncHandler from "express-async-handler";
import { auth } from "../middlewares/auth";
import { ChatController } from "../controllers/chat.controller";

const router = Router();

export default (app: Router) => {
	app.use("/chat", router);

	router.get("/:chatId", auth(), expressAsyncHandler(ChatController.getChatById));

	router.delete("/:chatId", auth(), expressAsyncHandler(ChatController.deleteChatById));

};
