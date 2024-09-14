const amqp = require('amqplib');

async function sendOrderItemsHistory(ItemId, OrderId, prevQuantity, curQuantity, action) {       
    const connection = await amqp.connect(process.env.RABBITMQ_URL || 'amqp://localhost');     
    const channel = await connection.createChannel();    
    const queue = 'order_items_history';    

    await channel.assertQueue(queue, { durable: false });
    channel.sendToQueue(queue, Buffer.from(JSON.stringify({ItemId, OrderId, prevQuantity, curQuantity, action})));

    console.log(`Отправлено сообщение через очередь ${queue} содержимое:`, {ItemId, OrderId, prevQuantity, curQuantity, action});
    setTimeout(() => {
        connection.close();
    }, 500);
}

module.exports = {sendOrderItemsHistory};
