import { useEffect, useState, useRef } from "react";
import api from "../services/api";
import MessageInput from "./MessageInput";
import socket from "../socket";
import "./ChatWindow.css";

function ChatWindow({ selectedUser, onBack }) {

    const [messages, setMessages] = useState([]);
    const [onlineUsers, setOnlineUsers] = useState([]);
    const [selectedMessage, setSelectedMessage]= useState(null);

    const chatRef = useRef(null);

    const currentUser = JSON.parse(localStorage.getItem("user"));

    const isOnline =
        selectedUser &&
        onlineUsers.includes(selectedUser._id);

    const fetchMessages = async () => {

        if (!selectedUser) {
            setMessages([]);
            return;
        }

        try {

            const token = localStorage.getItem("token");

            const response = await api.get(
                `/messages/${selectedUser._id}`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            setMessages(response.data.messages);

        } catch (error) {

            console.log(error);

        }

    };
//delete messages
    const deletemessages = async(messageId)=>{
        try{
            const token = localStorage.getItem("token");
            const response = await api.delete(`/messages/${messageId}`,{
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            setMessages((prev)=>{
                return prev.filter((msg)=> msg._id!==messageId);
            })

        }
        catch(error){
            console.log(error);

        }


    }

    useEffect(() => {
        fetchMessages();
    }, [selectedUser]);

    useEffect(() => {

        if (chatRef.current) {

            chatRef.current.scrollTop =
                chatRef.current.scrollHeight;

        }

    }, [messages]);


    useEffect(() => {

        socket.on("onlineUsers", (users) => {

            setOnlineUsers(users);

        });

        return () => {

            socket.off("onlineUsers");

        };

    }, []);

  
    useEffect(() => {

        socket.on("getMessage", (data) => {

            if (
                data.senderId === selectedUser?._id ||
                data.receiverId === selectedUser?._id
            ) {

                setMessages((prev) => [...prev, data]);

            }

        });
        socket.on("messageDeleted", (data)=>{
            setMessages((prev)=>{
                return prev.filter((msg)=>{
                    return msg._id !== data.messageId;
                })

            })

            

        });

        return () => {
            
            socket.off("getMessage");
            socket.off("messageDeleted");

        };

        

    }, [selectedUser]);

    return (

        <div className="chat-window">

            {selectedUser ? (

                <>

                    <div className="chat-header">

                        <button
                            className="back-btn"
                            onClick={onBack}
                        >
                            ←
                        </button>

                        <div className="chat-user">

                            <div className="avatar">
                                {selectedUser.name
                                    .charAt(0)
                                    .toUpperCase()}
                            </div>

                            <div>

                                <h2>{selectedUser.name}</h2>

                                <p className="status-text">
                                    {isOnline
                                        ? "🟢 Online"
                                        : "⚪ Offline"}
                                </p>

                            </div>

                        </div>

                    </div>

                    <div
                        ref={chatRef}
                        className="messages-container"
                    >

                        {messages.map((msg) => {

                            const isMyMessage =
                                msg.sender === currentUser.id;

                            const time = new Date(
                                msg.createdAt
                            ).toLocaleTimeString([], {
                                hour: "2-digit",
                                minute: "2-digit"
                            });

                            return (

                                <div
                                    key={msg._id}
                                    className={
                                        isMyMessage
                                            ? "message-row mine"
                                            : "message-row other"
                                    }
                                    onClick={()=> setSelectedMessage(msg._id)}
                                >
                                    {selectedMessage ===msg._id && isMyMessage &&(
                                        <button onClick={()=> deletemessages(msg._id)}>
                                            Delete

                                        </button>
                                    )}

                                    <div
                                        className={
                                            isMyMessage
                                                ? "message mine-message"
                                                : "message other-message"
                                        }
                                    >

                                        <div className="message-text">
                                            {msg.message}
                                        </div>

                                        <div className="message-time">
                                            {time}
                                        </div>

                                    </div>

                                </div>

                            );

                        })}

                    </div>

                    <MessageInput
                        selectedUser={selectedUser}
                        onMessageSent={fetchMessages}
                    />

                </>

            ) : (

                <div className="no-chat">

                    <h2>No Conversation Selected</h2>

                    <p>
                        Select a user from the sidebar to start chatting.
                    </p>

                </div>

            )}

        </div>

    );

}

export default ChatWindow;
