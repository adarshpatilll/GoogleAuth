import express, { json } from "express";
import { connect } from "mongoose";
import { OAuth2Client } from "google-auth-library";
import jwt from "jsonwebtoken";
import cors from "cors";
import dotenv from "dotenv";
dotenv.config();

const app = express();
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

app.use(json());
app.use(cors({ origin: "*" }));

// MongoDB Connect
connect(process.env.MONGO_URI)
	.then(() => console.log("MongoDB connected"))
	.catch((err) => console.log(err));

import User from "./models/User.js";

// Google Sign-In Route
app.post("/auth/google", async (req, res) => {
	const { token } = req.body;

	try {
		// Google token verify karega
		const ticket = await client.verifyIdToken({
			idToken: token,
			audience: process.env.GOOGLE_CLIENT_ID,
		});

		const payload = ticket.getPayload();
		const { sub: googleId, picture, email, name } = payload;

		// User check aur create
		let user = await User.findOne({ googleId });

		if (!user) {
			user = new User({ googleId, email, name, picture });
			await user.save();
		}

		// JWT generate
		const jwtToken = jwt.sign(
			{ id: user._id, email: user.email },
			process.env.JWT_SECRET,
			{ expiresIn: "1h" }
		);

		res.json({ token: jwtToken });
	} catch (error) {
		console.error(error);
		res.status(401).json({ message: "Invalid Google token" });
	}
});

// User Route
app.get("/api/user", async (req, res) => {
	const token = req.headers.authorization;
	if (!token) return res.status(401).json({ message: "No token" });

	try {
		const { id } = jwt.verify(token, process.env.JWT_SECRET);
		const user = await User.findById(id);
		if (!user) return res.status(401).json({ message: "Invalid token" });

		res.json(user);
	} catch (error) {
		console.error(error);
		res.status(401).json({ message: "Invalid token" });
	}
});

// Server Start
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`\nServer running on port ${PORT}`));
