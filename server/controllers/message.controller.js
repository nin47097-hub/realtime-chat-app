const Message = require("../models/Message");
const { getIO, getOnlineUsers } = require("../socket");
const sendMessage = async (req, res) => {
    try {
        const senderId = req.user.id;
        const { receiverId, message } = req.body;
        if (!receiverId || !message) {
            return res.status(400).json({
                message: "receiverId and message are required"
            });
        }
        const newMessage = await Message.create({
            sender: senderId,
            receiver: receiverId,
            message
        });
        const io = getIO();
        const onlineUsers = getOnlineUsers();

        const receiverSocketId = onlineUsers.get(receiverId);

        if (receiverSocketId) {
            io.to(receiverSocketId).emit("getMessage", {
                senderId,
                receiverId,
                message,
                _id: newMessage._id,
                createdAt: newMessage.createdAt
            });
        }
        
        res.status(201).json({
            message: "Message sent successfully",
            data: newMessage
        });
    } catch (error) {
        res.status(500).json({
            message: "Server error",
            error: error.message
        });
    }
};
const getMessages = async (req, res) => {
    try {
        const myId = req.user.id;
        const otherUserId = req.params.userId;

        const messages = await Message.find({
            $or: [
                { sender: myId, receiver: otherUserId },
                { sender: otherUserId, receiver: myId }
            ]
        }).sort({ createdAt: 1 });

        res.status(200).json({
            messages
        });

    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
};

module.exports = {
    sendMessage,
    getMessages
};
