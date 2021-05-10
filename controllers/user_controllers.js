const express = require('express');
const router = express.Router();

// gọi đến user_models
const user_models = require('./../models/user_models');

router.get('/index(/:page)?', async (req, res)=>{    
    // số trang
    const page=req.params.page;

    // lấy tổng số dữ liệu
    const objData = await user_models.find();
    sumData = objData.length;

    // giới hạn trên 1 trang
    const limit=2;

    // tổng số trang
    const sumPage=Math.ceil(sumData/limit);

    // vị trí bắt đầu trong db
    const skip = (page-1) * limit;

    user_models
    .find()
    .limit(limit)
    .skip(skip)
    .sort({_id: -1})
    .exec(function(err, data){
        if(err){
            res.send({kq:0, err:err});    
        }else{
            var table='';
            var i=0;
            data.forEach(e => {
                // cha
                i++;
                table += `<tr id="vl_d`+e._id+`">
                    <td>`+i+`</td>
                    <td><button type="button" class="btn btn-info">
                    <i class="fa fa-upload" aria-hidden="true"></i> Uploads</button></td>
                    <td>`+e.username+`</td>
                    <td><input type="checkbox" onclick="status('`+e._id+`')"></td>
                    <td>
                        <a href="user/edit/`+e._id+`" class="btn btn-info">
                            <i class="fa fa-pencil-alt"></i>
                            Sửa
                        </a>
                        <button type="button" class="btn btn-danger" 
                        onclick="popup_delete('`+e._id+`','`+e.name+`')" 
                        data-toggle="modal" data-target="#myModal">
                            <i class="fa fa-trash"></i>
                            Xóa
                        </button>
                    </td>
                </tr>`;
            });
            
            // phân trang

            // nhảy về đầu
            var pagination=`<li class="page-item disabled">
            <a class="page-link" href="user/index/1">First</a></li>`;

            // lùi về trước 1 trang
            pagination += `<li class="page-item">
            <a class="page-link" href="#">Previous</a></li>`;

            for(let j = 1; j <= sumPage; j++)
            {
                // active page
                var active='';
                (j==page)?active='active':'';

                pagination += `<li class="page-item `+active+`">
                <a class="page-link" href="user/index/`+j+`">
                `+j+`</a></li>`;
            }

            // tiến về trước 1 trang
            pagination += `<li class="page-item">
            <a class="page-link" href="#">Next</a></li>`;

            // nhảy về cuối trang
            pagination += `<li class="page-item">
            <a class="page-link" href="user/index/`+sumPage+`">Last</a></li>`;

            // lấy link
            var link = req.originalUrl;
            // main
            var main = 'users/main_user';
            res.render('index', {main, link, table, pagination}); // {key: value}
        }
    });
});

// add
router.get('/add', (req, res)=>{
    // lấy link
    var link = req.originalUrl;
    // main
    var main = 'users/add_user';
    res.render('index', {main: main, link: link}); // {key: value}
});

// gọi bcrypt
const bcrypt = require('bcrypt');
const saltRounds = 10;

// xử lý thêm và chỉnh sửa
router.post('/process', (req, res)=>{
    // khai báo
    var username, password, email, flag=1;

    // lấy giá trị
    username=req.body.username;
    password=req.body.password;
    email=req.body.email;

    // kiểm tra

    if(flag==1){
        // kết nối mongodb
        user_models
        .find({username:username}, (err,dataUsername)=>{
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
                                                email: email
                                            };
                                            user_models
                                            .create(obj_data, (err, dataCreate)=>{
                                                if(err){
                                                    res.send({kq:0, err:err});
                                                }else{
                                                    res.send({kq:1, data:dataCreate});
                                                    // gửi mail xác nhận
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
                //res.send(data);
            }
        });
    }
});

// gọi nodemailer
var nodemailer = require('nodemailer');

// gửi mail

// Điều kiện để gửi mail
// 1. Có 1 tài khoản gửi mail: không quan trọng
// 2. Cài đặt tài khoản gửi mail này
//  2.1 Xác nhận cảnh báo bên gmail
//  2.2 Bật POP/IMAP
//  2.3 Bật quyền truy cập của ứng dụng kém an toàn
// 3. Tài khoản nhận email (tiêu đề, nội dung)

router.post('/sendMail', (req, res)=>{
    var transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: 'phuoctrung152192@gmail.com',
          pass: '******'
        }
    });
    var mailOptions = {
        from: 'phuoctrung152192@gmail.com',
        to: 'trantrungphuoc7@gmail.com',
        subject: 'Sending Email using Node.js',
        text: 'That was easy!' //html
    };
    transporter.sendMail(mailOptions, function(error, info){
        if (error) {
          console.log(error);
        } else {
          console.log('Email sent: ' + info.response);
        }
    });
});

// xuất ra sử dụng
module.exports = router;