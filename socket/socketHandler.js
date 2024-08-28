const userSocketMap = {};

export const socketHandler = (io) => {
  io.on('connection', (socket) => {
    // When a user connects, assign their MongoDB _id to the socket.id
    socket.on('assignUserId', (userId) => {
      userSocketMap[userId] = socket.id;
      // console.log(`User ${userId} connected with socket id ${socket.id}`);
    });

  
    socket.on('sendMessagePersonal', ({ receiverId, message, senderId }) => {
      const receiverSocketId = userSocketMap[receiverId];

      if (receiverSocketId) {

        io.to(receiverSocketId).emit("sendMessageReceiver", {
          message,
          senderId,
        });
        // console.log(`Message sent from ${senderId} to ${receiverId}: ${message}`);
      } else {
        console.log(`User ${receiverId} is not connected.`);
        // Optionally, handle the case where the receiver is not connected
      }
    });

    // Handle disconnection
    socket.on('disconnect', () => {
      // console.log('User disconnected:', socket.id);
      // Remove the user from the userSocketMap
      for (const [userId, socketId] of Object.entries(userSocketMap)) {
        if (socketId === socket.id) {
          delete userSocketMap[userId];
          // console.log(`User ${userId} with socket id ${socket.id} removed from userSocketMap`);
          break;
        }
      }
    });
  });
};
