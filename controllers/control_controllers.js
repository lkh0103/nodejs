const express = require('express');
const router = express.Router();

// gọi đến file dashboard_controllers
const dashboard_controllers = require('./dashboard_controllers');
router.use('/admin/dashboard', dashboard_controllers);

// gọi đến file category_controllers
const category_controllers = require('./category_controllers');
router.use('/admin/category', category_controllers);

// gọi đến file product_controllers
const product_controllers = require('./product_controllers');
router.use('/admin/product', product_controllers);

// gọi đến file user_controllers
const user_controllers = require('./user_controllers');
router.use('/admin/user', user_controllers);

// gọi đến file login_controllers
const login_controllers = require('./login_controllers');
router.use('/', login_controllers);

// gọi đến api_categories
const api_categories = require('./api_categories');
router.use('/api/categories', api_categories);

// gọi đến api_products
const api_products = require('./api_products');
router.use('/api/products', api_products);

// gọi đến api_users
const api_users = require('./api_users');
router.use('/api/users', api_users);

// gọi đến api_menu
const api_menu = require('./api_menu');
router.use('/api/menu', api_menu);

// gọi đến api_config
const api_config = require('./api_config');
router.use('/api/config', api_config);

// xuất ra sử dụng
module.exports = router;