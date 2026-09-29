const FriendRequest = require("../models/FriendRequest");

const { getIO, getOnlineUsers } = require("../socket");

const sendfriendrequest = async (req, res) => {
    try {
        const sender = req.user.id;
        const receiver = req.params.userId;

        const existingRequest = await FriendRequest.findOne({
            sender: sender,
            receiver: receiver,
            status: "pending"
        });

        if (existingRequest) {
            return res.status(409).json({
                message: "friend request already exists"
            });
        }
        else if (existingRequest == null) {

            const newrequest = new FriendRequest({
                sender: sender,
                receiver: receiver
            });

            await newrequest.save();

            // Socket.IO
            const io = getIO();
            const OnlineUsers = getOnlineUsers();

            const revieversocketID = OnlineUsers.get(receiver);

            if (revieversocketID) {
                io.to(revieversocketID).emit("friendRequestReceived", {
                    sender: sender,
                    receiver: receiver
                });
            }
        }

        return res.status(201).json({
            message: "sent successfully"
        });

    }
    catch (error) {
        return res.status(500).json({
            message: "Server error",
            error: error.message
        });
    }
};

module.exports = {
    sendfriendrequest
};
