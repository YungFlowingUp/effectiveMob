const Router = require('express');
const router = new Router();
const itemController = require('../controller/item.controller');

router.post('/item', itemController.createItem); //* Создание товара
router.get('/item', itemController.getItems); //* Получение товара по фильтру/id или всех


module.exports = router;