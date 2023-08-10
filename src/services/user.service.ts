import bcrypt from "bcrypt";
import config from "../config";
import { QueriesRequest } from "../interfaces/IRequest";
import { DataResponse, PageResponse } from "../interfaces/IResponse";
import { SaveUserRequest, UserDto } from "../interfaces/IUser";
import User from "../models/User";
import HttpException from "../utils/HttpException";
import { checkUser } from "../utils/checkUtility";

export class UserService {
	static async getUserById(userId: string): Promise<DataResponse<UserDto>> {
		const user = await checkUser({ _id: userId });
		return { data: user.toJSON() };
	}

	static async saveUser(payload: SaveUserRequest): Promise<DataResponse<UserDto>> {
		const { id, username, firstName, lastName, email, phone, avatar, bio, password, newPassword } =
			payload;
		const user = await checkUser({ _id: id });
		user.username = username || user.username;
		user.firstName = firstName || user.firstName;
		user.lastName = lastName || user.lastName;
		user.email = email || user.email;
		user.bio = bio || user.bio;
		user.avatar = avatar || user.avatar;
		user.phone = phone || user.phone;

		if (password && newPassword) {
			const matchPassword = await bcrypt.compare(password, user.passwordHash);
			if (matchPassword) {
				const passwordHash = await bcrypt.hash(newPassword, config.saltRounds);
				user.passwordHash = passwordHash;
			} else {
				throw new HttpException(401, "Invalid username or password");
			}
		}

		const savedUser = await user.save();
		return { data: savedUser.toJSON() };
	}

	static async getUsers(
		currentUser: UserDto,
		queries: QueriesRequest
	): Promise<PageResponse<UserDto>> {
		const page = parseInt(queries.page || "0"),
			pageSize = parseInt(queries.pageSize || "10");
		const { textSearch } = queries;
		const where: any = {
			_id: { $ne: currentUser.id },
		};
		if (textSearch) {
			where.$text = {
				$search: textSearch,
			};
		}
		const users = await User.find(where, null, {
			limit: pageSize,
			skip: page * pageSize,
			sort: { createdAt: -1, updatedAt: -1 },
		});
		const totalElements = await User.count(where);
		return {
			data: users.map((e) => e.toJSON()),
			totalPages: Math.ceil(totalElements / pageSize),
			totalElements,
			hasNext: Math.ceil(totalElements / pageSize) - page > 1,
		};
	}
}
