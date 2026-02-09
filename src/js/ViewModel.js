import { ProtocolModel } from "./ProtocolModel.js";

class SelectionHandler {
    constructor() {
        this.items = ko.observableArray();
    }

    select(item) {
        if (!this.items().includes(item) && this.items().length < 3) {
            this.items.push(item);
        }
    }

    unselect(item) {
        this.items.remove(item);
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

