import { NotificationDto, NotificationQueries } from "../interfaces/INotification";
import { DataResponse, MsgResponse, PageResponse } from "../interfaces/IResponse";
import { UserDto } from "../interfaces/IUser";
import Notification from "../models/Notification";
import HttpException from "../utils/HttpException";

export class NotificationService {
	static async getNotifications(
		currentUser: UserDto,
		queries: NotificationQueries
	): Promise<PageResponse<NotificationDto>> {
		const page = parseInt(queries.page || "0"),
			pageSize = parseInt(queries.pageSize || "10"),
			isRead = queries.isRead;
		const where = {
			user: currentUser.id,
		} as any;
		if (isRead) {
			where.isRead = isRead === "true";
		}
		const notifications = await Notification.find(where, null, {
			limit: pageSize,
			skip: page * pageSize,
			sort: { createdAt: -1, updatedAt: -1 },
		}).populate([
			{
				path: "chat",
			},
			{
				path: "room",
			},
		]);

		const totalElements = await Notification.count(where);
		return {
			data: notifications.map((item) => item.toJSON()),
			totalPages: Math.ceil(totalElements / pageSize),
			totalElements,
			hasNext: Math.ceil(totalElements / pageSize) - page > 1,
		};
	}

	static async readNotification(
		currentUser: UserDto,
		notificationId: string
	): Promise<DataResponse<NotificationDto>> {
		let notification = await Notification.findById(notificationId);
		if (!notification) {
			throw new HttpException(404, "Notification not found");
		}
		if (!notification.user?.equals(currentUser.id)) {
			throw new HttpException(401, "Notification does not belong to user");
		}
		notification.isRead = true;
		notification = await notification.save();
		return { data: notification.toJSON() };
	}

	static async readAllNotifications(currentUser: UserDto): Promise<MsgResponse> {
		await Notification.updateMany(
			{
				user: currentUser.id,
			},
			{
				isRead: true,
			}
		);

		return { message: "Read all notifications successfully", status: 200 };
	}
}
