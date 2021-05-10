const express = require('express');
const router = express.Router();

// gọi đến product_models
const product_models = require('./../models/product_models');


router.get('/index', (req, res)=>{
    // lấy link
    var link = req.originalUrl;
    // main
    var main = 'products/main_product';
    // table
    var table='';

    res.render('index', {main: main, link: link, table: table}); // {key: value}
});

// xuất ra sử dụng
module.exports = router;