import { Application } from "express";
import mongoose from "mongoose";
import config from "../config";
import logger from "../utils/logger";

export default async ({ app }: { app: Application }) => {
	await mongoose.connect(config.db.url);
};
