export class TooltipHandler {
    constructor(elementId) {
        this.element = document.getElementById(elementId);
        this.element.style.display = 'none';
    }

    show(e, value) {
        this.element.innerText = value;
        this.element.style.display = 'block';
        this.element.style.opacity = 1;
        this.element.style.left = e.clientX + 12 + 'px';
        this.element.style.top = e.clientY + 12 + 'px';
    }

    hide(e) {
        this.element.innerText = '';
        this.element.style.display = 'none';
        this.element.style.opacity = 0;
    }

    subscribe(element, value) {
        const self = this;
        element.addEventListener("mouseenter", (e) => self.show(e, value));
        element.addEventListener("mouseout", (e) => self.hide(e));
    }
}
