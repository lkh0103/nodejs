// kết nối mongodb
const mongoose = require('mongoose');

// gọi schema
const schemaMenu = mongoose.Schema({
    id_user: mongoose.Types.ObjectId,
    name: {
        type: String,
        require: true,
        unique: true
    },
    link: String,
    location: String,
    sort: String,
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
module.exports = mongoose.model('menu', schemaMenu);