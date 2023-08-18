import { Request, Response } from "express";
import { QueriesRequest } from "../interfaces/IRequest";
import { RoomService } from "../services/room.service";
import HttpException from "../utils/HttpException";

export class RoomController {
	static getRooms = async (req: Request, res: Response) => {
		try {
			const { user } = res.locals;
			const queries = req.query as unknown as QueriesRequest;
			res.json(await RoomService.getRooms(queries));
		} catch (err: any) {
			throw new HttpException(
				err?.response?.data?.status || err?.status || 500,
				err?.response?.data?.message || err?.message
			);
		}
	};
	static getUserRooms = async (req: Request, res: Response) => {
		try {
			const { user } = res.locals;
			const queries = req.query as unknown as QueriesRequest;
			res.json(await RoomService.getUserRooms(user, queries));
		} catch (err: any) {
			throw new HttpException(
				err?.response?.data?.status || err?.status || 500,
				err?.response?.data?.message || err?.message
			);
		}
	};
	static saveRoom = async (req: Request, res: Response) => {
		try {
			const { user } = res.locals;
			res.json(await RoomService.saveRoom(user, req.body));
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
			const { user } = res.locals;
			res.json(await RoomService.getRoomById(user, roomId));
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
			res.json(await RoomService.deleteRoomById(roomId));
		} catch (err: any) {
			throw new HttpException(
				err?.response?.data?.status || err?.status || 500,
				err?.response?.data?.message || err?.message
			);
		}
	};
	static getChatsByRoomId = async (req: Request, res: Response) => {
		try {
			const { user } = res.locals;
			const { roomId } = req.params;
			const queries = req.query as unknown as QueriesRequest;
			res.json(await RoomService.getChatsByRoomId(user, roomId, queries));
		} catch (err: any) {
			throw new HttpException(
				err?.response?.data?.status || err?.status || 500,
				err?.response?.data?.message || err?.message
			);
		}
	};
}
