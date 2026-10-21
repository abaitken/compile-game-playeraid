import { marked } from 'https://cdnjs.cloudflare.com/ajax/libs/marked/18.1.1/lib/marked.esm.min.js';

let TOPIC_ROOT = 'topics/';

export class FAQViewModel {
    constructor() {        
        this.topicContent = ko.observable(`
# No topic loaded
        `);
    }
    
    // NOTE : Couldn't get the markdown renderer to work
    async preparse(markdown) {
        const regex = /\{%([^%]+)%\}/g;

        let subject = markdown;
        let match;
        while ((match = regex.exec(subject)) !== null) {
            const file = match[1].trim();

            const content = await fetch(TOPIC_ROOT + file)
                .then(r => r.text());

            subject = subject.replace(match[0], content + '\n');
        }

        return subject;
    }
    
    loadtopic(id) {
        let self = this;
        fetch(`${TOPIC_ROOT}${id}.md`)
            .then(response => {
                if (!response.ok) {
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }
                return response.text();
            })
            .then(data => {
                return self.preparse(data);
            })
            .then(data => {
                this.topicContent(data);
            })
            .catch(err => {
                console.error('Failed to load JSON:', err);
            });
    }
    
    navigationChanged(hash) {
        this.loadtopic(hash.replace("#", ""));
    }

    init() {        
        const renderer = new marked.Renderer();

        renderer.link = function({ href, title, tokens }) {
            if (href.endsWith(".md")) {
                href = "#" + href.replace(".md", "");
            }

            const text = this.parser.parseInline(tokens);

            return `<a href="${href}"${title ? ` title="${title}"` : ""}>${text}</a>`;
        };

        marked.setOptions({ renderer });
        
        ko.bindingHandlers.markdown = {
            update: function (element, valueAccessor) {
                const value = ko.unwrap(valueAccessor());
                const markup = marked(value);
                element.innerHTML = markup;
            }
        };
        
        ko.applyBindings(this);
        this.loadtopic('index');
    }
}

