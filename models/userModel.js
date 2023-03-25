const mongoose = require('mongoose');

const userModel = mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    pic: {
        type: String,
        required: true,
        default: 'https://res.cloudinary.com/dw0up71e2/image/upload/v1675568191/profileImages/yaymwg5brzhvc5ww1pnb.webp'
    },
}, { timestamps: true });


const User = mongoose.model('User', userSchema);

module.exports = User;