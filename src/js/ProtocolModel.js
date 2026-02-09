export class ProtocolModel {
    constructor(protocol, sets, selection) {

        this.set = sets.find(item => item.key === protocol.set);
        this.name = protocol.name;
        this.keywords = protocol.keywords.join(', ');
        this.cards = protocol.cards;

        this.showCards = ko.observable(false);

        this.selection = selection;
        this.selected = ko.pureComputed({
            read: () => this.selection.items().includes(this),
            write: (value) => {
                if(value) {
                    this.selection.select(this)
                } else {
                    this.selection.unselect(this)
                }
            }
        }, this);
    }

    displayCards() {
        this.showCards(!this.showCards());
    }

    select() {
        this.selected(!this.selected());
    }
};