import Room from "../models/Room";
import HttpException from "../utils/HttpException";

export class RoomService {
	static async createRoom() {
		const room = await Room.create({});
		return { data: room.toJSON() };
	}

	static async getRooms(currentUser: any) {
		const rooms = await Room.find({
			users: currentUser.id,
		});
		return { data: rooms.map((item) => item.toJSON()) };
	}

	static async getRoomById(roomId: string) {
		const room = await Room.findById(roomId);
		if (!room) {
			throw new HttpException(404, "Room not found");
		}
		return { data: room.toJSON() };
	}
}
