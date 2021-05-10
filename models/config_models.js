// kết nối mongodb
const mongoose = require('mongoose');

// gọi schema
const schemaConfig = mongoose.Schema({
    content: {
        type: Object,
        require: true,
        unique: true
    },
    status: {
        type: Boolean,
        default: 1
    }
});

// tạo collection
module.exports = mongoose.model('config', schemaConfig);