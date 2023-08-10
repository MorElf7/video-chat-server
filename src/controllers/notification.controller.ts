import { Request, Response } from "express";
import { NotificationQueries } from "../interfaces/INotification";
import { NotificationService } from "../services/notification.service";
import HttpException from "../utils/HttpException";

export class NotificationController {
	static getNotifications = async (req: Request, res: Response) => {
		try {
			const { user } = res.locals;
			const queries = req.query as unknown as NotificationQueries;
			res.json(await NotificationService.getNotifications(user, queries));
		} catch (err: any) {
			throw new HttpException(
				err?.response?.data?.status || err?.status || 500,
				err?.response?.data?.message || err?.message
			);
		}
	};
	static readAllNotifications = async (req: Request, res: Response) => {
		try {
			const { user } = res.locals;
			res.json(await NotificationService.readAllNotifications(user));
		} catch (err: any) {
			throw new HttpException(
				err?.response?.data?.status || err?.status || 500,
				err?.response?.data?.message || err?.message
			);
		}
	};
	static readNotification = async (req: Request, res: Response) => {
		try {
			const { notificationId } = req.params;
			const { user } = res.locals;
			res.json(await NotificationService.readNotification(user, notificationId));
		} catch (err: any) {
			throw new HttpException(
				err?.response?.data?.status || err?.status || 500,
				err?.response?.data?.message || err?.message
			);
		}
	};
}
