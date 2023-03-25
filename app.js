const express = require('express');
const app = express();
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const userRoutes = require('./routes/userRoutes');
const { notFound, errorHandler } = require('./middlewares/errorMiddleware');
const cors = require('cors');

//--------------------------------------------------------------------------------

dotenv.config();
connectDB();

app.use(express.json());
app.use(cors());

//--------------------------------------------------------------------------------

app.use('/api/user', userRoutes);

app.use(notFound);
app.use(errorHandler);











app.listen(1000, () => {
    console.log('Server 1000 running!');
})