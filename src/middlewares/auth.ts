import { NextFunction, Request, Response } from "express";
import expressAsyncHandler from "express-async-handler";
import jwt from "jsonwebtoken";
import config from "../config";
import HttpException from "../utils/HttpException";

export const auth = () =>
	expressAsyncHandler((req: Request, res: Response, next: NextFunction) => {
		const tokenBearer = req.header("Authorization") || req.header("X-Authorization");
		if (!tokenBearer) {
			throw new HttpException(401, `Invalid token`);
		}
		const token = tokenBearer.split(" ")[1];

		const decoded = jwt.verify(token, config.accessTokenSecret) as any;
		res.locals.user = decoded;
		next();
	});
