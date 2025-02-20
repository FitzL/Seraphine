function rol(mana = "") {
    const pv1 = Dado(6);
    const pv2 = Dado(6);
    const pv = `PV: ${pv1 + pv2} [d6 (${pv1}) + d6 (${pv2})]\n`;
    let ma;
    if (mana.toLowerCase() === "si") {
        const ma1 = Dado(6);
        const ma2 = Dado(6);
        ma = `Mana: ${ma1 + ma2} [d6 (${ma1}) + d6 (${ma2})]\n`;
    } else {
        ma = `Mana: ${Dado(6)}\n`;
    }
    const def = `Defensa: ${Dado(4)}\n`;
    const mr = `Defensa Magica: ${Dado(4)}\n`

    let atributos = [];
    let i = 7;
    while (i--) {
        atributos += Dado(6);
    }

    let fue = "FUE: " + atributos[0] + "\n";
    let des = "DES: " + atributos[1] + "\n";
    let con = "CON: " + atributos[2] + "\n";
    let pun = "PUN: " + atributos[3] + "\n";
    let int = "INT: " + atributos[4] + "\n";
    let sab = "SAB: " + atributos[5] + "\n";
    let sue = "SUE: " + atributos[6];

    let output = "# Stats: \n" + pv + ma + def + mr + "# Atributos: \n" + fue + des + con + pun + int + sab + sue;

    return output;
}

function Dado(max = 20, min = 1) {
    return ~~(Math.random() * (max - min + 1) + min);
}


module.exports.rol = rol;