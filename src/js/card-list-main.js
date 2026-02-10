import { CardListViewModel } from './CardListViewModel.js';
import { BindingHandlers } from './BindingHandlers.js';

var root = new CardListViewModel();
window.root = root;
window.commandRouter = root;
document.addEventListener("DOMContentLoaded", function(event) {
    new BindingHandlers().apply();
    root.init();
});
