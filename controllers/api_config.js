const express = require('express');
const router = express.Router();

// gọi đến config_models
const config_models = require('./../models/config_models');

// 1. thêm
router.post('/add', (req, res)=>{
    // khai báo
    var welcome, title, address, phone, gmail, err='', flag=1;
    // lấy dữ liệu
    welcome=req.body.welcome;
    title=req.body.title;
    address=req.body.address;
    phone=req.body.phone;
    gmail=req.body.gmail;
    // obj_insert
    obj_insert={
        content : {
            welcome: welcome,
            title: title,
            address: address,
            phone: phone,
            gmail: gmail
        }
    };
    // tổng kết
    if(flag==1){
        config_models
        .create(obj_insert, (err, data)=>{
            if(err){
                res.send({kq:0, err:err});
            }else{
                res.send({kq:1, data:data});
            }
        })
    }else{
        res.send({kq:0, err: err});
    }
});

// 2. lấy dữ liệu
router.get('/info', (req, res)=>{
    config_models
    .find({status: 1})
    .exec((err, data)=>{
        if(err){
            res.send({kq:0, err:err});
        }else{
            res.send({kq:1, data:data});
        }
    })
});

// xuất ra sử dụng
module.exports = router;