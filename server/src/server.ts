/** @format */

import express from "express";
import http from "http";
import { Server } from "socket.io";
import cors from "cors";

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
	cors: {
		origin: "http://localhost:5173", // your frontend origin
		credentials: true,
	},
});

app.use(cors());
app.use(express.json());

app.get("/", (_req, res) => {
	res.send("Server is running!");
});

io.on("connection", (socket) => {
	console.log("Client connected:", socket.id);

	socket.on("join-room", (roomId: string) => {
		socket.join(roomId);
		console.log(`Client ${socket.id} joined room ${roomId}`);
	});

	socket.on("text-changed", (data) => {
		socket.to(data.room).emit("text-update", data.content);
	});

	socket.on("disconnect", () => {
		console.log("Client disconnected:", socket.id);
	});
});

const PORT = 3000;
server.listen(PORT, () => {
	console.log(`Server running on http://localhost:${PORT}`);
});
