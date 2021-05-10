const express = require('express');
const router = express.Router();

// gọi models user
const user_models = require('./../models/user_models');

// gọi models token
const token_models = require('./../models/token_models');

// gọi bcrypt
const bcrypt = require('bcrypt');

// gọi jsonwebtoken
const jwt = require('jsonwebtoken');
const serect = '#$65$';

// Gọi localstorage
var LocalStorage = require('node-localstorage').LocalStorage;
localStorage = new LocalStorage('./scratch');

router.get('/login/index', (req, res)=>{
    res.render('users/login');
});

router.post('/processLogin', (req, res)=>{
    // khai báo
    var username, password, err='', flag=1;
    // lấy dữ liệu
    username=req.body.username;
    password=req.body.password;
    // kiểm tra dữ liệu

    // 1. kiểm tra username có tồn tại trong database
    // => 1.1: Nếu không có thì báo ra là không tồn tại username
    // => 1.2: Ngược lại thì lấy được thông tin user
    // =>=>=> Lấy được hash

    if(flag==1){
        // kết nối mongodb
        user_models
        .find({username:username}, (err,dataUsername)=>{
            if(err){
                res.send({kq:0, err:err});
            }else{
                // kiểm tra username có tồn tại không
                if(dataUsername!=''){
                    //res.send(dataUsername);
                    bcrypt.compare(password, dataUsername[0].password, function(err, result) {
                        // 1. Nếu false thì báo là mật khẩu không chính xác
                        // 2. Ngược lại: true thì là đăng nhập thành công
                        // 3. Sử dụng thư viện JWT, tạo token, lưu token vào database
                        if(result==true){
                            // thực hiện tiếp
                            //res.send({kq:1, data:result});

                            // tạo token
                            // tên đăng nhập, email, role, thông tin thiết bị

                            // collection token
                            // id_user
                            // token
                            // date
                            // status

                            // chỉ cho 1 tài khoản login
                            // lần đăng nhập sau cùng thì status=1
                            // tất cả các lần đăng nhập trước status=0

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
                                    res.send({kq:1, message: 'Đăng nhập thành công'});
                                    // lưu lại bằng localstorage
                                    localStorage.setItem('token', token);

                                    // lưu lại token
                                    var obj_token={
                                        id_user: dataUsername[0]._id,
                                        token: token
                                    }

                                    token_models.create(obj_token, (err, dataToken)=>{
                                        if(err){
                                            res.send({kq:0, err:err});
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
    }

});

// test middleware
// class Admin{
//     checkLogin(req, res, next){
//         // kiểm tra đăng nhập
//         var i=0;
    
//         if(i==1){
//             next();
//         }else{
//             res.send('Chưa qua được');
//         }
//     }
// }
// var kq=new Admin();
// function checkLogin(req, res, next){
//     // kiểm tra đăng nhập
//     var i=0;

//     if(i==1){
//         next();
//     }else{
//         res.send('Chưa qua được');
//     }
// }
// router.get('/middleware', kq.checkLogin, (req, res)=>{
//     res.send('hello');
// });


// xuất ra sử dụng
module.exports = router;