import { Request, Response } from "express";
import { QueriesRequest } from "../interfaces/IRequest";
import HttpException from "../utils/HttpException";
import { ChatService } from "../services/chat.service";

export class ChatController {
	static getChatById = async (req: Request, res: Response) => {
		try {
			const {chatId} = req.params;
			res.json(await ChatService.getChatById(chatId));
		} catch (err: any) {
			throw new HttpException(
				err?.response?.data?.status || err?.status || 500,
				err?.response?.data?.message || err?.message
			);
		}
	};
	static deleteChatById = async (req: Request, res: Response) => {
		try {
			const {chatId} = req.params;
			res.json(await ChatService.deleteChatById(chatId));
		} catch (err: any) {
			throw new HttpException(
				err?.response?.data?.status || err?.status || 500,
				err?.response?.data?.message || err?.message
			);
		}
	};
}
