const express = require('express');
const router = express.Router();

// gọi đến menu_models
const menu_models = require('./../models/menu_models');

// 1. thêm
router.post('/add', (req, res)=>{
    // khai báo
    var name,link,location, err='', flag=1;
    // lấy dữ liệu
    name=req.body.name;
    link=req.body.link;
    location=req.body.location;
    // kiểm tra dữ liệu
    if(name==''){
        err='Tên không được rỗng';
        flag=0;
    }
    if(link==''){
        err='Link không được rỗng';
        flag=0;
    }
    if(location==''){
        err='Location không được rỗng';
        flag=0;
    }
    // obj_insert
    obj_insert={
        name: name,
        link: link,
        location: location
    }
    // tổng kết
    if(flag==1){
        menu_models
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

// 2. lấy menu top
router.get('/menuTop', (req, res)=>{
    menu_models
    .find({location: 'Top'})
    .exec((err, data)=>{
        if(err){
            res.send({kq:0, err:err});
        }else{
            res.send({kq:1, data:data});
        }
    })
});

/*
    collection: configs

    obj={
        welcome: 'Welcome to our...',
        title: 'Mạnh cường...',
        address: '...',
        phone: '...',
        gmail: '...',
        description: '....',
        fanpage: '....',
        copy_right: '...',
        design: ''
    }

    collection: network
*/

// xuất ra sử dụng
module.exports = router;