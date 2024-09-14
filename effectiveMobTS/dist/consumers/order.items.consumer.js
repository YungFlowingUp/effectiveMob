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
const amqp = require('amqplib');
const { OrderItemsHistory } = require('../tables_db');
function consumeOrderItemsHistory() {
    return __awaiter(this, void 0, void 0, function* () {
        const connection = yield amqp.connect(process.env.RABBITMQ_URL || 'amqp://localhost');
        const channel = yield connection.createChannel();
        const queue = 'order_items_history';
        yield channel.assertQueue(queue, { durable: false });
        console.log('Waiting for messages in %s.', queue);
        channel.consume(queue, (msg) => __awaiter(this, void 0, void 0, function* () {
            if (msg !== null) {
                const { ItemId, OrderId, prevQuantity, curQuantity, action } = JSON.parse(msg.content.toString());
                console.log('Полученные данные:', { ItemId, OrderId, prevQuantity, curQuantity, action });
                try {
                    yield OrderItemsHistory.create({ ItemId, OrderId, prevQuantity, curQuantity, action });
                }
                catch (error) {
                    console.log(error);
                }
                channel.ack(msg);
            }
        }));
    });
}
module.exports = { consumeOrderItemsHistory };
