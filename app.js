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

const server = app.listen(1000, () => {
    console.log('Server 1000 running!');
})

const io = require('socket.io')(server, {
    pingTimeout: 60000,
    cors: {
        origin: 'http://localhost:3000',
    }
});

io.on('connection', (socket) => {
    // console.log('connected to socket io');

    socket.on('setup', (userData) => {
        socket.join(userData._id);
        socket.emit('connected');
    });

    socket.on('join chat', (room) => {
        socket.join(room);
        // console.log('Joined room:', room);
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
                socket.in(user._id).emit('message received', newMessageReceived);
            }
        })

    })

});
