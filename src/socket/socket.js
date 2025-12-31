import { Server } from "socket.io";
import http from "http"
import express from "express"

const app = express()

const server = http.createServer(app)

const io = new Server(server , {
    cors: {
        origin: [],
        methods:["GET" , "POST"]
    }
})
// socket.io server start kra
// cors allow kre

export const getReceiverSocketId = (receiverId) => {
    return userSocketmap[receiverId]
}
//Agar kisi specific user ko message bhejna ho
//Uska socketId yaha se milega 

const userSocketmap = {}
//Ye object userId → socketId ka record store karega

io.on('connection' , (socket)=>{
    const userId = socket.handshake.query.userId;
    // url 

    if (userId !== "undefine") {
        userSocketmap[userId] = socket.id
    }
    // agar user valid hoga to uska userId store kar dega


    io.emit("getOnlineUsers" , Object.keys(userSocketmap))
    // sab connected user ko btayaga kon kon user online hai
    // emit -> send event to all connected sockets

    socket.on("typing" , ({senderId , receiverId}) => {
        io.to(getReceiverSocketId(receiverId)).emit("userTyping" , senderId)
    })

    socket.on('disconnect' , () => {

        delete userSocketmap[userId],
        // if user disconnect remove its userId. 

        io.emit("getOnlineUsers" , Object.keys(userSocketmap))
        // sab connected user ko btayage kon kon user online hai

    })
})

export {io , app , server}