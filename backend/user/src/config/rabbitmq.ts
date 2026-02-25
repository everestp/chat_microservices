import amqp from 'amqplib'

let channel :amqp.Channel;
const connectRabbitMQ = async()=>{
    try {
const connection = await amqp.connect({
  protocol: "amqp",
  hostname: process.env.RABBITMQ_HOST,
  port: 5672,
  username: process.env.RABBITMQ_USERNAME,
  password: process.env.RABBITMQ_PASSWORD,
});
channel = await connection.createChannel()
console.log("✅ connect to rabbitmq")
    } catch (error) {
        console.log("Failed to connect to rabbitmq Errro :",error)
    }
}


export const publishToQueue = async(queueName :string ,message :any) =>{
if(!channel){
    console.log("Rabbitmq channel is not intialized");
    return;
}
await channel.assertQueue(queueName ,{durable:true})
channel.sendToQueue(queueName, Buffer.from(JSON.stringify(message)),{persistent :true})

}

export default connectRabbitMQ;