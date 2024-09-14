"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize = require('./db');
const { DataTypes } = require('sequelize');
const StoreStorageHistory = sequelize.define('StoreStorageHistory', {
    ItemId: { type: DataTypes.INTEGER, allowNull: false },
    StoreId: { type: DataTypes.INTEGER, allowNull: false },
    prevQuantity: { type: DataTypes.INTEGER },
    curQuantity: { type: DataTypes.INTEGER, allowNull: false },
    action: { type: DataTypes.STRING, allowNull: false }
});
const ShelfItemsHistory = sequelize.define('ShelfItemsHistory', {
    ItemId: { type: DataTypes.INTEGER, allowNull: false },
    ShelfId: { type: DataTypes.INTEGER, allowNull: false },
    prevQuantity: { type: DataTypes.INTEGER },
    curQuantity: { type: DataTypes.INTEGER, allowNull: false },
    action: { type: DataTypes.STRING, allowNull: false }
});
const OrderItemsHistory = sequelize.define('OrderItemsHistory', {
    ItemId: { type: DataTypes.INTEGER, allowNull: false },
    OrderId: { type: DataTypes.INTEGER, allowNull: false },
    prevQuantity: { type: DataTypes.INTEGER },
    curQuantity: { type: DataTypes.INTEGER, allowNull: false },
    action: { type: DataTypes.STRING, allowNull: false }
});
module.exports = { StoreStorageHistory, ShelfItemsHistory, OrderItemsHistory };
