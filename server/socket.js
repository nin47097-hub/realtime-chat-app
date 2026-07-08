let io;

const setIO = (socketIO) => {
    io = socketIO;
};

const getIO = () => {
    return io;
};

const onlineUsers = new Map();

const getOnlineUsers = () => {
    return onlineUsers;
};

module.exports = {
    setIO,
    getIO,
    getOnlineUsers
};