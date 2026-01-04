const StatToIndex = new Map([
    ["FUE", 0],
    ["DES", 1],
    ["CON", 2],
    ["INT", 3],
    ["SAB", 4],
    ["FÉ", 5],
    ["FE", 5],
    ["ESP", 6],
    ["CAR", 7]
 ])

const IndexToStat = [
    "FUE",
    "DES",
    "CON",
    "INT",
    "SAB",
    "FÉ ",
    "ESP",
    "CAR"
]

const DiceAmount = {
    pv: 10,
    baseStat: 2,
    primeStat: 3,
    mana: 2,
}

const Personaje = class {
    constructor(primeStat)
    {
        this.stats = Array(IndexToStat.length).fill(0);
        this.primeStat = primeStat;

        let dice = Dado(10, 1, DiceAmount.pv);
        this.pv = dice.reduce((x,y) => x + y);
        dice = Dado(10, 1, DiceAmount.mana);
        this.mana = dice.reduce((x,y) => x + y);
        this.def = Dado(6);
        this.rma = Dado(6);

        for (let stat in this.stats) {
            if (primeStat == stat) 
                this.stats[stat] = Dado(6, 1, DiceAmount.primeStat).reduce((x,y) => x + y) + "♦";
            else 
                this.stats[stat] = Dado(6,1,DiceAmount.baseStat).reduce((x,y) => x + y);
        }
    }

    toString() {
        let a = "";
        for (let stat in this.stats) {
            a += "\n`" + IndexToStat[stat] + ":` `" + (this.stats[stat] +  "").padStart(5,  " ") + "`";
        }

        return "# Stats:" +
        "\n`PV: ".padEnd(25, " ") + "` `" + (this.pv + "").padStart(3, " ") + "`" +
        "\n`Maná: ".padEnd(25, " ") + "` `" + (this.mana + "").padStart(3, " ") + "`" +
        "\n`Resistencia Física: ".padEnd(25, " ") + "` `" + (this.def + "").padStart(3, " ") + "`" +
        "\n`Resistencia Mágica: ".padEnd(25, " ") + "` `" + (this.rma + "").padStart(3, " ") + "`" +

        "\n# Atributos: " + a;
    }
}

function CreateCharacter(stat = "FUE") {
    stat = stat.toUpperCase(stat);


    stat = StatToIndex.has(stat) ? StatToIndex.get(stat) : "FUE";

    //if (stat == undefined || stat == "") stat = IndexToStat[~~(Math.random() * IndexToStat.length)];

    let personaje = new Personaje(stat);

    return personaje;
}

function Dado(max = 6, min = 1, amount = 1) {
    if (amount == 1) return ~~(Math.random() * (max - min + 1) + min);
    Dice = [];
    do {
        Dice.push(~~(Math.random() * (max - min + 1) + min));
    } while (--amount > 0);
    return Dice;
}


module.exports.rol = CreateCharacter;