module.exports = {
    alias: ["ping"], //nombre del comando
    descripcion: "", // que hace
    costo: 0, //cuanto cuesta
    testing: false, //se está probando?
    callback: async (args, message, client, system) => {
        let _message = await message.reply("Pong!");

        let pingMessageTime = message.createdTimestamp; //1
        let messageStartProcessing = system.pingTime; //2
        let messageSentTime = _message.createdTimestamp; //3

        let recieveTime = Math.abs(messageStartProcessing - pingMessageTime);
        let processTime = Math.abs(messageSentTime - messageStartProcessing);
        let totalTime = Math.abs(messageSentTime - pingMessageTime);

        await _message.edit("Pong! " +
            "\n-# Tiempo en recibir el mensaje: " + (recieveTime).toString() +
            "\n-# Tiempo en procesar el mensaje: " + (processTime).toString() +
            "\n-# Tiempo total: " + (totalTime).toString()
        );
    }
}