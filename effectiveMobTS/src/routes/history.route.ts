import {Request, Response, Router} from 'express';
const sequelize = require('../db');
const {StoreStorageHistory, ShelfItemsHistory, OrderItemsHistory} = require('../tables_db');
const { Op } = require('sequelize');

const router = Router();

router.get('/history', async (req: Request, res: Response) => {
    try {
        let {StoreId, ItemId, startDate, endDate, action, page, limit} = req.body;
        page = parseInt(page || '1', 10);
        limit = parseInt(limit || '10', 10);
        const offset = (page - 1) * limit;

        if (StoreId) {
            const storeStorageHistory = await StoreStorageHistory.findAll({where: {StoreId}}, offset, limit);            
            const orderItemsHistories = await OrderItemsHistory.findAll({where: {OrderId: {
                    [Op.in]: sequelize.literal(`(SELECT id FROM "Orders" WHERE "StoreId" = ${StoreId})`)}}
            }, offset, limit);
            const shelfItemsHistories = await ShelfItemsHistory.findAll({where: {ShelfId: {
                    [Op.in]: sequelize.literal(`(SELECT id FROM "Shelves" WHERE "StoreId" = ${StoreId})`)}}
            }, offset, limit);          
                   
            return res.json({items: [...storeStorageHistory, ...orderItemsHistories, ...shelfItemsHistories], page, limit})    
        }
        if (ItemId) {
            const storeStorageHistory = await StoreStorageHistory.findAll({where: {ItemId}}, offset, limit); 
            const orderItemsHistories = await OrderItemsHistory.findAll({where: {ItemId}}, offset, limit); 
            const shelfItemsHistories = await ShelfItemsHistory.findAll({where: {ItemId}}, offset, limit); 
            
            return res.json({items: [...storeStorageHistory, ...orderItemsHistories, ...shelfItemsHistories], page, limit})  
        }
        if (action) {
            const storeStorageHistory = await StoreStorageHistory.findAll({where: {action}}, offset, limit); 
            const orderItemsHistories = await OrderItemsHistory.findAll({where: {action}}, offset, limit); 
            const shelfItemsHistories = await ShelfItemsHistory.findAll({where: {action}}, offset, limit); 
            
            return res.json({items: [...storeStorageHistory, ...orderItemsHistories, ...shelfItemsHistories], page, limit}) 
        }
        if (startDate || endDate) {
            startDate = !!startDate ? startDate : "2000-01-01";
            endDate = !!endDate ? endDate : "2050-01-01";

            const storeStorageHistory = await StoreStorageHistory.findAll({where: {craetedAt: {[Op.between]: [startDate, endDate]}}}, offset, limit);
            const orderItemsHistories = await OrderItemsHistory.findAll({where: {craetedAt: {[Op.between]: [startDate, endDate]}}}, offset, limit); 
            const shelfItemsHistories = await ShelfItemsHistory.findAll({where: {craetedAt: {[Op.between]: [startDate, endDate]}}}, offset, limit);

            return res.json({items: [...storeStorageHistory, ...orderItemsHistories, ...shelfItemsHistories], page, limit})  
        }
    } catch (error) {
        console.log(error);            
        res.status(400);
        return res.json({message: "Ошибка: проверьте введеные данные!"})
    }
});


module.exports = router;