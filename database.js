// kết nối mongodb
const mongoose = require('mongoose');
mongoose.connect('mongodb+srv://huy:itadmin2021@cluster0.vtl1d.mongodb.net/mean_11_01_2021?retryWrites=true&w=majority', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true
})
.then(()=>{console.log('Kết nối thành công')})
.catch(()=>{console.log('Thất bại')});