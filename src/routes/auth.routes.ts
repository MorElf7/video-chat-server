import { Router } from "express";
import expressAsyncHandler from "express-async-handler";
import { AuthController } from "../controllers/auth.controller";
import { auth } from "../middlewares/auth";

const router = Router();

export default (app: Router) => {
	app.use("/auth", router);

	router.post("/login", expressAsyncHandler(AuthController.login));

	router.post("/signup", expressAsyncHandler(AuthController.signup));

	router.post("/token", expressAsyncHandler(AuthController.getAccessToken));

	router.get("/user", auth(), expressAsyncHandler(AuthController.getUserProfile));
};
