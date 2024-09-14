const sequelize = require('./db');
const {DataTypes} = require('sequelize');

const Item = sequelize.define('Item', {
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
    name: {type: DataTypes.STRING, allowNull: false}    
});

const Store = sequelize.define('Store', {
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
    name: {type: DataTypes.STRING, allowNull: false}    
});

const StoreStorage = sequelize.define('StoreStorage', {    
    quantity: {type: DataTypes.INTEGER, defaultValue: 0}    
});

const Shelf = sequelize.define('Shelf', {
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true}      
});

const ShelfItems = sequelize.define('ShelfItems', {    
    quantity: {type: DataTypes.INTEGER, defaultValue: 0}    
});

const Order = sequelize.define('Order', {
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true}       
});

const OrderItems = sequelize.define('OrderItems', {    
    quantity: {type: DataTypes.INTEGER, defaultValue: 0}    
});


Store.hasMany(Shelf);
Shelf.belongsTo(Store);

Store.hasMany(Order);
Order.belongsTo(Store);

Store.belongsToMany(Item, {through: StoreStorage});
Item.belongsToMany(Store, {through: StoreStorage});

Shelf.belongsToMany(Item, {through: ShelfItems});
Item.belongsToMany(Shelf, {through: ShelfItems});

Order.belongsToMany(Item, {through: OrderItems});
Item.belongsToMany(Order, {through: OrderItems});

module.exports = {
    Item, Store, StoreStorage, Shelf, 
    ShelfItems, Order, OrderItems
};