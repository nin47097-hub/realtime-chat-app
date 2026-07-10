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
            console.log("Online:", users);
            setOnlineUsers(users);
        });

        return () => {
            socket.off("onlineUsers");
        };

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
        user.name
            .toLowerCase()
            .includes(searchTerm.toLowerCase())
    );

    return (

        <div className="sidebar">

            <div className="users-container">

                <h2 className="sidebar-title">
                    Users
                </h2>

                <input
                    type="text"
                    className="searchinput"
                    placeholder="Search users..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />

                {filteredUsers.map((user) => {

                    const isOnline = onlineUsers.includes(user._id);

                    return (

                        <div
                            key={user._id}
                            onClick={() => onSelectUser(user)}
                            className="user-card"
                        >

                            <div className="user-header">

                                <span
                                    className={
                                        isOnline
                                            ? "status online"
                                            : "status offline"
                                    }
                                ></span>

                                <p className="user-name">
                                    {user.name}
                                </p>

                            </div>

                            <small className="user-email">
                                {user.email}
                            </small>

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
