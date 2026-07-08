const { io } = require("socket.io-client");

const socket = io("http://localhost:5000");

socket.on("connect", () => {
    console.log("User 1 Connected:", socket.id);

    socket.emit("addUser", "6a38d70557a02955d57572da");
});

socket.on("getMessage", (msg) => {
    console.log("📩 User1 received:", msg);
});