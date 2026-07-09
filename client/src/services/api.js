import axios from "axios";

const api = axios.create({
    baseURL: "https://realtime-chat-app-2-cwed.onrender.com/api"
});

export default api;