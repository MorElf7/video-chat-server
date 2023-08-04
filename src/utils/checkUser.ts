import User from "../models/User";
import HttpException from "./HttpException";

export const checkUser = async (userInfo: any) => {
	const user = await User.findOne(userInfo);
	if (!user) {
		throw new HttpException(404, `User not found`);
	}
	return user;
};
