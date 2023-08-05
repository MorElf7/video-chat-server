import { QueriesRequest } from "../interfaces/IRequest";
import { DataResponse, MsgResponse, PageResponse } from "../interfaces/IResponse";
import { RoomDto } from "../interfaces/IRoom";
import Room from "../models/Room";
import HttpException from "../utils/HttpException";

export class RoomService {
	static async createRoom(): Promise<DataResponse<RoomDto>> {
		const room = await Room.create({});
		return { data: room.toJSON() };
	}

	static async getRooms(currentUser: any, queries: QueriesRequest): Promise<PageResponse<RoomDto>> {
		const page = parseInt(queries.page || "0"),
			pageSize = parseInt(queries.pageSize || "10");
		const rooms = await Room.find(
			{
				users: currentUser.id,
			},
			null,
			{ limit: pageSize, skip: page * pageSize, sort: { createdAt: -1, updatedAt: -1 } }
		);
		const totalElements = rooms.length;
		return {
			data: rooms.map((item) => item.toJSON()),
			totalPages: Math.ceil(totalElements / pageSize),
			totalElements,
			hasNext: Math.ceil(totalElements / pageSize) - page > 1,
		};
	}

	static async getRoomById(roomId: string): Promise<DataResponse<RoomDto>> {
		const room = await Room.findById(roomId);
		if (!room) {
			throw new HttpException(404, "Room not found");
		}
		return { data: room.toJSON() };
	}

	static async deleteRoomById(roomId: string): Promise<MsgResponse> {
		const room = await Room.findById(roomId);
		if (!room) {
			throw new HttpException(404, "Room not found");
		}
		await Room.deleteOne();
		return { message: `Room with id [${roomId}] deleted successfully`, status: 200 };
	}
}
