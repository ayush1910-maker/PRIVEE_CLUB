import { Server } from "socket.io";
import Messages from "../models/messages.model.js";
import { Op, Sequelize } from "sequelize";

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

        console.log("join_chat event received", sender_id, receiver_id);

        const messages = await Messages.findAll({
          where: {
            [Op.or]: [
              { sender_id, receiver_id },
              { sender_id: receiver_id, receiver_id: sender_id },
            ],
          },
          order: [["created_at", "ASC"]],
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
          console.log(error);
          
            socket.emit("message_error", {
                error: "Message sending failed",
            });
        }
    })

    socket.on("fetch_senders" , async ({receiver_id}) => {
      try {

        const senders = await Messages.findAll({
          attributes: [
            [Sequelize.fn("DISTINCT" , Sequelize.col("sender_id")) , "sender_id"]
          ],
          where: { receiver_id },
        })

        const SenderIds = senders.map((s) => s.sender_id)

        const SenderStatus = SenderIds.map((id) => ({
          userId: id,
          online: userSocketMap.has(String(id))
        }))

        socket.emit("sender_list" , SenderStatus)
        
      } catch (error) {
        socket.emit("message_error" , {
          error: "Message sending failed"
        });
      }
    })
    
    userSocketMap.set(String(userId), socket.id);    
    io.emit("getOnlineUsers", Array.from(userSocketMap.keys()));
    console.log("User Socket Map:", userSocketMap);


    // send message events
    socket.on("send_message", async ({
      sender_id,
      receiver_id,
      content = null,
      file_url = null,
      file_name = null,
      file_size = null,
      message_type = "text"
     }) => {
        try {
            const message = await Messages.create({
                sender_id,
                receiver_id,
                content,
                file_url: file_url || null,
                file_name: file_name || null,
                file_size: file_size || null,
                message_type: message_type || "text",
                is_read: false,
            });

            const payload =  {
                id: message.id,
                sender_id,
                receiver_id,
                content,
                file_url,
                file_name,
                file_size,
                message_type,
                created_at: message.created_at,
            }

            const receiverSocketId = userSocketMap.get(String(receiver_id))
            console.log("Receiver Socket ID:", receiverSocketId);

            if (receiverSocketId) {
              io.to(receiverSocketId).emit("message_received", payload);
            }

            // io.emit("message_received" , payload)

        } catch (error) {
          console.error("Message send error:", error);

          socket.emit("message_error", {
            error: "Message sending failed",
          });
    }
    });


    // typing event 
    socket.on("typing", ({ senderId, receiverId }) => {
      const receiverSocketId = userSocketMap.get(String(receiverId));
      if (receiverSocketId) {
        io.to(receiverSocketId).emit("userTyping", { senderId });
      }
    });


    //  disconnect event
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