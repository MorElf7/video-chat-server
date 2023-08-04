import express, { Application } from "express";
import { createServer } from "http";
import config from "./config";
import logger from "./utils/logger";
import { setUpSocket } from "./utils/socket";

export async function setUpServer(app: Application) {
	await require("./loaders").default({ app });
	const server = createServer(app);
	setUpSocket(server);
	server.listen(config.port, () => {
		logger.info(`${config.serverName} is running on port ${config.port}`);
	});
	return server;
}

const app = express();
setUpServer(app).then((server) => {
	server.listen(config.port, () => {
		logger.info(`${config.serverName} is running on port ${config.port}`);
	});
});
