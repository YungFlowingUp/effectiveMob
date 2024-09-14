const Router = require('express');
const router = new Router();
const storeController = require('../controller/store.controller');

router.post('/store', storeController.createStore); //* Добавить магазин (вместе с 5 полками)
router.get('/store', storeController.getAll); //* Все магазины

module.exports = router; 