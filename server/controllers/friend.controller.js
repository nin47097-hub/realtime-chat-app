const FriendRequest = require("../models/FriendRequest");
const { getIO, getOnlineUsers } = require("../socket");
const sendfriendrequest = async(req, res)=>{
    try{
        const sender = req.user.id;

        const receiver = req.params.userId;
        const existingRequest = await FriendRequest.findOne({
            sender : sender,
            receiver : receiver,
            status:"pending"


        })
        if(existingRequest){
            return res.status(409).json({
                message:"friend request alteady exists"
            });

        }
        else if(existingRequest == null){
            const newrequest = new FriendRequest({
                sender: sender,
                receiver: receiver

            })
            await newrequest.save();

        }
        res.status(201).json({
            message:"sent succesfully",
            data:"request"
        })

        

    }
    catch (error) {
        return res.status(500).json({
            message: "Server error",
            error: error.message
        });
    }
    const io = getIO();
    const OnlineUsers = getOnlineUsers();
    const revieversocketID = OnlineUsers.get(receiver)

    if( revieversocketID){
        io.to(revieversocketID).emit("friend request recived",{
            sender:sender,
            receiver:receiver,

        })

        

    }
};

module.exports={
    sendfriendrequest
}
