class Room {
    get history() {
        return this._history;
    }

    set history(value) {
        this._history = value;
    }
    get userList() {
        return this._userList;
    }

    set userList(value) {
        this._userList = value;
    }
    get amount() {
        return this._amount;
    }

    set amount(value) {
        this._amount = value;
    }
    constructor() {
        this._amount = 0;
        this._userList = [];
        this._history = [];
    }
}

const room = new Room();
module.exports = room;