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

    // Correctly listen to 'join-room' event
    socket.on('join-room', (roomId) => {
        socket.join(roomId);
        console.log("joined", socket.id, roomId);
        socket.to(roomId).emit('user-joined', socket.id);
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