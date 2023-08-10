import { Request, Response } from "express";
import { QueriesRequest } from "../interfaces/IRequest";
import { UserService } from "../services/user.service";
import HttpException from "../utils/HttpException";

export class UserController {
	static saveUser = async (req: Request, res: Response) => {
		try {
			const payload = req.body;
			res.json(await UserService.saveUser(payload));
		} catch (err: any) {
			throw new HttpException(
				err?.response?.data?.status || err?.status || 500,
				err?.response?.data?.message || err?.message
			);
		}
	};
	static getUserById = async (req: Request, res: Response) => {
		try {
			const { userId } = req.params;
			res.json(await UserService.getUserById(userId));
		} catch (err: any) {
			throw new HttpException(
				err?.response?.data?.status || err?.status || 500,
				err?.response?.data?.message || err?.message
			);
		}
	};
	static getUsers = async (req: Request, res: Response) => {
		try {
			const queries = req.query as unknown as QueriesRequest;
			const { user } = res.locals;
			res.json(await UserService.getUsers(user, queries));
		} catch (err: any) {
			throw new HttpException(
				err?.response?.data?.status || err?.status || 500,
				err?.response?.data?.message || err?.message
			);
		}
	};
}
