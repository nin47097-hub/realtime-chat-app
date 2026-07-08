const { io } = require("socket.io-client");

const socket = io("http://localhost:5000");

socket.on("connect", () => {
    console.log("Connected:", socket.id);

    // Replace this with a real MongoDB user ID
    socket.emit("addUser", "USER_ID_HERE");
});

socket.on("getMessage", (data) => {
    console.log("🔥 New message:", data);
});