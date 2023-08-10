import { model, Schema } from "mongoose";

const notificationSchema = new Schema(
	{
		user: {
			type: Schema.Types.ObjectId,
			ref: "User",
		},
		room: {
			type: Schema.Types.ObjectId,
			ref: "Room",
		},
		chat: {
			type: Schema.Types.ObjectId,
			ref: "Chat",
		},
		isRead: { type: Boolean, default: false },
		updatedAt: {
			type: Date,
			default: Date.now,
		},
		createdAt: {
			type: Date,
			default: Date.now,
		},
	},
	{
		toJSON: {
			virtuals: true,
			versionKey: false,
			transform: function (doc, ret) {
				delete ret._id;
			},
		},
	}
);

notificationSchema.virtual("id").get(function () {
	return this._id.toString();
});

notificationSchema.post("findOneAndUpdate", function (doc) {
	if (doc) {
		doc.updatedAt = Date.now();
	}
});

export default model("Notification", notificationSchema);
