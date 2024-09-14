require("dotenv").config();
const express = require("express");
const sequelize = require('./db');
const tables_db = require('./tables_db');

const itemRouter = require('./routes/item.routes');
const storeRouter = require('./routes/store.routes');
const orderRouter = require('./routes/order.routes');
const storeStorageRouter = require('./routes/store.storage.routes');
const shelfRouter = require('./routes/shelf.routes');

const app = express();
app.use(express.json());
app.use('/api', itemRouter);
app.use('/api', storeRouter);
app.use('/api', orderRouter);
app.use('/api', storeStorageRouter);
app.use('/api', shelfRouter);

const PORT = process.env.PORT || 5000;
async function start() {
    try {
        await sequelize.authenticate();
        await sequelize.sync();

        //* Заполнение бд при первом запуске
        const firstStart = await tables_db.Item.findAll();               
        if (firstStart.length == 0) {           
            for (let i = 1; i < 6; i++) {
                let name = "item" + i;
                await tables_db.Item.create({name}); 
            }

            for (let i = 1; i < 4; i++) {
                let name = "store" + i;
                await tables_db.Store.create({name});   
                for (let j = 1; j < 6; j++) {
                    await tables_db.Shelf.create({StoreId: i})  
                }                            
            }

            await tables_db.StoreStorage.create({ItemId: 1, StoreId: 1, quantity: 1000});
            await tables_db.StoreStorage.create({ItemId: 1, StoreId: 2, quantity: 1000}); 
            await tables_db.StoreStorage.create({ItemId: 2, StoreId: 3, quantity: 800}); 
            await tables_db.StoreStorage.create({ItemId: 3, StoreId: 1, quantity: 500}); 
            await tables_db.StoreStorage.create({ItemId: 4, StoreId: 2, quantity: 100});
            
            await tables_db.Order.create({StoreId: 1});
            await tables_db.Order.create({StoreId: 1});
            await tables_db.Order.create({StoreId: 2});
            await tables_db.Order.create({StoreId: 3});

            await tables_db.OrderItems.create({OrderId: 1, ItemId: 1, quantity: 200});
            await tables_db.OrderItems.create({OrderId: 2, ItemId: 3, quantity: 150});
            await tables_db.OrderItems.create({OrderId: 3, ItemId: 1, quantity: 100});
            await tables_db.OrderItems.create({OrderId: 4, ItemId: 2, quantity: 10});

            await tables_db.ShelfItems.create({ItemId: 1, ShelfId: 1, quantity: 200}); 
            await tables_db.ShelfItems.create({ItemId: 2, ShelfId: 11, quantity: 50}); 
            await tables_db.ShelfItems.create({ItemId: 3, ShelfId: 3, quantity: 100}); 
            await tables_db.ShelfItems.create({ItemId: 4, ShelfId: 8, quantity: 10}); 
        }

        app.listen(PORT, () => console.log(`Started on port ${PORT}`));
    } catch (error) {
        console.log(error);        
    }
}

start()
