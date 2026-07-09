import { io } from "socket.io-client";


const socket = io(
    "https://realtime-chat-app-2-cwed.onrender.com"
);

export default socket;