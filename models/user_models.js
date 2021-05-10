// kết nối mongodb
const mongoose = require('mongoose');

// gọi schema
const schemaUser = mongoose.Schema({
    name: String,
    username: {
        type: String,
        unique: true,
        require: true
    },
    password: {
        type: String,
        require: true
    },
    email: {
        type: String,
        unique: true,
        require: true
    },
    role: Array,
    active: {
        type: Boolean,
        default: 0
    },
    trash: {
        type: Boolean,
        default: 0
    }
});

// tạo collection
module.exports = mongoose.model('user', schemaUser);