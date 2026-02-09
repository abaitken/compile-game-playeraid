export class ViewModel {
    constructor() {
        this.data = ko.observable(null);
        this.protocols = ko.computed(function(){
            const data = this.data();

            if(!data) {
                return [];
            }

            return data.protocols;
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

