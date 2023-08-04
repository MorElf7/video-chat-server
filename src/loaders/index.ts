import { Application } from "express";
import databaseLoader from "./database";
import expressLoader from "./express";

export default async ({ app }: { app: Application }) => {
	await databaseLoader({ app });
	console.log(`Database loaded`);
	await expressLoader({ app });
	console.log(`Express loaded`);
};
