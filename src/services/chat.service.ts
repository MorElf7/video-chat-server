import { DataResponse, MsgResponse } from "../interfaces/IResponse";
import { ChatDto } from "../interfaces/IRoom";
import { checkChat } from "../utils/checkUtility";

export class ChatService {
	static async getChatById(chatId: string): Promise<DataResponse<ChatDto>> {
		const chat = await checkChat(chatId);
		return { data: chat.toJSON() };
	}

	static async deleteChatById(chatId: string): Promise<MsgResponse> {
		const chat = await checkChat(chatId);
		await chat.deleteOne();
		return { message: `Chat with id [${chatId}] deleted successfully`, status: 200 };
	}

}
