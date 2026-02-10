import { FAQViewModel } from './FAQViewModel.js';
import { BindingHandlers } from './BindingHandlers.js';

var root = new FAQViewModel();
window.root = root;

document.addEventListener("DOMContentLoaded", function(event) {
    new BindingHandlers().apply();
    root.init();
});
