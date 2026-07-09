const dns = require("node:dns");
dns.setServers(["1.1.1.1", "8.8.8.8"]);
const cors = require("cors");
const userRoutes = require("./routes/user.routes");

const{setIO, getOnlineUsers}= require("./socket");
const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const http = require("http");
const { Server } = require("socket.io");

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());



const server = http.createServer(app);


const io = new Server(server, {
    cors: {
        origin: "*"
    }
});
setIO(io);

const onlineUsers = getOnlineUsers();


io.on("connection", (socket) => {
    setTimeout(() => {
    socket.emit("getMessage", {
        senderId: "USER_2",
        message: "Hello from server test 🚀"
    });
}, 5000);
    console.log("User connected:", socket.id);

    socket.on("addUser", (userId) => {

       
        console.log("User registered:", userId);
        console.log("Socket ID:", socket.id);
        onlineUsers.set(userId, socket.id);
        io.emit("onlineUsers",[...onlineUsers.keys()]);
    });

    socket.on("sendMessage", ({ senderId, receiverId, message }) => {

        const receiverSocketId = onlineUsers.get(receiverId);

        if (receiverSocketId) {
            io.to(receiverSocketId).emit("getMessage", {
                senderId,
                message
            });
        }
    });

    socket.on("disconnect", () => {
        console.log("User disconnected:", socket.id);

        for (let [userId, socketId] of onlineUsers) {
            if (socketId === socket.id) {
                onlineUsers.delete(userId);
                io.emit("onlineUsers",[...onlineUsers.keys()]);
                break;
            }
        }
    });
});


const authRoutes = require("./routes/authRouters");
const messageRoutes = require("./routes/message.routes");

app.use("/api/auth", authRoutes);
app.use("/api/messages", messageRoutes);
app.use("/api/users", userRoutes);

mongoose.connect(process.env.MONGO_URI)
    .then(() => {
        console.log("MongoDB Connected");

        server.listen(process.env.PORT || 5000, () => {
            console.log("Server running on port 5000");
        });
    })
    .catch((err) => {
        console.log("DB connection error:", err);
    });