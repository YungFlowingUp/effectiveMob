const {Shelf, ShelfItems, StoreStorage} = require('../tables_db');
const { Op } = require('sequelize');
const {sendShelfItemsHistory} = require('../producers/shelf.items.producer');

class ShelfController {
    async createShelf(req, res) {
        try {
            const StoreId = req.params.StoreId;            
            const newShelf = await Shelf.create({StoreId}); 
            return res.json({newShelf})
        } catch (error) {
            console.log(error);            
            res.status(400);
            return res.json({message: "Ошибка: проверьте введеные данные!"})
        } 
    }

    async addItemToShelf(req, res) {        
        const {ItemId, ShelfId, quantity} = req.body;
        try {
            const shelf = await Shelf.findAll({where: {id: ShelfId}});           
            const stock = await StoreStorage.findAll({where: {StoreId: shelf[0].dataValues.StoreId, ItemId}});            
            if (stock[0].dataValues.quantity < quantity) {
                res.status(400);
                return res.json({message: "Ошибка: товара не хватает в магазине!"})
            }            
            const addedItems = await ShelfItems.create({ItemId, ShelfId, quantity});
            await sendShelfItemsHistory(ItemId, ShelfId, 0, quantity, "Добавление товара на полку");
            return res.json({addedItems})       
        } catch (error) {
            console.log(error);            
            res.status(400);
            return res.json({message: "Ошибка: проверьте введеные данные!"})
        }
    }

    async getItems(req, res) {
        let {startDate, endDate} = req.body;  
        startDate = !!startDate ? startDate : "2000-01-01";
        endDate = !!endDate ? endDate : "2050-01-01";

        const items = await ShelfItems.findAll({               
            where: {updatedAt: {[Op.between]: [startDate, endDate]}}});
            
        return res.json(items)    
    }
}

module.exports = new ShelfController();