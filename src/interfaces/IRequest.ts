export interface QueriesRequest {
	page: string;
	pageSize: string;
	textSearch: string;
}

export interface RoomRequest {
	id?: string;
	users: string[];
	type: string;
	avatar: string;
	description: string;
	name: string;
}
