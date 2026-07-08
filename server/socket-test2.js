const { io } = require("socket.io-client");

const socket = io("http://localhost:5000");

socket.on("connect", () => {
    console.log("User 2 Connected:", socket.id);

    socket.emit("addUser", "6a38d79b57a02955d57572db");
});

socket.on("getMessage", (msg) => {
    console.log("📩 User2 received:", msg);
});
