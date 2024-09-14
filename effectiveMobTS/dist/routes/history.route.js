"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const sequelize = require('../db');
const { StoreStorageHistory, ShelfItemsHistory, OrderItemsHistory } = require('../tables_db');
const { Op } = require('sequelize');
const router = (0, express_1.Router)();
router.get('/history', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let { StoreId, ItemId, startDate, endDate, action, page, limit } = req.body;
        page = parseInt(page || '1', 10);
        limit = parseInt(limit || '10', 10);
        const offset = (page - 1) * limit;
        if (StoreId) {
            const storeStorageHistory = yield StoreStorageHistory.findAll({ where: { StoreId } }, offset, limit);
            const orderItemsHistories = yield OrderItemsHistory.findAll({ where: { OrderId: {
                        [Op.in]: sequelize.literal(`(SELECT id FROM "Orders" WHERE "StoreId" = ${StoreId})`)
                    } }
            }, offset, limit);
            const shelfItemsHistories = yield ShelfItemsHistory.findAll({ where: { ShelfId: {
                        [Op.in]: sequelize.literal(`(SELECT id FROM "Shelves" WHERE "StoreId" = ${StoreId})`)
                    } }
            }, offset, limit);
            return res.json({ items: [...storeStorageHistory, ...orderItemsHistories, ...shelfItemsHistories], page, limit });
        }
        if (ItemId) {
            const storeStorageHistory = yield StoreStorageHistory.findAll({ where: { ItemId } }, offset, limit);
            const orderItemsHistories = yield OrderItemsHistory.findAll({ where: { ItemId } }, offset, limit);
            const shelfItemsHistories = yield ShelfItemsHistory.findAll({ where: { ItemId } }, offset, limit);
            return res.json({ items: [...storeStorageHistory, ...orderItemsHistories, ...shelfItemsHistories], page, limit });
        }
        if (action) {
            const storeStorageHistory = yield StoreStorageHistory.findAll({ where: { action } }, offset, limit);
            const orderItemsHistories = yield OrderItemsHistory.findAll({ where: { action } }, offset, limit);
            const shelfItemsHistories = yield ShelfItemsHistory.findAll({ where: { action } }, offset, limit);
            return res.json({ items: [...storeStorageHistory, ...orderItemsHistories, ...shelfItemsHistories], page, limit });
        }
        if (startDate || endDate) {
            startDate = !!startDate ? startDate : "2000-01-01";
            endDate = !!endDate ? endDate : "2050-01-01";
            const storeStorageHistory = yield StoreStorageHistory.findAll({ where: { craetedAt: { [Op.between]: [startDate, endDate] } } }, offset, limit);
            const orderItemsHistories = yield OrderItemsHistory.findAll({ where: { craetedAt: { [Op.between]: [startDate, endDate] } } }, offset, limit);
            const shelfItemsHistories = yield ShelfItemsHistory.findAll({ where: { craetedAt: { [Op.between]: [startDate, endDate] } } }, offset, limit);
            return res.json({ items: [...storeStorageHistory, ...orderItemsHistories, ...shelfItemsHistories], page, limit });
        }
    }
    catch (error) {
        console.log(error);
        res.status(400);
        return res.json({ message: "Ошибка: проверьте введеные данные!" });
    }
}));
module.exports = router;
