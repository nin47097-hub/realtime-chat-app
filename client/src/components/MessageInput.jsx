import { useState } from "react";
import api from "../services/api";
import "./MessageInput.css";

function MessageInput({ selectedUser, onMessageSent }) {

    const [message, setMessage] = useState("");

    const handleSend = async () => {

        if (!message.trim()) return;
        if (!selectedUser) return;

        try {

            const token = localStorage.getItem("token");

            await api.post(
                "/messages/send",
                {
                    receiverId: selectedUser._id,
                    message: message
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            setMessage("");

            if (onMessageSent) {
                onMessageSent();
            }

        } catch (error) {
            console.log(error);
        }

    };

    return (

        <div className="message-input-container">

            <input
                className="message-input"
                type="text"
                placeholder="Type a message..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyDown={(e) => {
                    if (e.key === "Enter") {
                        handleSend();
                    }
                }}
            />

            <button
                className="send-btn"
                onClick={handleSend}
            >
                ➤
            </button>

        </div>

    );

}

export default MessageInput;