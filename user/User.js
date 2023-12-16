class User {
    get name() {
        return this._name;
    }

    set name(value) {
        this._name = value;
    }


    get color() {
        return this._color;
    }

    set color(value) {
        this._color = value;
    }

    constructor(name, color) {
        this._name = name;
        this.color = color | '000000';
        this._color = color;
    }
}

const user = new User();
module.exports = user;
