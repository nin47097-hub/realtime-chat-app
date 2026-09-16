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


const delete_message =async(req,res)=>{
    try{
        const message_id = req.params.messageId;
        const userId = req.user.id;

        const message = await Message.findById(message_id);
        if(!message){
            return res.status(404).json({
                message:"message not found"
        });
        }

        if(message.sender.toString()!== userId){
            return res.status(403).json({
                message:"not your message"
            });
        }

        await Message.findByIdAndDelete(message._id);


        const io = getIO();
        const onlieusers = getOnlineUsers();
        const reciever_socket = onlieusers.get(message.receiver.toString());

        if(reciever_socket){
            io.to(reciever_socket).emit("messageDeleted",{
                messageId:message_id
            });

        }

        return res.status(200).json({
            message:"message deleted"
        });
    }catch(error){
        return res.status(500).json({
            message:"server error"
        });

    }
}

module.exports = {
    sendMessage,
    getMessages,
    delete_message
};

