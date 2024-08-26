// socket/socketHandler.js

export const socketHandler = (io) => {
  io.on('connection', (socket) => {
    console.log('A user connected:', socket.id);

    // Handle custom events
    socket.on('addUser', (data) => {
      console.log('AddUser data:', data);
      // Handle user addition logic here
    });

    socket.emit('test', { data: "" });

    socket.on('message', (data) => {
      console.log('Message received:', data);
      // Broadcast message to all connected clients
      io.emit('message', data);
    });

    // Handle disconnection
    socket.on('disconnect', () => {
      console.log('User disconnected:', socket.id);
    });
  });
};
