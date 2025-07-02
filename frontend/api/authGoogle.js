import { OAuth2Client } from "google-auth-library";
import mongoose from "mongoose";
import jwt from "jsonwebtoken";
import User from "../models/User.js";
import dotenv from "dotenv";

dotenv.config();

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

// Connect to MongoDB Atlas (only once per cold start)
if (!mongoose.connections[0].readyState) {
	await mongoose.connect(process.env.MONGO_URI);
}

export default async function handler(req, res) {
	if (req.method !== "POST") {
		return res.status(405).json({ message: "Method Not Allowed" });
	}

	const { token } = req.body;

	try {
		const ticket = await client.verifyIdToken({
			idToken: token,
			audience: process.env.GOOGLE_CLIENT_ID,
		});

		const payload = ticket.getPayload();
		const { sub: googleId, picture, email, name } = payload;

		let user = await User.findOne({ googleId });

		if (!user) {
			user = new User({ googleId, email, name, picture });
			await user.save();
		}

		const jwtToken = jwt.sign(
			{ id: user._id, email: user.email },
			process.env.JWT_SECRET,
			{ expiresIn: "1h" }
		);

		res.status(200).json({ token: jwtToken });
	} catch (error) {
		console.error(error);
		res.status(401).json({ message: "Invalid Google token" });
	}
}
