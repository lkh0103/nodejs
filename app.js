const express = require('express');
const app = express();

// gọi database
require('./database');

// mở api
app.use((req, res, next)=>{
    res.setHeader('Access-Control-Allow-Origin', 'http://localhost:4200');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
    res.setHeader('Access-Control-Allow-Credentials', true);
    next();
});

// cài đặt ejs
app.set('view engine', 'ejs');

// cài đặt đường dẫn tĩnh
app.use('/', express.static('public'));

// gọi body-parser
const bodyParser = require('body-parser');
// cài đặt
// x-www-form-urlencoded
app.use(bodyParser.urlencoded({extended: false}));
// json
app.use(bodyParser.json());

// gọi đến file control_controllers
const control_controllers = require('./controllers/control_controllers');
app.use('/', control_controllers);

app.listen(3000, ()=>{
    console.log('Đã bật Server');
});