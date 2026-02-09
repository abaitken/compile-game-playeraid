import { ProtocolModel } from "./ProtocolModel.js";

class SelectionHandler {
    constructor() {
        this.mySelection = ko.observableArray();
        this.opSelection = ko.observableArray();
        this.selection = ko.pureComputed(function() {
            return this.mySelection().concat(this.opSelection());
        }, this);
    }

    selectForMe(item) {
        if (!this.selection().includes(item) && this.mySelection().length < 3) {
            this.mySelection.push(item);
        } else {
            this.mySelection.remove(item);
        }
    }

    selectForOpponent(item) {
        if (!this.selection().includes(item) && this.opSelection().length < 3) {
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

