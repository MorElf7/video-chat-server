import { NextFunction, Request, Response } from "express";
import config from "../config";
import HttpException from "../utils/HttpException";

export const errorHandler = (
	err: HttpException,
	req: Request,
	res: Response,
	next: NextFunction
) => {
	const statusCode = err.status || 500;
	res.status(statusCode);
	res.json({
		status: statusCode,
		message: err.message || "Internal Server Error",
		stack: config.isDev ? err.stack : undefined,
		timestamp: new Date().toISOString(),
	});
};
