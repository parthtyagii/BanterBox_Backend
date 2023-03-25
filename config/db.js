const mongoose = require('mongoose');

const connectDB = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGO_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });
        console.log(`Connect to MongoDB: ${conn.connection.host}`);
    }
    catch (e) {
        console.log(`Error:${e.message}`);
        process.exit();
    }
}

module.exports = connectDB;