// kết nối mongodb
const mongoose = require('mongoose');

// gọi schema
const schemaProduct = mongoose.Schema({
    id_user: mongoose.Types.ObjectId,
    name: {
        type: String,
        require: true,
        unique: true
    },
    price: {
        type: Number,
        default: 0
    },
    parents: Array,
    content: String,
    views: {
        type: Number,
        default: 0
    },
    status: {
        type: Boolean,
        default: 0
    },
    trash: {
        type: Boolean,
        default: 0
    }
});

// tạo collection
module.exports = mongoose.model('product', schemaProduct);