const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    pic: {
        type: String,
        default: 'https://res.cloudinary.com/dw0up71e2/image/upload/v1675568191/profileImages/yaymwg5brzhvc5ww1pnb.webp'
    },
}, { timestamps: true });

userSchema.methods.matchPassword = async function (enteredPassword) {
    return (bcrypt.compareSync(enteredPassword, this.password));
};

userSchema.pre('save', async function (next) {
    if (!this.modified) {
        next();
    }

    const salt = bcrypt.genSaltSync(10);
    this.password = bcrypt.hashSync(this.password, salt);
});


const User = mongoose.model('User', userSchema);

module.exports = User;