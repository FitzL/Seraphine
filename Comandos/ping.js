module.exports = {
    alias: ["ping"], //nombre del comando
    descripcion: "", // que hace
    costo: 0, //cuanto cuesta
    testing: false, //se está probando?
    callback: async (args, message, client, system) => {
        let _message = await message.reply("Pong!");
        let startTime = message.createdTimestamp;
        await _message.edit("Pong! " + (_message.createdTimestamp - startTime) + "ms.");

        console.log(prettierPing(startTime, _message.createdTimestamp));
    }
}

function prettierPing(timeA, timeB) {
    let dateA = new Date(timeA);
    let dateB = new Date(timeB);

    let secondStampA = dateA.getSeconds().toString().padStart(2, "0") + "." + dateA.getMilliseconds().toString().padStart(3, "0");
    let secondStampB = dateB.getSeconds().toString().padStart(2, "0") + "." + dateB.getMilliseconds().toString().padStart(3, "0");

    return {
        timeA: secondStampA,
        timeB: secondStampB
    }
}