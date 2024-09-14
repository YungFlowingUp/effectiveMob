const {StoreStorage} = require('../tables_db');
const {sendStoreStorageHistory} = require('../producers/store.storage.producer');

class StoreStorageController {
    async addItem(req, res) {
        const {ItemId, StoreId, quantity} = req.body;
        const exists = await StoreStorage.findAll({where: {ItemId, StoreId}});
        if (exists.length === 0) {
            const addedItem = await StoreStorage.create({ItemId, StoreId, quantity});
            
            await sendStoreStorageHistory(ItemId, StoreId, 0, quantity, "Добавление товара в магазин");
            return res.json({addedItem})
        }              
        const updatedItems = await StoreStorage.update({quantity}, {where: {ItemId, StoreId}});        
        const action = exists[0].dataValues.quantity < quantity ? "Увелечение остатка" : "Уменьшение остатка";
        await sendStoreStorageHistory(ItemId, StoreId, exists[0].dataValues.quantity, quantity, action);

        return res.json(updatedItems)
    }

    async getQuantityByStore(req, res) {
        const StoreId = req.params.id;
        const allItems = await StoreStorage.findAll({where: {StoreId}});

        return res.json(allItems)
    }

    async getQuantityByItem(req, res) {
        const ItemId = req.params.id;
        const allItems = await StoreStorage.findAll({where: {ItemId}});

        return res.json(allItems)
    }

    async updateItems(req, res) {
        const {ItemId, StoreId, quantity} = req.body;
        try {
            const existing = await StoreStorage.findAll({where: {ItemId, StoreId}});
            const updatedItems = await StoreStorage.update({quantity}, {where: {ItemId, StoreId}});

            const action = existing[0].dataValues.quantity < quantity ? "Увелечение остатка" : "Уменьшение остатка";
            await sendStoreStorageHistory(ItemId, StoreId, existing[0].dataValues.quantity, quantity, action);
            return res.json(updatedItems)
        } catch (error) {
            console.log(error);
            res.status(400);
            return res.json({message: "Ошибка: проверьте введеные данные!"})
        }        
    }
}

module.exports = new StoreStorageController();