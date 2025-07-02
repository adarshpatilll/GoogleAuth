import mongoose from "mongoose";
import jwt from "jsonwebtoken";
import User from "../models/User.js";
import dotenv from "dotenv";

dotenv.config();

if (!mongoose.connections[0].readyState) {
	await mongoose.connect(process.env.MONGO_URI);
}

export default async function handler(req, res) {
	if (req.method !== "GET") {
		return res.status(405).json({ message: "Method Not Allowed" });
	}

	const token = req.headers.authorization;
	if (!token) return res.status(401).json({ message: "No token provided" });

	try {
		const { id } = jwt.verify(token, process.env.JWT_SECRET);
		const user = await User.findById(id);
		if (!user) return res.status(401).json({ message: "Invalid token" });

		res.status(200).json(user);
	} catch (error) {
		console.error(error);
		res.status(401).json({ message: "Invalid token" });
	}
}
