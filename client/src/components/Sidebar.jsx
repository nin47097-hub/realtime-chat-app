import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import socket from "../socket";
import "./Sidebar.css";

function Sidebar({ onSelectUser }) {
    const [users, setUsers] = useState([]);
    const [onlineUsers, setOnlineUsers] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");

    const navigate = useNavigate();

    useEffect(() => {

        socket.on("onlineUsers", (users) => {
            setOnlineUsers(users);
        });

        return () => socket.off("onlineUsers");

    }, []);

    useEffect(() => {

        const fetchUsers = async () => {
            try {
                const res = await api.get("/users");
                setUsers(res.data);
            } catch (err) {
                console.log(err);
            }
        };

        fetchUsers();

    }, []);

    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");

        socket.disconnect();

        navigate("/");
    };

    const filteredUsers = users.filter((user) =>
        user.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="sidebar">

            <h2 className="sidebar-title">
                Chats
            </h2>

            <input
                type="text"
                className="searchinput"
                placeholder="🔍 Search users..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
            />

            <div className="users-container">

                {filteredUsers.length === 0 && (
                    <div className="no-users">
                        No users found.
                    </div>
                )}

                {filteredUsers.map((user) => {

                    const isOnline = onlineUsers.includes(user._id);

                    return (

                        <div
                            key={user._id}
                            className="user-card"
                            onClick={() => onSelectUser(user)}
                        >

                            <div className="user-header">

                                <div className="avatar">
                                    {user.name.charAt(0).toUpperCase()}
                                </div>

                                <div className="user-info">

                                    <div className="name-row">

                                        <p className="user-name">
                                            {user.name}
                                        </p>

                                        <span
                                            className={
                                                isOnline
                                                    ? "status online"
                                                    : "status offline"
                                            }
                                        ></span>

                                    </div>

                                    <p className="user-email">
                                        {user.email}
                                    </p>

                                    <small
                                        className={
                                            isOnline
                                                ? "online-text"
                                                : "offline-text"
                                        }
                                    >
                                        {isOnline ? "Online" : "Offline"}
                                    </small>

                                </div>

                            </div>

                        </div>

                    );

                })}

            </div>

            <button
                className="logout-btn"
                onClick={handleLogout}
            >
                Logout
            </button>

        </div>
    );
}

export default Sidebar;
