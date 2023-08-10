import Chat from "../models/Chat";
import Room from "../models/Room";
import User from "../models/User";
import HttpException from "./HttpException";

export const checkUser = async (userInfo: any) => {
	const user = await User.findOne(userInfo);
	if (!user) {
		throw new HttpException(404, `User not found`);
	}
	return user;
};

export const checkUserInRoom = async (userId: string, roomId: string) => {
	const user = await User.findById(userId);
	if (!user) {
		throw new HttpException(404, `User not found`);
	}
	const room = await Room.findById(roomId);
	if (!room) {
		throw new HttpException(404, `Room not found`);
	}
	if (!room.users.includes(user._id)) {
		throw new HttpException(401, `User not in room`);
	}
	return room;
};

export const checkChat = async (chatId: string) => {
	const chat = await Chat.findById(chatId);
	if (!chat) {
		throw new HttpException(404, `chat not found`);
	}
	return chat;
};
