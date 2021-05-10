// kết nối mongodb
const mongoose = require('mongoose');

// gọi schema
const schemaToken = mongoose.Schema({
    id_user: mongoose.Types.ObjectId,
    token: {
        type: String,
        unique: true,
        require: true
    },
    status: {
        type: Boolean,
        default: 1
    }
});

// tạo collection
module.exports = mongoose.model('token', schemaToken);