import { Request, Response } from "express";
import { RoomService } from "../services/room.service";
import HttpException from "../utils/HttpException";

export class RoomController {
	static getRooms = async (req: Request, res: Response) => {
		try {
			const { user } = res.locals;
			const result = await RoomService.getRooms(user);
			res.json(result);
		} catch (err: any) {
			throw new HttpException(
				err?.response?.data?.status || err?.status || 500,
				err?.response?.data?.message || err?.stack || err?.message
			);
		}
	};
	static createRoom = async (req: Request, res: Response) => {
		try {
			const result = await RoomService.createRoom();
			res.json(result);
		} catch (err: any) {
			throw new HttpException(
				err?.response?.data?.status || err?.status || 500,
				err?.response?.data?.message || err?.stack || err?.message
			);
		}
	};
	static getRoomById = async (req: Request, res: Response) => {
		try {
			const { roomId } = req.params;
			const result = await RoomService.getRoomById(roomId);
			res.json(result);
		} catch (err: any) {
			throw new HttpException(
				err?.response?.data?.status || err?.status || 500,
				err?.response?.data?.message || err?.stack || err?.message
			);
		}
	};
}
