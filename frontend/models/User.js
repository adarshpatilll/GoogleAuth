import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
	googleId: { type: String, unique: true },
	email: { type: String, required: true, unique: true },
	name: { type: String },
	picture: { type: String },
	createdAt: { type: Date, default: Date.now },
});

// Avoid model overwrite issue in serverless environments
export default mongoose.models.User || mongoose.model("User", userSchema);
