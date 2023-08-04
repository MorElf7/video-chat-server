import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import config from "../config";
import {
	GetAccessTokenRequest,
	LoginRequest,
	LoginResponse,
	SignUpRequest,
} from "../interfaces/IAuth";
import UserCredential from "../models/RefreshToken";
import User from "../models/User";
import HttpException from "../utils/HttpException";
import { checkUser } from "../utils/checkUser";

const generateAccessToken = (user: any) => {
	return jwt.sign(JSON.stringify(user), config.accessTokenSecret, {
		expiresIn: "12h",
	});
};

const generateRefreshToken = async (id: string, ipAddress: string) => {
	const refreshToken = jwt.sign(JSON.stringify({ id: id }), config.refreshTokenSecret);
	await UserCredential.create({
		user: id,
		token: refreshToken,
		expireAt: Date.now() + 1000 * 60 * 60 * 24,
		createdAt: Date.now(),
		createdByIp: ipAddress,
	});
	return refreshToken;
};

export class AuthService {
	static async login(payload: LoginRequest): Promise<LoginResponse> {
		const { username, password, ipAddress } = payload;
		const userInfo = await User.findOne({ username });
		if (!userInfo) {
			throw new HttpException(404, "Invalid username or password");
		}
		const matchPassword = await bcrypt.compare(password, userInfo.passwordHash);
		if (matchPassword) {
			const token = generateAccessToken(userInfo.toJSON());
			const refreshToken = await generateRefreshToken(userInfo._id.toString(), ipAddress);
			return {
				token,
				refreshToken,
			};
		} else {
			throw new HttpException(401, "Invalid username or password");
		}
	}

	static async signup(payload: SignUpRequest): Promise<LoginResponse> {
		const { username, password, ipAddress, firstName, lastName } = payload;
		const existingUser = await User.findOne({ username });
		if (existingUser) {
			throw new HttpException(400, "User already exists");
		}
		const passwordHash = await bcrypt.hash(password, config.saltRounds);
		const userInfo = await User.create({
			username,
			passwordHash,
			firstName,
			lastName,
		});
		const token = generateAccessToken(userInfo.toJSON());
		const refreshToken = await generateRefreshToken(userInfo._id.toString(), ipAddress);
		return {
			token,
			refreshToken,
		};
	}

	static async getAccessToken(payload: GetAccessTokenRequest): Promise<LoginResponse> {
		const { token, ipAddress } = payload;
		const userCredential = await UserCredential.findOne({
			token,
		});
		if (
			!userCredential ||
			userCredential.get("isExpired") ||
			userCredential.createdByIp !== ipAddress
		) {
			throw new HttpException(401, "Invalid token");
		}
		const userInfo = await checkUser({ user: userCredential?.user });

		const accessToken = generateAccessToken(userInfo?.toJSON());
		return {
			token: accessToken,
		};
	}
}
