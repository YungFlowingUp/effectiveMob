const Router = require('express');
const router = new Router();
const orderController = require('../controller/order.controller');

router.post('/order', orderController.createOrder); //* Добавить заказ
router.get('/order', orderController.getOrder); //* Остатки в заказах (указание даты с-по). С параметром quantity выводит число 
router.delete('/order/:id', orderController.deleteOrder); //* Удаление заказа

module.exports = router; 