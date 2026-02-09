export class SelectionHandler {
    constructor() {
        this.mySelection = ko.observableArray();
        this.opSelection = ko.observableArray();
        this.excluded = ko.observableArray();
        this.included = ko.pureComputed(function () {
            return this.mySelection().concat(this.opSelection());
        }, this);
        this.selection = ko.pureComputed(function () {
            return this.included().concat(this.excluded());
        }, this);
    }

    includes(item) {
        return this.selection().includes(item);
    }

    selectForMe(item) {
        if (!this.includes(item) && this.mySelection().length < 3) {
            this.mySelection.push(item);
        } else {
            this.mySelection.remove(item);
        }
    }

    selectForOpponent(item) {
        if (!this.includes(item) && this.opSelection().length < 3) {
            this.opSelection.push(item);
        } else {
            this.opSelection.remove(item);
        }
    }

    selectExclude(item) {
        if (!this.includes(item)) {
            this.excluded.push(item);
        } else {
            this.excluded.remove(item);
        }
    }

    clear() {
        this.mySelection.removeAll();
        this.opSelection.removeAll();
    }

    serialize() {
        const result = {
            my: this.mySelection().map(item => item.key),
            op: this.opSelection().map(item => item.key),
            ex: this.excluded().map(item => item.key)
        };

        return result;
    }
}
