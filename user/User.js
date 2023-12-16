class User {
    get name() {
        return this._name;
    }

    set name(value) {
        this._name = value;
    }


    constructor(name) {
        this._name = name;
    }
}

const user = new User();
module.exports =user;
