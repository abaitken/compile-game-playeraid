export class StorageManager {
    constructor() {
        this._allowStore = true;
    }

    storeSelections(value) {
        if(!this._allowStore) {
            return;
        }

        localStorage.setItem("selections", JSON.stringify(value));
    }

    fetchSelections() {
        const content = localStorage.getItem("selections");

        if (!content) {
            return null;
        }

        const result = JSON.parse(content);
        return result;
    }

    suspendSave() {
        this._allowStore = false;
    }

    resumeSave() {
        this._allowStore = true;
    }
}
