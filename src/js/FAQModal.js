import { Modal } from "./Modal.js";

export class FAQModal extends Modal {
    constructor() {
        super("faq-modal");
        this.card = ko.observable(null);
        this.protocol = ko.observable(null);
        this.title = ko.pureComputed(function () {
            const card = this.card();
            const protocol = this.protocol();

            if (!card || !protocol) {
                return '';
            }

            return `FAQ - ${protocol.name} ${card.value}`;
        }, this);

        this.faq = ko.pureComputed(function () {
            const card = this.card();

            if (!card) {
                return [];
            }

            return card.faq;
        }, this);
    }

    onOpen(args) {
        this.card(args.card);
        this.protocol(args.protocol);
    }

    onClose() {
        this.card(null);
        this.protocol(null);
    }
}
