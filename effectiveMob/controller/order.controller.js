const { Op } = require('sequelize');
const {Order, OrderItems, StoreStorage} = require('../tables_db');
const {sendOrderItemsHistory} = require('../producers/order.items.producer');

class OrderController {
    async createOrder(req, res) {
        const {ItemId, StoreId, quantity} = req.body;
        const newOrder = {};
        try {            
            const stock = await StoreStorage.findAll({where: {ItemId, StoreId}});                      
            if (stock[0].dataValues.quantity < quantity) {
                res.status(400);
                return res.json({message: "Ошибка: товара не хватает в магазине!"})
            }            
            newOrder[0] = await Order.create({StoreId});            
            newOrder[1] = await OrderItems.create({OrderId: newOrder[0].dataValues.id, ItemId, quantity});           
        
            await sendOrderItemsHistory(ItemId, newOrder[0].dataValues.id, 0, quantity, "Добавление товара в заказ");
            return res.json({newOrder})
        } catch (error) {
            console.log(error);            
            res.status(400);
            return res.json({message: "Ошибка: проверьте введеные данные!"})
        }           
    }

    async getOrder(req, res) {
        let {startDate, endDate} = req.body;
        startDate = !!startDate ? startDate : "2000-01-01";
        endDate = !!endDate ? endDate : "2050-01-01";

        if (req.query['quantity']) {
            const quantity = await OrderItems.sum('quantity', {where: {createdAt: {[Op.between]: [startDate, endDate]}}});
            return res.json("Остаток: " + quantity)
        }      
              
        const allOrders = await OrderItems.findAll({where: {createdAt: {[Op.between]: [startDate, endDate]}}});
        return res.json(allOrders)
    }

    async deleteOrder(req, res) {
        const id = req.params.id;
        try {
            const existing = await OrderItems.findAll({where: {OrderId: id}});        
            const deletedOrder = await Order.destroy({where: {id}});

            await sendOrderItemsHistory(
                existing[0].dataValues.ItemId, existing[0].dataValues.OrderId, 
                existing[0].dataValues.quantity, 0, "Удаление заказа"
            );
            
            return res.json("Строк удалено: " + deletedOrder)
        } catch (error) {
            console.log(error);            
            res.status(400);
            return res.json({message: "Ошибка: проверьте введеные данные!"})
        }        
    }
}

module.exports = new OrderController();