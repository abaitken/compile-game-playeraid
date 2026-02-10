class CardModel {
    constructor(protocol, card, rules) {
        this.protocol = protocol;
        this.card = card;
        this.faq = (!card.faq) ? [] : card.faq.map(item => rules[item]);
    }
}

export class FAQViewModel {
    constructor() {
        this.data = ko.observable(null);
        this.cards = ko.pureComputed(function() {
            const data = this.data();
            if(!data) {
                return [];
            }

            let result = [];

            for (let index = 0; index < data.protocols.length; index++) {
                const protocol = data.protocols[index];
                
                for (let index = 0; index < protocol.cards.length; index++) {
                    const card = protocol.cards[index];
                    
                    result.push(new CardModel(protocol, card, data.rules));
                }
            }

            return result;
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

