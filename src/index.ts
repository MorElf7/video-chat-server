import express from "express";
import { createServer } from "http";
import config from "./config";
import { setUpSocket } from "./utils/socket";

export async function setUpServer() {
	const app = express();
	await require("./loaders").default({ app });
	const server = createServer(app);
	setUpSocket(server);
	server.listen(config.port, () => {
		console.log(`${config.serverName} is running on port ${config.port}`);
	});
	return server;
}

setUpServer();
