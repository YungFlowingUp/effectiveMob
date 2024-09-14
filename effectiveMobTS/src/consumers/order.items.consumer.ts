const amqp = require('amqplib');
const {OrderItemsHistory} = require('../tables_db');

async function consumeOrderItemsHistory() {
    const connection = await amqp.connect(process.env.RABBITMQ_URL || 'amqp://localhost');
    const channel = await connection.createChannel();
    const queue = 'order_items_history';

    await channel.assertQueue(queue, {durable: false});
    console.log('Waiting for messages in %s.', queue);

    channel.consume(queue, async (msg: { content: { toString: () => string; }; } | null) => {
        if (msg !== null) {
            const {ItemId, OrderId, prevQuantity, curQuantity, action} = JSON.parse(msg.content.toString());
            console.log('Полученные данные:', {ItemId, OrderId, prevQuantity, curQuantity, action});

            try {
                await OrderItemsHistory.create({ItemId, OrderId, prevQuantity, curQuantity, action});        
            } catch (error) {
                console.log(error);
            }
            channel.ack(msg);
        }
    });
}

module.exports = {consumeOrderItemsHistory};