import { Server } from "socket.io";
import Messages from "../models/messages.model.js";

let io; 
const userSocketMap = new Map(); 

export const initSocket = (server) => {

  io = new Server(server, {
    cors: {
      origin: "*",
      methods: ["GET", "POST"]
    }
  });

  io.on("connection", (socket) => {
    
    const userId = socket.handshake.query.userId;

    console.log("User Connected: ", socket.id);

    socket.on("join_chat" , async ({sender_id , receiver_id}) => {
        try {
        const roomId =
          Number(sender_id) < Number(receiver_id)
            ? `${sender_id}_${receiver_id}`
            : `${receiver_id}_${sender_id}`;

        socket.join(roomId);

        const messages = await Messages.findAll({
          where: {
            [Op.or]: [
              { sender_id, receiver_id },
              { sender_id: receiver_id, receiver_id: sender_id },
            ],
          },
          order: [["createdAt", "ASC"]],
        });

        socket.emit("chat_history", messages);

        await Messages.update(
          { is_read: true },
          {
            where: {
              sender_id: receiver_id,
              receiver_id: sender_id,
              is_read: false,
            },
          }
        );

        const receiverSocketId = userSocketMap.get(String(receiver_id));
        if (receiverSocketId) {
          io.to(receiverSocketId).emit("user_joined", { userId: sender_id });
        }
            
        } catch (error) {
            socket.emit("message_error", {
                error: "Message sending failed",
            });
        }
    })
    
    userSocketMap.set(String(userId), socket.id);
    
    io.emit("getOnlineUsers", Array.from(userSocketMap.keys()));

    socket.on("send_message", async ({ sender_id, receiver_id, content }) => {
        try {
            const message = await Messages.create({
                sender_id,
                receiver_id,
                content,
                is_read: false,
            });

            socket.emit("message_received", {
                id: message.id,
                sender_id,
                receiver_id,
                content,
                created_at: message.created_at,
            });

        } catch (error) {
            console.error("Message send error:", error);
            socket.emit("message_error", {
            error: "Message sending failed",
        });
    }
    });


    socket.on("typing", ({ senderId, receiverId }) => {
      const receiverSocketId = userSocketMap.get(String(receiverId));
      if (receiverSocketId) {
        io.to(receiverSocketId).emit("userTyping", senderId);
      }
    });

    socket.on("disconnect", () => {
      userSocketMap.delete(String(userId));

      io.emit("getOnlineUsers", Array.from(userSocketMap.keys()));
    });
  });

  return io;
};


export const getReceiverSocketId = (receiverId) => {
  return userSocketMap.get(String(receiverId));
};