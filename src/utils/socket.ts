import { Server as httpServer } from "http";
import jwt from "jsonwebtoken";
import { Namespace, Server, Socket } from "socket.io";
import config from "../config";
import Room from "../models/Room";
import logger from "./logger";

let clients: any = {},
	rooms: any = [];

function updateClient(userId: string, newSocketId: string) {
	if (clients.hasOwnProperty(userId)) {
		clients[userId].oldSocketId = clients[userId].socketId;
		clients[userId].socketId = newSocketId;
		logger.info(`Client with id ${userId} reconnected with new socket id: ${newSocketId}`);
	} else {
		logger.info(`Cannot find client with id ${userId}`);
	}
}

export function setUpSocket(server: httpServer) {
	const io: Server = new Server(server, {
		cors: {
			origin: "*",
		},

		maxHttpBufferSize: 1e8, // 100 MB
	});

	const ns: Namespace = io.of("/socket");

	ns.use(function (socket: Socket, next) {
		const token = socket.handshake.auth.token;
		jwt.verify(token, config.accessTokenSecret, (err: any, decoded: any) => {
			if (err) {
				logger.error(err);
				ns.to(socket.id).emit("unauthorized", {
					message: "Invalid token",
				});
				socket.disconnect(true);
			}
			socket.data.user = decoded;
			next();
		});
	});

	ns.on("connection", (socket: Socket) => {
		if (!clients[socket.data.user.id]) {
			const clientInfo = {
				socketId: socket.id,
				...socket.data.user,
				oldSocketId: null,
				rooms: [],
			};
			clients[socket.data.user.id] = clientInfo;
			logger.info(`Client connected with id: ${socket.data.user.id}`);
		}
		socket.on("subscribe", async (data) => {
			socket.leave(data.roomId);
			socket.join(data.roomId);
			if (!rooms.find((id: string) => id === data.roomId)) {
				rooms.push(data.roomId);
			}
			if (clients[socket.data.user.id].rooms.find((id: any) => id === data.roomId)) {
				clients[socket.data.user.id].rooms.push(data.roomId);
			}
			const room = await Room.findById(data.roomId);
			room?.users.push(socket.data.user.id);
			await room?.save();
			socket.to(data.roomId).emit("new-user", { socket: socket.id });
			logger.info(`Client with id ${socket.data.user.id} subscribed to room ${data.roomId}`);
		});

		socket.on("make-offer", (data) => {
			socket.to(data.to).emit("offer-made", {
				offer: data.offer,
				socket: socket.id,
			});
		});

		socket.on("make-candidate", (data) => {
			socket.to(data.to).emit("candidate-made", {
				...data,
				to: null,
				socket: socket.id,
			});
		});

		socket.on("make-answer", (data) => {
			socket.to(data.to).emit("answer-made", {
				socket: socket.id,
				answer: data.answer,
			});
		});

		socket.on("start-call", (data) => {
			socket.to(data.to).emit("call-started", { socket: socket.id });
		});

		socket.on("leave-call", (data) => {
			socket.to(data.to).emit("left-call", { socket: socket.id });
		});

		socket.on("unsubscribe", async (data) => {
			socket.leave(data.roomid);
			rooms = rooms.filter((id: string) => id !== data.roomId);
			clients[socket.data.user.id].rooms = clients[socket.data.user.id].rooms.filter(
				(id: string) => id !== data.roomId
			);
			logger.info(`Client with id ${socket.data.user.id} unsubscribed from room ${data.roomId}`);
			const room = await Room.findById(data.roomId);
			room && (room.users = room?.users.filter((id) => !id.equals(socket.data.user.id)));
			if (room?.users.length === 0) {
				await room.deleteOne();
			} else {
				await room?.save();
			}
		});

		socket.on("send-message", (data) => {
			ns.to(data.to).emit("message-sent", {
				message: data.message,
				socket: socket.id,
			});
		});

		socket.on("disconnect", () => {
			clients[socket.data.user.id].oldSocketId = socket.id;
			socket.leave(clients[socket.data.user.id].rooms);
			clients[socket.data.user.id] = null;
			ns.emit("user-disconnected", {
				socketId: socket.id,
			});
			logger.info(`Client disconnected with id: ${socket.data.user.id}`);
		});

		socket.on("reconnect", (attemptNumber) => {
			logger.info(
				`Client with id ${socket.data.user.id} attempting to reconnect (attempt ${attemptNumber})...`
			);
			updateClient(socket.data.user.id, socket.id);
		});
	});
}
