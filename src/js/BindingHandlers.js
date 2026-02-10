import { marked } from 'https://cdnjs.cloudflare.com/ajax/libs/marked/16.3.0/lib/marked.esm.min.js';
import { TooltipHandler } from './TooltipHandler.js';

export class BindingHandlers {
    apply() {
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
                const classNames = ko.unwrap(valueAccessor());

                if(element._lastApplyClass) {
                    element.classList.remove(element._lastApplyClass);
                    element._lastApplyClass = null;
                }

                if(classNames) {
                    element.classList.add(classNames);
                    element._lastApplyClass = classNames;
                }
            }
        };
    }
}