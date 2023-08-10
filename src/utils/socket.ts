import { Server as httpServer } from "http";
import jwt from "jsonwebtoken";
import { Namespace, Server, Socket } from "socket.io";
import config from "../config";
import Chat from "../models/Chat";
import Notification from "../models/Notification";
import Room from "../models/Room";

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
				console.error(err);
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
		console.log(`Client connected with id: ${socket.id}`);
		socket.on(
			"subscribe",
			async (data: { roomId: string; type: string; audio: boolean; video: boolean }) => {
				const room = await Room.findById(data.roomId);
				if (!room) return;
				socket.join(data.roomId);
				if (!room.users.find((id) => id.equals(socket.data.user.id))) {
					room?.users.push(socket.data.user.id);
					await room?.save();
				}
				const sockets = await ns.in(data.roomId).fetchSockets();

				if (data.type === "call" && sockets.length === 1) {
					const chatRoom = await Room.findOne({ callRoom: data.roomId });
					if (chatRoom) {
						const chat = await Chat.create({
							room: chatRoom._id.toString(),
							message: `Called you`,
							user: socket.data.user.id,
						});
						for (const user of room.users.filter(id => !id.equals(socket.data.user.id))) {
							await Notification.create({
								user,
								room: chatRoom._id,
								chat,
								isRead: false,
							});
						}
						socket.to(chatRoom._id.toString()).emit("call-started", {
							socket: socket.id,
							user: socket.data.user.id,
						});
					}
				}
				socket.to(data.roomId).emit("new-user", {
					type: data.type,
					socket: socket.id,
					user: socket.data.user.id,
					audio: data.audio,
					video: data.video,
				});

				console.log(`Client with id ${socket.id} subscribed to room ${data.roomId}`);
			}
		);

		socket.on(
			"make-offer",
			(data: { to: string; offer: RTCSessionDescriptionInit; audio: boolean; video: boolean }) => {
				socket.to(data.to).emit("offer-made", {
					offer: data.offer,
					socket: socket.id,
					user: socket.data.user.id,
					audio: data.audio,
					video: data.video,
				});
			}
		);

		socket.on("make-candidate", (data: { to: string; candidate: string; label: number | null }) => {
			socket.to(data.to).emit("candidate-made", {
				candidate: data.candidate,
				label: data.label,
				socket: socket.id,
			});
		});

		socket.on("make-answer", (data: { to: string; answer: RTCSessionDescriptionInit }) => {
			socket.to(data.to).emit("answer-made", {
				socket: socket.id,
				answer: data.answer,
			});
		});

		socket.on("leave-call", async (data: { to: string }) => {
			const room = await Room.findById(data.to);
			if (!room) return;
			socket.leave(data.to);
			socket.to(data.to).emit("left-call", { socket: socket.id, user: socket.data.user.id });
		});

		socket.on("unsubscribe", async (data: { roomId: string }) => {
			const room = await Room.findById(data.roomId);
			if (!room) return;
			room && (room.users = room.users.filter((id) => !id.equals(socket.data.user.id)));
			await room?.save();
			socket.leave(data.roomId);
			console.log(`Client with id ${socket.data.user.id} unsubscribed from room ${data.roomId}`);
		});

		socket.on("send-message", async (data: { to: string; message: string }) => {
			const room = await Room.findById(data.to);
			if (!room) return;
			const chat = await Chat.create({
				room: data.to,
				message: data.message,
				user: socket.data.user.id,
			});
			for (const user of room.users.filter(id => !id.equals(socket.data.user.id))) {
				await Notification.create({
					user,
					room: room._id,
					chat,
					isRead: false,
				});
			}
			ns.to(data.to).emit("message-sent", {
				chat: chat.toJSON(),
			});
		});

		socket.on(
			"mute-config",
			({ audio, video, to }: { to: string; audio: boolean; video: boolean }) => {
				socket.to(to).emit("new-mute-config", {
					socket: socket.id,
					audio,
					video,
				});
			}
		);

		socket.on("disconnect", async () => {
			ns.emit("user-disconnected", {
				user: socket.data.user.id,
				socket: socket.id,
			});
			console.log(`Client disconnected with id: ${socket.id}`);
		});
	});
}
