const amqp = require('amqplib');

async function sendStoreStorageHistory(ItemId, StoreId, prevQuantity, curQuantity, action) {       
    const connection = await amqp.connect(process.env.RABBITMQ_URL || 'amqp://localhost');     
    const channel = await connection.createChannel();    
    const queue = 'store_storage_history';    

    await channel.assertQueue(queue, { durable: false });
    channel.sendToQueue(queue, Buffer.from(JSON.stringify({ItemId, StoreId, prevQuantity, curQuantity, action})));

    console.log(`Отправлено сообщение через очередь ${queue} содержимое:`, {ItemId, StoreId, prevQuantity, curQuantity, action});
    setTimeout(() => {
        connection.close();
    }, 500);
}

module.exports = {sendStoreStorageHistory};
