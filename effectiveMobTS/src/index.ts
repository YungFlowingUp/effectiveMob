require('dotenv').config({path: './src/.env'});
const sequelize = require('./db');
const express = require("express");
const route = require('./routes/history.route');
const {consumeStoreStorageHistory} = require('./consumers/store.storage.consumer');
const {consumeShelfItemsHistory} = require('./consumers/shelf.items.consumer');
const {consumeOrderItemsHistory} = require('./consumers/order.items.consumer');


const app = express();

app.use(express.json());
app.use('/api', route);

const PORT = process.env.PORT || 3001;

async function start() {
    try {
        await sequelize.authenticate();
        await sequelize.sync();
        app.listen(PORT, () => console.log(`Started on port ${PORT}`));
        await consumeStoreStorageHistory();
        await consumeShelfItemsHistory();
        await consumeOrderItemsHistory();
    } catch (error) {
        
    }
}

start();
