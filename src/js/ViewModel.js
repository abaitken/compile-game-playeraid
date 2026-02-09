import { ProtocolModel } from "./ProtocolModel.js";
import { SelectionHandler } from "./SelectionHandler.js";

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

        if (this.selectionHandler.included().length >= 6) {
            return;
        }

        const shuffled = [...this.protocols()].sort(() => Math.random() - 0.5);
        let index = 0;

        while (this.selectionHandler.included().length <= 6 && index < shuffled.length) {
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

