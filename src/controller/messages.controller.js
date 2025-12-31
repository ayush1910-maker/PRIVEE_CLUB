import Message  from "../models/messages.model.js"
import {io , getReceiverSocketId} from "../socket/socket.js"

const SendMessages = async (req ,res) => {
    try {

        const sender_id = req.user.id
        const {receiver_id , content, message_type} = req.body

        let file_url = null
        let file_meta = {}

        if (req.files && req.files.length > 0) {
            file_url = req.files.map(file => `/uploads/${file.filename}`);
            file_meta = req.files.map(file => ({
                file_name: file.originalname,
                file_size: file.size,
                mime_type: file.mimetype
            }));
        }

        const messageContent = file_url.length > 0 ? file_url.join(" , ") : content;

        const message = await Message.create({
            sender_id,
            receiver_id,
            message_type,
            content: messageContent,
            ...file_meta[0],
            is_read: false
        })

        const receiverSocketId = getReceiverSocketId(receiver_id)

        if (receiverSocketId) {
            io.to(receiverSocketId).emit("newMessage" , message)
            // {
            //     id: message.id,
            //     receiver_id,
            //     sender_id,
            //     content,
            //     is_read: false,
            //     created_at: message.created_at
            // })
        }

        return res.json({
            status: true,
            message: "message sent successfully",
            data: message
        })
        
    } catch (error) {
        return res.json({status: false , message: error.message})
    }
}

const MarkMessageAsRead = async (req ,res) => {
    try {
        // const receiver_id = req.user.id
        const {sender_id , receiver_id} = req.body

        await Message.update(  
            {is_read: true},
            {
                where: {
                    sender_id,
                    receiver_id,
                    is_read: false
                }
            }
        )

        const senderSocketId = getReceiverSocketId(sender_id)

        if (senderSocketId) {
            io.to(senderSocketId).emit("messageRead" ,{
                sender_id,
                receiver_id
            })
        }

        return res.json({
            status: true,
            message: "message Read",
        })
 
    } catch (error) {
        return res.json({status: false , message: error.message})
    }
}

export {
    SendMessages,
    MarkMessageAsRead
}