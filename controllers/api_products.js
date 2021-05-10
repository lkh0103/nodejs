const express = require('express');
const router = express.Router();

// gọi đến product_models
const product_models = require('./../models/product_models');

router.post('/add', (req, res)=>{
    // khai báo
    var name,price,parents,content, err='', flag=1;
    // lấy dữ liệu
    name=req.body.name;
    price=req.body.price;
    parents=req.body.parents;
    content=req.body.content;
    // kiểm tra dữ liệu
    if(name==''){
        err='Tên không được rỗng';
        flag=0;
    }
    if(content==undefined){
        content='';
    }
    // obj_insert
    obj_insert={
        name: name,
        parents: parents,
        content: content,
        price: price
    }
    // tổng kết
    if(flag==1){
        product_models
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

// 7. lấy thông tin từng sản phẩm (field: name)
router.get('/inforProduct/:id', (req, res)=>{
    product_models
    .find({_id: req.params.id})
    .exec((err, data)=>{
        if(err){
            res.send({kq:0, err:err});    
        }else{
            res.send({kq:1, data:data});
        }
    });
});

// 8. cập nhật view
router.get('/update_view/:id', (req, res)=>{
    res.send({_id: req.params.id});
    
    // product_models
    // .updateMany({_id: req.params.id}, {views: req.params.views},(err, data)=>{
    //     if(err){
    //         res.send({kq:0, err:err});    
    //     }else{
    //         res.send({kq:1, data:data});
    //     }
    // });
});

// 9. sản phẩm home
router.get('/newhome', (req, res)=>{
    product_models
    .find()
    .sort({_id: -1})
    .limit(6)
    .skip(1)
    .exec((err, data)=>{
        if(err){
            res.send({kq:0, err:err});    
        }else{
            res.send({kq:1, data:data});
        }
    });
});

// xuất ra sử dụng
module.exports = router;