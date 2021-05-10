const express = require('express');
const router = express.Router();

// gọi models user
const user_models = require('./../models/user_models');

// gọi models token
const token_models = require('./../models/token_models');

// gọi bcrypt
const bcrypt = require('bcrypt');
const saltRounds = 10;

// gọi jsonwebtoken
const jwt = require('jsonwebtoken');
const serect = '#$65$';

// 1. đăng ký
router.post('/register', (req, res)=>{
    // khai báo
    var name, username, password, email, err, flag=1;
    // lấy dữ liệu
    name = req.body.name;
    username = req.body.username;
    password = req.body.password;
    email = req.body.email;
    // kiểm tra dữ liệu
    if(name == ''){
        flag = 0;
        err = 'Tên không được rỗng';
    }
    if(username == ''){
        flag = 0;
        err = 'Tên Đăng Nhập không được rỗng';
    }
    if(password == ''){
        flag = 0;
        err = 'Mật Khẩu không được rỗng';
    }
    if(email == ''){
        flag = 0;
        err = 'Email không được rỗng';
    }
    // kết quả
    if(flag == 1){
        // kết nối mongodb
        user_models
        .find({username:username}, (err, dataUsername)=>{
            if(err){
                res.send({kq:0, err:err});
            }else{
                // kiểm tra username có tồn tại không
                if(dataUsername==''){
                    // kiểm tra email
                    user_models
                    .find({email:email}, (err, dataEmail)=>{
                        if(err){
                            res.send({kq:0, err:err});
                        }else{
                            // kiểm tra email có tồn tại không
                            if(dataEmail==''){
                                // tiếp tục mã hóa password
                                // băm password
                                bcrypt.genSalt(saltRounds, function(err, salt){
                                    bcrypt.hash(password, salt, function(err, hash){
                                        if(err){
                                            res.send({kq:0, err:err});
                                        }else{
                                            const obj_data={
                                                username: username,
                                                password: hash,
                                                email: email,
                                                role: 'Api_Register'
                                            };
                                            user_models
                                            .create(obj_data, (err, dataCreate)=>{
                                                if(err){
                                                    res.send({kq:0, err:err});
                                                }else{
                                                    res.send({kq:1, data:dataCreate});
                                                }
                                            });
                                        }
                                    });
                                });
                            }else{
                                res.send({kq:0, err:'Email này đã tồn tại'});            
                            }
                        }
                    })
                }else{
                    res.send({kq:0, err:'Tên đăng nhập này đã tồn tại'});
                }
            }
        });
    }else{
        res.send({kq:0, err:err});
    }
});

// 2. đăng nhập
router.post('/login', (req, res)=>{
    // khai báo
    var username, password, err='', flag=1;
    // lấy dữ liệu
    username=req.body.username;
    password=req.body.password;
    // kiểm tra dữ liệu
    if(username == ''){
        flag = 0;
        err = 'Tên Đăng Nhập không được rỗng';
    }
    if(password == ''){
        flag = 0;
        err = 'Mật Khẩu không được rỗng';
    }
    // kết quả
    if(flag==1){
        // kết nối mongodb
        user_models
        .find({username:username}, (err, dataUsername)=>{
            if(err){
                res.send({kq:0, err:err});
            }else{
                // kiểm tra username có tồn tại không
                if(dataUsername!=''){
                    bcrypt.compare(password, dataUsername[0].password, function(err, result) {
                        if(result==true){
                            var payload={
                                'username': dataUsername[0].username,
                                'email': dataUsername[0].email,
                                'role': dataUsername[0].role,
                                'device': req.headers
                            };
                            jwt.sign(payload, serect, {expiresIn: 60}, (err, token)=>{
                                if(err){
                                    res.send({kq:0, err:err});
                                }else{
                                    // lưu lại token
                                    var obj_token={
                                        id_user: dataUsername[0]._id,
                                        token: token
                                    }
                                    token_models.create(obj_token, (err)=>{
                                        if(err){
                                            res.send({kq:0, err:err});
                                        }else{
                                            res.send({kq:1, token:token});
                                        }
                                    });
                                }
                            }); // 60s

                        }else{
                            res.send({kq:0, err:'Mật khẩu không chính xác'});
                        }
                    });
                }else{
                    res.send({kq:0, err:'Tên đăng nhập không tồn tại'});
                }
            }
        });
    }else{
        res.send({kq:0, err:err});
    }
})

// 3. đăng xuất
router.get('/logout/:id', (req, res)=>{
    var id = req.params.id;
    token_models
    .updateMany({id_user: id}, {status: false}, (err, data)=>{
        if(err){
            res.send({kq:0, err:err});
        }else{
            if(data==''){
                res.send({kq:0, err:'Tên đăng nhập không tồn tại'});
            }else{
                res.send({kq:1, message: 'Đăng xuất thành công'});
            }
        }
    });
});

// 4. kích hoạt
router.get('/active/:id', (req, res)=>{
    var id = req.params.id;
    user_models
    .updateMany({_id: id}, {active: true}, (err, data)=>{
        if(err){
            res.send({kq:0, err:err});
        }else{
            if(data==''){
                res.send({kq:0, err:'Tên đăng nhập không tồn tại'});
            }else{
                res.send({kq:1, message: 'Kích hoạt thành công'});
            }
        }
    });
});

// 5. lấy thông tin thành viên
// 6. xóa thành viên
// 7. xóa vĩnh viễn

// xuất ra sử dụng
module.exports = router;