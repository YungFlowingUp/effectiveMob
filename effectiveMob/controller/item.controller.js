const {Item} = require('../tables_db');

class ItemController {
    async createItem(req, res) {
        const {name} = req.body;
        const newItem = await Item.create({name});

        return res.json(newItem)
    }

    async getItems(req, res) {
        if (req.query['plu']) {
            const Items = await Item.findAll({where: {id: req.query['plu']}});
            return res.json(Items)
        } else if (req.query['name']){
            const Items = await Item.findAll({where: {name: req.query['name']}});
            return res.json(Items)
        }
        const Items = await Item.findAll();
        return res.json(Items)
    }
}

module.exports = new ItemController();