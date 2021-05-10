const express = require('express');
const router = express.Router();

// gọi đến category_models
const category_models = require('./../models/category_models');
const product_models = require('./../models/product_models');

// load thư viện jwt
const jwt = require('jsonwebtoken');
const serect = '#$65$';

// lọc 1 số chức năng

// 1. thêm
router.post('/add', (req, res)=>{
    // khai báo
    var name,parents,content,listProducts, err='', sort, flag=1;
    // lấy dữ liệu
    name=req.body.name;
    parents=req.body.parents;
    content=req.body.content;
    listProducts=req.body.listProducts;
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
        listProducts: listProducts
    }
    // tổng kết
    if(flag==1){
        category_models
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

// 2. sửa
// 3. xóa
// 4. tìm kiếm
// 5. lấy danh mục cha con
router.get('/ParentsChilds', (req, res)=>{
    category_models.aggregate([
        {
            "$lookup": {
                "from": "categories",
                "localField": "name",
                "foreignField": "parents",
                "as": "childs"
            }
        }
    ]).exec(function(err, data){
        if(err){
            res.send({kq:0, err:err});    
        }else{
            res.send({kq:1, data:data});
        }
    });
});

// 6. phân trang

// 7. lấy thông tin từng danh mục (field: _id)
router.get('/inforCateogry/:id', (req, res)=>{
    category_models
    .find({_id: req.params.id})
    .exec((err, data)=>{
        if(err){
            res.send({kq:0, err:err});    
        }else{
            res.send({kq:1, data:data});
        }
    });
});

// 8. lấy tất cả sản phẩm thuộc danh mục
router.get('/allProduct/:nameCategory', (req, res)=>{
    product_models
    .find({parents: req.params.nameCategory})
    .exec((err, data)=>{
        if(err){
            res.send({kq:0, err:err});
        }else{
            res.send({kq:1, data:data});
        }
    });
});

// 9. sản phẩm liên quan
router.get('/relative/:nameCategory/:idProduct', (req, res)=>{
    product_models
    .find({parents: req.params.nameCategory, _id: {"$ne" : req.params.idProduct}})
    .limit(9)
    .skip(0)
    .exec((err, data)=>{
        if(err){
            res.send({kq:0, err:err});
        }else{
            res.send({kq:1, data:data});
        }
    });
});

// 10. lấy thông tin từng danh mục (field: name)
router.get('/inforCateogryName/:name', (req, res)=>{
    category_models
    .find({name: req.params.name})
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