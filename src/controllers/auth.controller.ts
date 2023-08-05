import { Request, Response } from "express";
import { AuthService } from "../services/auth.service";
import HttpException from "../utils/HttpException";

export class AuthController {
	static login = async (req: Request, res: Response) => {
		try {
			const payload = req.body;
			payload.ipAddress = req.ip;
			const result = await AuthService.login(payload);
			res.json(result);
		} catch (err: any) {
			throw new HttpException(
				err?.response?.data?.status || err?.status || 500,
				err?.response?.data?.message || err?.message
			);
		}
	};
	static signup = async (req: Request, res: Response) => {
		try {
			const payload = req.body;
			payload.ipAddress = req.ip;
			const result = await AuthService.signup(payload);
			res.json(result);
		} catch (err: any) {
			throw new HttpException(
				err?.response?.data?.status || err?.status || 500,
				err?.response?.data?.message || err?.message
			);
		}
	};
	static getAccessToken = async (req: Request, res: Response) => {
		try {
			const payload = req.body;
			payload.ipAddress = req.ip;
			const result = await AuthService.getAccessToken(payload);
			res.json(result);
		} catch (err: any) {
			throw new HttpException(
				err?.response?.data?.status || err?.status || 500,
				err?.response?.data?.message || err?.message
			);
		}
	};
	static getUserProfile = async (req: Request, res: Response) => {
		try {
			const { user } = res.locals;
			const result = await AuthService.getUserProfile(user);
			res.json(result);
		} catch (err: any) {
			throw new HttpException(
				err?.response?.data?.status || err?.status || 500,
				err?.response?.data?.message || err?.message
			);
		}
	};
}
