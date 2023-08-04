import { Application } from "express";
import logger from "../utils/logger";
import databaseLoader from "./database";
import expressLoader from "./express";

export default async ({ app }: { app: Application }) => {
	await databaseLoader({ app });
	logger.info(`Database loaded`);
	await expressLoader({ app });
	logger.info(`Express loaded`);
};
