class Command {
    alias = [];
    descripcion = "";
    costo = 0;
    testing = false;
    init = async () => { };
    callback = async () => { };
    cantidad = 1;

    constructor(_alias = [], _descripcion = "", _costo = 0, _testing = false, _callback = async () => { }, _init = async () => { }, _cantidad = 1) {
        this.alias = _alias;
        this.descripcion = _descripcion;
        this.costo = _costo;
        this.testing = _testing;
        this.callback = _callback;
        this.cantidad = 1;
    }

    calculateCosto(multiplier = this.cantidad, bypass = false) {
        if (isNaN(parseInt(multiplier))) throw "MULTIPLIER_IS_NAN";
        if (parseInt(multiplier) < 0 && !bypass) throw "MULTIPLIER_IS_NEGATIVE";
        return this.costo * multiplier;
    }

    checkCosto(user, multiplier = this.cantidad, bypass) {
        return user.currency >= this.calculateCosto(multiplier);
    }

    getCantidad() {
        return this.cantidad;
    }

    updateCantidad(num) {
        this.cantidad = num;
    }
}

module.exports.Command = Command;