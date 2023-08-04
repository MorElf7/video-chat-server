import { NextFunction, Request, Response } from "express";
import HttpException from "../utils/HttpException";

export const notFound = (req: Request, res: Response, next: NextFunction) => {
	const err = new HttpException(404, `Not Found ${req.originalUrl}`);
	next(err);
};
