import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import api from "../services/api";
import "./Login.css";

function Signup() {

    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const navigate = useNavigate();

    const handleSubmit = async (e) => {

        e.preventDefault();

        try {

            await api.post("/auth/signup", {
                name,
                email,
                password
            });

            toast.success("Account Created Successfully!");

            navigate("/");

        } catch (error) {

            toast.error(
                error.response?.data?.message ||
                "Signup Failed"
            );

        }

    };

    return (

        <div className="login-page">

            <div className="login-card">

                <h1>Create Account</h1>

                <p className="subtitle">
                    Join the conversation today
                </p>

                <form onSubmit={handleSubmit}>

                    <input
                        type="text"
                        placeholder="Full Name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                    />

                    <input
                        type="email"
                        placeholder="Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />

                    <input
                        type="password"
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />

                    <button type="submit">
                        Create Account
                    </button>

                </form>

                <p className="bottom-text">

                    Already have an account?

                    <Link to="/">
                        Login
                    </Link>

                </p>

            </div>

        </div>

    );

}

export default Signup;