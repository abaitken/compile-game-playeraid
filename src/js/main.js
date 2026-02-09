import { ViewModel } from './ViewModel.js';
import { marked } from '../node_modules/marked/lib/marked.esm.js';
import { TooltipHandler } from './TooltipHandler.js';

ko.bindingHandlers.markdown = {
    update: function (element, valueAccessor) {
        const value = ko.unwrap(valueAccessor());
        const markup = marked(value)
        element.innerHTML = markup;
    }
};

const tooltip = new TooltipHandler("tooltip");

ko.bindingHandlers.tooltip = {
    update: function (element, valueAccessor) {
        const value = ko.unwrap(valueAccessor());
        tooltip.subscribe(element, value);
    }
};

ko.bindingHandlers.applyClasses = {
    update: function (element, valueAccessor) {
        const params = ko.unwrap(valueAccessor());
        const condition = ko.unwrap(params.condition);
        const classNames = params.classNames;
        if(!classNames) {
            throw new Error('Expected classNames property');
        }

        if(condition) {
            element.classList.add(classNames);
        } else {
            element.classList.remove(classNames);
        }
    }
};

var root = new ViewModel();
root.init();
