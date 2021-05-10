const express = require('express');
const router = express.Router();

router.get('/index', (req, res)=>{

    // lấy link
    var link = req.originalUrl;

    // main
    var main = 'partials/dashboard';

    res.render('index', {main: main, link: link}); // {key: value}
});

// xuất ra sử dụng
module.exports = router;