export interface UserDto {
	id: string;
	username: string;
	firstName: string;
	lastName: string;
	email: string;
	phone: string;
	avatar: string;
	bio: string;
	updatedAt: Date;
	createdAt: Date;
}

export interface SaveUserRequest {
	id: string;
	username: string;
	firstName: string;
	lastName: string;
	email: string;
	phone: string;
	avatar: string;
	bio: string;
	password: string;
	newPassword: string;
}
