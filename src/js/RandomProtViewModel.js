import { FAQModal } from "./FAQModal.js";
import { ProtocolModel } from "./ProtocolModel.js";
import { SelectionHandler } from "./SelectionHandler.js";
import { StorageManager } from "./StorageManager.js";

export class RandomProtViewModel {
    constructor() {
        this.store = new StorageManager();
        this.data = ko.observable(null);
        this.selectionHandler = new SelectionHandler();
        this.selectionHandler.selection.subscribe(function () {
            this.store.storeSelections(this.selectionHandler.serialize());
        }, this);
        this.protocols = ko.computed(function () {
            const data = this.data();

            if (!data) {
                return [];
            }

            return data.protocols.map(item => new ProtocolModel(item, data.sets, this.selectionHandler));
        }, this);

        this.faqModal = new FAQModal(this.data);
    }

    showFAQ(args) {
        this.faqModal.open(args);
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

        const shuffled = this.protocols()
            .filter(item => !this.selectionHandler.includes(item))
            .sort(() => Math.random() - 0.5);
        let index = 0;

        while (this.selectionHandler.included().length <= 6 && index < shuffled.length) {
            const item = shuffled[index];

            if (this.selectionHandler.mySelection().length < 3) {
                this.selectionHandler.selectForMe(item);
            } else if (this.selectionHandler.opSelection().length < 3) {
                this.selectionHandler.selectForOpponent(item);
            }

            index++;
        }
    }

    restoreData() {
        const data = this.store.fetchSelections();

        if (!data) {
            return;
        }

        this.store.suspendSave();
        const protocols = this.protocols();
        for (let index = 0; index < protocols.length; index++) {
            const protocol = protocols[index];

            if (data.my.includes(protocol.key)) {
                protocol.selectForMe();
                continue;
            }

            if (data.op.includes(protocol.key)) {
                protocol.selectForOpponent();
                continue;
            }

            if (data.ex.includes(protocol.key)) {
                protocol.selectExclude();
                continue;
            }
        }
        this.store.resumeSave();
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
                this.restoreData();
            })
            .catch(err => {
                console.error('Failed to load JSON:', err);
            });
    }
}

