import cors from "cors";
import { Application, json, urlencoded } from "express";
import helmet from "helmet";
import config from "../config";
import { errorHandler } from "../middlewares/errorHandler";
import { notFound } from "../middlewares/notFound";
import routes from "../routes";

export default async ({ app }: { app: Application }) => {
	app.enable("trust proxy");
	app.use(cors());
	app.use(helmet());
	app.use(
		json({
			limit: "100mb",
		})
	);
	app.use(
		urlencoded({
			limit: "100mb",
			extended: false,
			parameterLimit: 100000,
		})
	);
	app.use(config.api.prefix, routes());
	app.use(notFound);
	app.use(errorHandler);
};
