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

		jwt.verify(token, config.accessTokenSecret, function (err, decoded) {
			if (err) throw new HttpException(401, `Invalid token`)
			res.locals.user = decoded;
		}) ;
		next();
	});
