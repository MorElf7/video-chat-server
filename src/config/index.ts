import dotenv from "dotenv";

const isDev = process.env.NODE_ENV === "development";

dotenv.config({ path: isDev ? `../../../../.env.dev` : "" });

const dirName = isDev ? "../../.dev-logs" : process.env.LOG_DIRNAME || "/var/log/video-chat";

const config = {
	isDev: isDev,
	serverName: "BACKEND-SERVER",
	port: process.env.PORT || "8082",
	log: {
		dirName,
	},
	api: {
		prefix: "/api",
	},
	db: {
		url: process.env.MONGDB_URL || "mongodb://localhost:27017/video-chat",
	},
	accessTokenSecret: process.env.ACCESS_TOKEN_SECRET || "supersupersecretkey",
	refreshTokenSecret: process.env.REFRESH_TOKEN_SECRET || "supersecretsecretkey",
	saltRounds: parseInt(process.env.SALT_ROUNDS || "12"),
};

export default config;
