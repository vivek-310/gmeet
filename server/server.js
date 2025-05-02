const express = require('express');
const cors = require('cors');
const app= express();
const http=require('http');
const {Server}=require('socket.io')

app.use(cors());
const server=http.createServer(app);

const io=new Server(server,{
    cors:{
        origin:'*',
        methods:['GET','POST']
    }
})

io.on('connection', (socket) => {
    console.log("connection successful", socket.id);

    socket.on('join-room', (roomId) => {
        socket.join(roomId);
        console.log("joined", socket.id, roomId);
        socket.to(roomId).emit('user-joined', socket.id);
    });

    // 📽️ Handle screen share toggle
    socket.on('screen-share', ({ roomId, isSharing }) => {
        socket.to(roomId).emit('screen-share', {
            userId: socket.id,
            isSharing
        });
    });

    // 🎤 Handle mic toggle
    socket.on('toggle-mic', ({ roomId, isMuted }) => {
        socket.to(roomId).emit('toggle-mic', {
            userId: socket.id,
            isMuted
        });
    });

    // 📷 Handle camera toggle
    socket.on('toggle-camera', ({ roomId, isVideoOff }) => {
        socket.to(roomId).emit('toggle-camera', {
            userId: socket.id,
            isVideoOff
        });
    });

    socket.on('offer', (data) => {
        socket.to(data.target).emit('offer', {
            sdp: data.sdp,
            sender: socket.id,
        });
    });

    socket.on('answer', (data) => {
        socket.to(data.target).emit('answer', {
            sdp: data.sdp,
            sender: socket.id,
        });
    });

    socket.on('ice-candidate', (data) => {
        socket.to(data.target).emit('ice-candidate', {
            candidate: data.candidate,
            sender: socket.id,
        });
    });

    socket.on('disconnect', () => {
        console.log("user disconnected", socket.id);
    });
});






app.get('/',(req,res)=>{
    res.send("hello");
})

server.listen(3000, () => {
    console.log("Server is running on port 3000");
} 
);