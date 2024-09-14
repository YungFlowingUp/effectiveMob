const {Store, Shelf, ShelfItems} = require('../tables_db');

class StoreController {
    async createStore(req, res) {
        const {name} = req.body;
        const newStore = await Store.create({name});
        const shelves = {};             //* Пусть магазин сразу создается с 5 полками
        for (let i = 0; i < 5; i++) {           
            shelves[i+1] = await Shelf.create({StoreId: newStore.dataValues.id});
        }
        shelves[0] = newStore;       
        
        return res.json({shelves})
    }

    async getAll(req, res) {
        const stores = await Store.findAll();

        return res.json(stores)
    }
}

module.exports = new StoreController();