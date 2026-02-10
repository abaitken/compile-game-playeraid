export class Modal {
    constructor(elementId) {
        this.element = document.getElementById(elementId);
    }

    open(args) {
        this.element.style.display = 'block';
        this.onOpen(args);
    }

    onOpen(args) {
    }

    close() {
        this.element.style.display = 'none';
        this.onClose();
    }

    onClose() {
    }
}
