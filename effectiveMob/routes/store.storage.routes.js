const Router = require('express');
const router = new Router();
const storeStorageController = require('../controller/store.storage.controller');

router.post('/storage', storeStorageController.addItem); //* Добавить предмет и его количество (создание остатка) в магазин
router.get('/storage/:id', storeStorageController.getQuantityByStore); //* Остаток по id машазина
router.get('/storage/item/:id', storeStorageController.getQuantityByItem); //*  Остаток по id тоавара
router.put('/storage', storeStorageController.updateItems); //* Изменить (уменьшить/увеличеть) остаток товара в магазине

module.exports = router; 