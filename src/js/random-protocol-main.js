import { RandomProtViewModel } from './RandomProtViewModel.js';
import { BindingHandlers } from './BindingHandlers.js';

var root = new RandomProtViewModel();
window.root = root;
window.commandRouter = root;
document.addEventListener("DOMContentLoaded", function(event) {
    new BindingHandlers().apply();
    root.init();
});
