const express = require('express');
const app = express();
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const userRoutes = require('./routes/userRoutes');
const chatRoutes = require('./routes/chatRoutes');
const messageRoutes = require('./routes/messageRoutes');
const { notFound, errorHandler } = require('./middlewares/errorMiddleware');
const cors = require('cors');

//--------------------------------------------------------------------------------

dotenv.config();
connectDB();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

//--------------------------------------------------------------------------------

app.use('/api/user', userRoutes);
app.use('/api/chat', chatRoutes);
app.use('/api/message', messageRoutes);

app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 1000;

const server = app.listen(PORT, () => {
    console.log('Server 1000 running!');
})

const io = require('socket.io')(server, {
    pingTimeout: 60000,
    cors: {
        origin: 'https://banterbox.netlify.app',
    }
});

io.on('connection', (socket) => {

    socket.on('setup', (userData) => {
        socket.join(userData._id);
        socket.emit('connected');
    });

    socket.on('join chat', (room) => {
        socket.join(room);
    });

    socket.on('typing', (room) => socket.in(room).emit("typing"));
    socket.on('stop typing', (room) => socket.in(room).emit("stop typing"));

    socket.on('new message', (newMessageReceived) => {
        let chat = newMessageReceived.chat;

        if (!chat.users) {
            return console.log('chat.users not defined!');
        }

        chat.users.forEach((user) => {
            if (user._id === newMessageReceived.sender._id) {
                return;
            }
            else {
                socket.broadcast.to(user._id).emit('message received', newMessageReceived);
            }
        })

    })

});
