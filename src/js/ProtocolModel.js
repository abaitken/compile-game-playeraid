export class ProtocolModel {
    constructor(protocol, sets, selection) {

        this.key = protocol.key;
        this.set = sets.find(item => item.key === protocol.set);
        this.name = protocol.name;
        this.keywords = protocol.keywords.join(', ');
        this.cards = protocol.cards;

        this.showCards = ko.observable(false);

        this.selection = selection;

        this.selectionClass = ko.pureComputed(function() {
            if(this.selection.mySelection().includes(this)) {
                return 'my-selected-protocol';
            }
            if(this.selection.opSelection().includes(this)) {
                return 'op-selected-protocol';
            }
            if(this.selection.excluded().includes(this)) {
                return 'excluded-protocol';
            }

            return null;            
        }, this);
    }

    displayCards() {
        this.showCards(!this.showCards());
    }

    hideCards() {
        this.showCards(false);
    }

    selectForMe() {
        this.selection.selectForMe(this);
    }

    selectForOpponent() {
        this.selection.selectForOpponent(this);
    }

    selectExclude() {
        this.selection.selectExclude(this);
    }

    showFAQ(card) {
        commandRouter.showFAQ({
            card: card,
            protocol: {
                name : this.name
            }
        });
    }
};