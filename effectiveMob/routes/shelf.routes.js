const Router = require('express');
const router = new Router();
const shelfController = require('../controller/shelf.controller');

router.post('/shelf/:StoreId', shelfController.createShelf); //* Добавить полку магазину с id
router.post('/shelf', shelfController.addItemToShelf); //* Добавить товар на полку
router.get('/shelf', shelfController.getItems); //* Остаток на полках с-по

module.exports = router; 