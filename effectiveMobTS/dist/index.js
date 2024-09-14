"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
require('dotenv').config({ path: './src/.env' });
const sequelize = require('./db');
const express = require("express");
const route = require('./routes/history.route');
const { consumeStoreStorageHistory } = require('./consumers/store.storage.consumer');
const { consumeShelfItemsHistory } = require('./consumers/shelf.items.consumer');
const { consumeOrderItemsHistory } = require('./consumers/order.items.consumer');
const app = express();
app.use(express.json());
app.use('/api', route);
const PORT = process.env.PORT || 3001;
function start() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            yield sequelize.authenticate();
            yield sequelize.sync();
            app.listen(PORT, () => console.log(`Started on port ${PORT}`));
            yield consumeStoreStorageHistory();
            yield consumeShelfItemsHistory();
            yield consumeOrderItemsHistory();
        }
        catch (error) {
        }
    });
}
start();
