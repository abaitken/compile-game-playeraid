import { ProtocolModel } from "./ProtocolModel.js";

class SelectionHandler {
    constructor() {
        this.mySelection = ko.observableArray();
        this.opSelection = ko.observableArray();
        this.selection = ko.pureComputed(function () {
            return this.mySelection().concat(this.opSelection());
        }, this);

        this.count = ko.pureComputed(function () {
            return this.selection().length;
        }, this);
    }

    includes(item) {
        return this.selection().includes(item);
    }

    selectForMe(item) {
        if (!this.includes(item) && this.mySelection().length < 3) {
            this.mySelection.push(item);
        } else {
            this.mySelection.remove(item);
        }
    }

    selectForOpponent(item) {
        if (!this.includes(item) && this.opSelection().length < 3) {
            this.opSelection.push(item);
        } else {
            this.opSelection.remove(item);
        }
    }

    clear() {
        this.mySelection.removeAll();
        this.opSelection.removeAll();
    }
}

export class ViewModel {
    constructor() {
        this.data = ko.observable(null);
        this.selectionHandler = new SelectionHandler();
        this.protocols = ko.computed(function () {
            const data = this.data();

            if (!data) {
                return [];
            }

            return data.protocols.map(item => new ProtocolModel(item, data.sets, this.selectionHandler));
        }, this);
    }

    clearAllSelections() {
        this.selectionHandler.clear();
    }

    hideAllCards() {
        for (let index = 0; index < this.protocols().length; index++) {
            const protocol = this.protocols()[index];
            protocol.hideCards();
        }
    }

    pickRandomly() {

        if (this.selectionHandler.count() >= 6) {
            return;
        }

        const shuffled = [...this.protocols()].sort(() => Math.random() - 0.5);
        let index = 0;

        while (this.selectionHandler.count() <= 6 && index < shuffled.length) {
            const item = shuffled[index];

            if (!this.selectionHandler.includes(item)) {
                if (this.selectionHandler.mySelection().length < 3) {
                    this.selectionHandler.selectForMe(item);
                } else if (this.selectionHandler.opSelection().length < 3) {
                    this.selectionHandler.selectForOpponent(item);
                }
            }

            index++;
        }
    }

    init() {
        ko.applyBindings(this);

        fetch('data.json')
            .then(response => {
                if (!response.ok) {
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }
                return response.json();
            })
            .then(data => {
                this.data(data);
            })
            .catch(err => {
                console.error('Failed to load JSON:', err);
            });
    }
}

