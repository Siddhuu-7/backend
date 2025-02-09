const { Server } = require('socket.io');
const Message = require('./models/Message'); // Adjust the path as needed

const socketHandler = (server) => {
  const io = new Server(server, {
    cors: {
      origin: "https://backend-diwr.onrender.com", // Replace with your frontend URL
      methods: ["GET", "POST"],
    },
  });

  io.on("connection", (socket) => {
    console.log("User connected", socket.id);

    socket.on("joinChat", ({ senderId, receiverId }) => {
      const roomId = [senderId, receiverId].sort().join("_");
      socket.join(roomId);
    });

    socket.on("sendMessage", async ({ senderId, receiverId, message }) => {
      const roomId = [senderId, receiverId].sort().join("_");

      try {
        const newMessage = new Message({ senderId, receiverId, message, roomId });
        await newMessage.save();

        io.to(roomId).emit("receiveMessage", newMessage);
      } catch (error) {
        console.error("Error saving message:", error);
      }
    });

    socket.on("disconnect", () => {
      console.log("User disconnected", socket.id);
    });
  });
};

module.exports = socketHandler;
