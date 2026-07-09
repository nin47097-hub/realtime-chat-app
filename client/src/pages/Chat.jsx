import { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import ChatWindow from "../components/ChatWindow";
import socket from "../socket";
import "./Chat.css";

function Chat() {

    const [selectedUser, setSelectedUser] = useState(null);
    const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

    // Detect screen size
    useEffect(() => {

        const handleResize = () => {
            setIsMobile(window.innerWidth <= 768);
        };

        window.addEventListener("resize", handleResize);

        return () => {
            window.removeEventListener("resize", handleResize);
        };

    }, []);

    // Register user with Socket.IO
    useEffect(() => {

        const user = JSON.parse(localStorage.getItem("user"));

        if (user) {
            socket.emit("addUser", user.id);
            console.log("Connected as:", user.id);
        }

    }, []);

    return (

        <div className="chat-page">

            {(!isMobile || !selectedUser) && (

                <Sidebar
                    onSelectUser={setSelectedUser}
                />

            )}

            {(!isMobile || selectedUser) && (

                <ChatWindow
                    selectedUser={selectedUser}
                    onBack={()=> setSelectedUser(null)}
                />

            )}

        </div>

    );

}

export default Chat;