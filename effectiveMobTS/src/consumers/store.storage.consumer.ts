const amqp = require('amqplib');
const {StoreStorageHistory} = require('../tables_db');

async function consumeStoreStorageHistory() {
    const connection = await amqp.connect(process.env.RABBITMQ_URL || 'amqp://localhost');
    const channel = await connection.createChannel();
    const queue = 'store_storage_history';

    await channel.assertQueue(queue, {durable: false});
    console.log('Waiting for messages in %s.', queue);

    channel.consume(queue, async (msg: { content: { toString: () => string; }; } | null) => {
        if (msg !== null) {
            const {ItemId, StoreId, prevQuantity, curQuantity, action} = JSON.parse(msg.content.toString());
            console.log('Полученные данные:', {ItemId, StoreId, prevQuantity, curQuantity, action});

            try {
                await StoreStorageHistory.create({ ItemId, StoreId, prevQuantity, curQuantity, action});        
            } catch (error) {
                console.log(error);
            }
            channel.ack(msg);
        }
    });
}

module.exports = {consumeStoreStorageHistory};