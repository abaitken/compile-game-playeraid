import { ViewModel } from './ViewModel.js';
import { marked } from '../node_modules/marked/lib/marked.esm.js';

ko.bindingHandlers.markdown = {
    update: function (element, valueAccessor) {
        const value = ko.unwrap(valueAccessor());
        const markup = marked(value)
        element.innerHTML = markup;
    }
};

var root = new ViewModel();
root.init();
