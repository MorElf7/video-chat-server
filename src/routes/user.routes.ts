import { Router } from "express";
import expressAsyncHandler from "express-async-handler";
import { UserController } from "../controllers/user.controller";
import { auth } from "../middlewares/auth";

const router = Router();

export default (app: Router) => {
	app.use("/user", router);

	router.get("/", auth(), expressAsyncHandler(UserController.getUsers));

	router.post("/", auth(), expressAsyncHandler(UserController.saveUser));

	router.get("/:userId", auth(), expressAsyncHandler(UserController.getUserById));
};
