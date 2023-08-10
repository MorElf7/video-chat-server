import { Request, Response } from "express";
import { AuthService } from "../services/auth.service";
import HttpException from "../utils/HttpException";

export class AuthController {
	static login = async (req: Request, res: Response) => {
		try {
			const payload = req.body;
			payload.ipAddress = req.ip;
			res.json(await AuthService.login(payload));
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
			res.json(await AuthService.signup(payload));
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
			res.json(await AuthService.getAccessToken(payload));
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
			res.json(await AuthService.getUserProfile(user));
		} catch (err: any) {
			throw new HttpException(
				err?.response?.data?.status || err?.status || 500,
				err?.response?.data?.message || err?.message
			);
		}
	};
}
