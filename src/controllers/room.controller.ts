import { Request, Response } from "express";
import { QueriesRequest } from "../interfaces/IRequest";
import { RoomService } from "../services/room.service";
import HttpException from "../utils/HttpException";

export class RoomController {
	static getRooms = async (req: Request, res: Response) => {
		try {
			const { user } = res.locals;
			const queries = req.query as unknown as QueriesRequest;
			const result = await RoomService.getRooms(user, queries);
			res.json(result);
		} catch (err: any) {
			throw new HttpException(
				err?.response?.data?.status || err?.status || 500,
				err?.response?.data?.message || err?.message
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
				err?.response?.data?.message || err?.message
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
				err?.response?.data?.message || err?.message
			);
		}
	};
	static deleteRoomById = async (req: Request, res: Response) => {
		try {
			const { roomId } = req.params;
			const result = await RoomService.deleteRoomById(roomId);
			res.json(result);
		} catch (err: any) {
			throw new HttpException(
				err?.response?.data?.status || err?.status || 500,
				err?.response?.data?.message || err?.message
			);
		}
	};
}
