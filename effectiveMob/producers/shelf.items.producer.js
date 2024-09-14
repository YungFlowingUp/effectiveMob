const amqp = require('amqplib');

async function sendShelfItemsHistory(ItemId, ShelfId, prevQuantity, curQuantity, action) {       
    const connection = await amqp.connect(process.env.RABBITMQ_URL || 'amqp://localhost');     
    const channel = await connection.createChannel();    
    const queue = 'shelf_items_history';    

    await channel.assertQueue(queue, { durable: false });
    channel.sendToQueue(queue, Buffer.from(JSON.stringify({ItemId, ShelfId, prevQuantity, curQuantity, action})));

    console.log(`Отправлено сообщение через очередь ${queue} содержимое:`, {ItemId, ShelfId, prevQuantity, curQuantity, action});
    setTimeout(() => {
        connection.close();
    }, 500);
}

module.exports = {sendShelfItemsHistory};
