import { Schema, model } from "mongoose";

const userCredentialsSchema = new Schema(
	{
		user: { type: Schema.Types.ObjectId, ref: "User", required: true },
		token: String,
		expireAt: { type: Date, required: true },
		createdAt: { type: Date, default: Date.now },
		createdByIp: String,
	},
	{
		toJSON: {
			virtuals: true,
			versionKey: false,
			transform: function (doc, ret) {
				delete ret._id;
				delete ret.id;
				delete ret.user;
			},
		},
	}
);

userCredentialsSchema.virtual("isExpired").get(function () {
	return Date.now() >= this.expireAt.valueOf();
});

export default model("UserCredential", userCredentialsSchema);
