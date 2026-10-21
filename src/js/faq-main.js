import { FAQViewModel } from './FAQViewModel.js';
import { BindingHandlers } from './BindingHandlers.js';

var root = new FAQViewModel();
window.root = root;

document.addEventListener("DOMContentLoaded", function(event) {
    root.init();
});

window.onhashchange = function () {
    root.navigationChanged(window.location.hash);
};
