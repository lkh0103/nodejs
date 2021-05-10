const express = require('express');
const router = express.Router();

// gọi đến category_models
const category_models = require('./../models/category_models');

// Gọi localstorage
var LocalStorage = require('node-localstorage').LocalStorage;
localStorage = new LocalStorage('./scratch');

// load thư viện jwt
const jwt = require('jsonwebtoken');
const serect = '#$65$';

const url = 'http://localhost:3000/login/index';

function checkLogin(req, res, next){
    // kiểm tra đăng nhập
    // getItem
    var token = localStorage.getItem('token');
    jwt.verify(token, serect, (err, data)=>{
        if(err){
            res.redirect(url);
        }else{
            // kiểm tra status, kết nối mongodb, chạy đến bảng token
            next();
        }
    });
}

function checkRole(req, res, next){
    var token = localStorage.getItem('token');
    jwt.verify(token, serect, (err, data)=>{
        if(err){
            res.redirect(url);
        }else{
            // lấy được thông tin trong payload, có chứa role
            // Ví dụ hiện tại có 3 quyền: admin=1, user=2, guest=3
            // mở rộng quyền về sau: phongketoan=4, phongkinhdoanh=5

            // 1: toàn quyền (làm bất cứ quyền gì, chức năng gì)
            // 2: được xem, thêm và sửa, không được xóa
            // 3: được xem
            // 4: chỉ được thực hiện chức năng của module phòng kế toán
            // 5: chỉ được thực hiện chức năng của module phòng kinh doanh
            
            if(data[0].role == 1 || data[0].role == 2){
                next();
            }else{
                res.send({kq:0, message: `Bạn không đủ quyền để truy cập 
                hoặc thực hiện chức năng`});
            }
        }
    });
}

// index
router.get('/index', checkLogin, (req, res)=>{
    category_models
    .aggregate([
        {
            "$lookup": {
                "from": "categories",
                "localField": "name",
                "foreignField": "parents",
                "as": "childs"
            }
        }
    ])
    .exec(function(err, data){
        if(err){
            res.send({kq:0, err:err});    
        }else{
            var table='';
            var i=0;
            data.forEach(e => {
                // cha
                if(e.parents==''){
                    i++;
                    table += `<tr id="vl_d`+e._id+`">
                        <td><input type="text" class="sort" value="`+e.sort+`"></td>
                        <td><button type="button" class="btn btn-info">
                        <i class="fa fa-upload" aria-hidden="true"></i> Uploads</button></td>
                        <td>`+e.name+`</td>
                        <td><input type="checkbox" onclick="status('`+e._id+`')"></td>
                        <td>
                            <a href="category/edit/`+e._id+`" class="btn btn-info">
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
                    var j=0;
                    // con cấp 1
                    e.childs.forEach(v=>{
                        j++
                        table += `<tr id="vl_d`+v._id+`">
                            <td>|-----<input type="text" class="sort" value="`+e.sort+`"></td>
                            <td><button type="button" class="btn btn-info">
                            <i class="fa fa-upload" aria-hidden="true"></i> Uploads</button></td>
                            <td>|-----`+v.name+`</td>
                            <td><input type="checkbox" onclick="status('`+e._id+`')"></td>
                            <td>
                                <a href="category/edit/`+v._id+`" class="btn btn-info">
                                    <i class="fa fa-pencil-alt"></i>
                                    Sửa
                                </a>
                                <button type="button" class="btn btn-danger" 
                                onclick="popup_delete('`+v._id+`','`+v.name+`')" 
                                data-toggle="modal" data-target="#myModal">
                                    <i class="fa fa-trash"></i>
                                    Xóa
                                </button>
                            </td>
                        </tr>`;
                    });
                }
            });
            // lấy link
            var link = req.originalUrl;
            // main
            var main = 'categorys/main_category';
            res.render('index', {main: main, link: link, table: table}); // {key: value}
        }
    });
});

// add
router.get('/add', checkLogin, (req, res)=>{
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
            // lấy link
            var link = req.originalUrl;
            // main
            var main = 'categorys/edit_category';
            // category
            var str_parents='';

            data.forEach(e=>{
                // cha
                if(e.parents==''){
                    str_parents += '<option value="'+e.name+'">'+e.name+'</option>';

                    // con cấp 1
                    e.childs.forEach(v=>{
                        str_parents += '<option value="'+v.name+'">|-----'+v.name+'</option>';
                    });
                }
            });

            res.render('index', {main: main, link: link, data: '', parents: str_parents}); // {key: value}
        }
    });
});

// edit
router.get('/edit/:id', (req, res)=>{
    category_models.find({_id: req.params.id}, (err, data)=>{
        if(err){
            res.send({kq:0, err:err});
        }else{
            category_models.aggregate([
                {
                    "$lookup": {
                        "from": "categories",
                        "localField": "name",
                        "foreignField": "parents",
                        "as": "childs"
                    }
                }
            ]).exec(function(err, docs){
                if(err){
                    res.send({kq:0, err:err});    
                }else{
                    // lấy link
                    var link = req.originalUrl;
                    // main
                    var main = 'categorys/edit_category';
                    // category
                    var str_parents='';
    
                    docs.forEach(e=>{
                        // cha
                        if(e.parents==''){
                            (e.name==data[0].parents) ? selected='selected': selected='';
                            str_parents += '<option value="'+e.name+'" '+selected+'>'+e.name+'</option>';
        
                            // con cấp 1
                            e.childs.forEach(v=>{
                                (v.name==data[0].parents) ? selected='selected': selected='';
                                str_parents += '<option value="'+v.name+'" '+selected+'>|-----'+v.name+'</option>';
                            });
                        }
                    });
    
                    res.render('index', {main: main, link: link, data: data[0], parents: str_parents}); // {key: value}
                }
            });
        }
    });
});

// process: add và edit
router.post('/process', async (req, res)=>{
    // khai báo
    var name, parents, content, funct, err='', flag=1;

    // lấy dữ liệu
    name=req.body.name;
    parents=req.body.parents;
    content=req.body.content;
    
    // phân biệt thêm, chỉnh sửa
    funct=req.body.funct;

    // sort
    const sort = await category_models.find({parents:parents});

    const obj_data={
        name: name,
        parents: parents,
        content: content,
        sort: (sort.length + 1)
    };

    // kiểm tra dữ liệu
    // 1. tên không được rỗng
    if(name=='')
    {
        flag=0;
        err='Tên không được rỗng';
    }

    if(flag==1){
        // kết nối và xử lý với mongodb

        // 1. kiểm tra tên có tồn tại chưa
        category_models.find({ name: name }, (err, data)=>{
            if(err){
                res.send({ kq:0, err:err });
            }else{
                if(data==''){
                    // thêm dữ liệu
                    category_models.create(obj_data, (err, data_insert)=>{
                        if(err){
                            res.send({ kq:0, err:err });
                        }else{
                            res.send({ kq:1, message: 'Thêm thành công' });
                        }
                    });

                    if(funct==1)
                    {
                        // xử lý thêm
                    }
                    else
                    {
                        // xử lý edit
                    }

                }else{
                    res.send({ kq:0, err:'Dữ liệu này đã tồn tại' });
                }
            }
        });
    }else{
        res.send({ kq:0, err:err });
    }
});

// xóa 1 dữ liệu
router.post('/deleteOne', (req, res)=>{
    // khai báo
    var id, flag=1, err='';
    // lấy dữ liệu
    id=req.body.id;
    // kiểm tra dữ liệu
    if(id==''){
        flag=0;
        err='Không tồn tại dữ liệu';
    }
    // tổng kết
    if(flag==1){
        // kết nối db và xử lý
        category_models.findByIdAndDelete({_id:id}, (err,data)=>{
            if(err){
                res.send({kq:0, err:err});
            }else{
                res.send({kq:1, message: 'Đã xóa thành công.'});
            }
        });
    }
});

// xuất ra sử dụng
module.exports = router;