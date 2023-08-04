import { Schema, model } from "mongoose";

const roomSchema = new Schema(
	{
		users: [
			{
				type: Schema.Types.ObjectId,
				ref: "user",
			},
		],
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

roomSchema.virtual("id").get(function () {
	return this._id.toString();
});

roomSchema.post("findOneAndUpdate", function (doc) {
	if (doc) {
		doc.updatedAt = Date.now();
	}
});

export default model("Room", roomSchema);
