const amqp = require('amqplib');
const {ShelfItemsHistory} = require('../tables_db');

async function consumeShelfItemsHistory() {
    const connection = await amqp.connect(process.env.RABBITMQ_URL || 'amqp://localhost');
    const channel = await connection.createChannel();
    const queue = 'shelf_items_history';

    await channel.assertQueue(queue, {durable: false});
    console.log('Waiting for messages in %s.', queue);

    channel.consume(queue, async (msg: { content: { toString: () => string; }; } | null) => {
        if (msg !== null) {
            const {ItemId, ShelfId, prevQuantity, curQuantity, action} = JSON.parse(msg.content.toString());
            console.log('Полученные данные:', {ItemId, ShelfId, prevQuantity, curQuantity, action});

            try {
                await ShelfItemsHistory.create({ItemId, ShelfId, prevQuantity, curQuantity, action});        
            } catch (error) {
                console.log(error);
            }
            channel.ack(msg);
        }
    });
}

module.exports = {consumeShelfItemsHistory};