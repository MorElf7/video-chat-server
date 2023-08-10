import { Types } from "mongoose";
import { QueriesRequest, RoomRequest } from "../interfaces/IRequest";
import { DataResponse, MsgResponse, PageResponse } from "../interfaces/IResponse";
import { ChatDto, RoomDto } from "../interfaces/IRoom";
import { UserDto } from "../interfaces/IUser";
import Chat from "../models/Chat";
import Room from "../models/Room";
import HttpException from "../utils/HttpException";
import { checkUserInRoom } from "../utils/checkUtility";

export class RoomService {
	static async saveRoom(
		currentUser: UserDto,
		payload: RoomRequest
	): Promise<DataResponse<RoomDto>> {
		const { id, avatar, name, users, description } = payload;
		let room: any;
		if (id) {
			room = await Room.findById(id);
			if (!room) {
				throw new HttpException(404, "Room not found");
			}
			room.users = users || room.users;
			room.avatar = avatar || room.avatar;
			room.name = name || room.name;
			room.description = description || room.description;
			room = await room?.save();
		} else {
			const callRoom = await Room.create({
				users: [currentUser.id, ...users],
				type: "call",
			});
			room = await Room.create({
				type: "chat",
				avatar,
				name,
				description,
				users: [currentUser.id, ...users],
				callRoom,
			});
		}
		return { data: room.toJSON() };
	}

	static async getRooms(queries: QueriesRequest): Promise<PageResponse<RoomDto>> {
		const page = parseInt(queries.page || "0"),
			pageSize = parseInt(queries.pageSize || "10");
		const textSearch = queries.textSearch;
		const where: any = {
			type: "chat",
		};
		if (textSearch) {
			where.$text = { $search: textSearch };
		}
		const rooms = await Room.find(where, null, {
			limit: pageSize,
			skip: page * pageSize,
			sort: { createdAt: -1, updatedAt: -1 },
		});
		const data = [];
		for (const room of rooms) {
			const chats = await Chat.find(
				{
					room: room._id,
				},
				null,
				{ limit: 1, sort: { createdAt: -1 } }
			);
			data.push({
				...(room.toJSON() as RoomDto),
				chats: chats.map((chat) => chat.toJSON() as ChatDto),
			});
		}

		const totalElements = await Room.count(where);
		return {
			data,
			totalPages: Math.ceil(totalElements / pageSize),
			totalElements,
			hasNext: Math.ceil(totalElements / pageSize) - page > 1,
		};
	}

	static async getUserRooms(
		currentUser: UserDto,
		queries: QueriesRequest
	): Promise<PageResponse<RoomDto>> {
		const page = parseInt(queries.page || "0"),
			pageSize = parseInt(queries.pageSize || "10");
		const { textSearch } = queries;
		const where: any = {
			users: currentUser.id,
			type: "chat",
		};
		if (textSearch) {
			where.$text = { $search: textSearch };
		}
		const rooms = await Room.find(where, null, {
			limit: pageSize,
			skip: page * pageSize,
			sort: { createdAt: -1, updatedAt: -1 },
		});
		const data = [];
		for (const room of rooms) {
			const chats = await Chat.find(
				{
					room: room._id,
				},
				null,
				{ limit: 1, sort: { createdAt: -1 } }
			);
			data.push({
				...(room.toJSON() as RoomDto),
				chats: chats.map((chat) => chat.toJSON() as ChatDto),
			});
		}

		const totalElements = await Room.count(where);
		return {
			data,
			totalPages: Math.ceil(totalElements / pageSize),
			totalElements,
			hasNext: Math.ceil(totalElements / pageSize) - page > 1,
		};
	}

	static async getRoomById(currentUser: UserDto, roomId: string): Promise<DataResponse<RoomDto>> {
		const room = await checkUserInRoom(currentUser.id, roomId);
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

	static async getRoomByCallRoomId(roomId: string): Promise<DataResponse<RoomDto>> {
		const room = await Room.findOne({
			callRoom: roomId,
		});
		if (!room) {
			throw new HttpException(404, "Room not found");
		}
		return { data: room.toJSON() };
	}

	static async getChatsByRoomId(
		currentUser: UserDto,
		roomId: string,
		queries: QueriesRequest
	): Promise<PageResponse<ChatDto>> {
		await checkUserInRoom(currentUser.id, roomId);
		const page = parseInt(queries.page || "0"),
			pageSize = parseInt(queries.pageSize || "10");
		const chats = await Chat.find(
			{
				room: roomId,
			},
			null,
			{ limit: pageSize, skip: page * pageSize, sort: { createdAt: -1, updatedAt: -1 } }
		);
		const totalElements = await Chat.count({
			room: roomId,
		});
		return {
			data: chats.map((item) => item.toJSON()),
			totalPages: Math.ceil(totalElements / pageSize),
			totalElements,
			hasNext: Math.ceil(totalElements / pageSize) - page > 1,
		};
	}
}
