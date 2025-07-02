import { Schema, model } from "mongoose";

const userSchema = new Schema({
	googleId: { type: String, unique: true },
	email: { type: String, required: true, unique: true },
	name: { type: String },
	picture: { type: String },
	createdAt: { type: Date, default: Date.now },
});

export default model("User", userSchema);
