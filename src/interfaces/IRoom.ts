export interface RoomDto {
	id: string;
	users: string[];
	type: string;
	chats: ChatDto[];
	avatar: string;
	name: string;
	callRoom: string,
	description: string;
	updatedAt: Date;
	createdAt: Date;
}

export interface ChatDto {
	id: string;
	user: string;
	message: string;
	updatedAt: Date;
	createdAt: Date;
}
