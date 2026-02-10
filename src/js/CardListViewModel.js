import { FAQModal } from "./FAQModal.js";
import { ProtocolModel } from "./ProtocolModel.js";

export class CardListViewModel {
    constructor() {
        this.data = ko.observable(null);
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

