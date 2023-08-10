import { model, Schema } from "mongoose";

const chatSchema = new Schema(
	{
		message: String,
		user: {
			type: Schema.Types.ObjectId,
			ref: "User",
		},
		room: {
			type: Schema.Types.ObjectId,
			ref: "Room",
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
				delete ret.room;
			},
		},
	}
);

chatSchema.virtual("id").get(function () {
	return this._id.toString();
});

chatSchema.post("findOneAndUpdate", function (doc) {
	if (doc) {
		doc.updatedAt = Date.now();
	}
});

export default model("Chat", chatSchema);
