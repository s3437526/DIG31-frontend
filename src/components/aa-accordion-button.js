import { LitElement, html, css } from "@polymer/lit-element";
import { anchorRoute, gotoRoute } from '../Router'
import Auth from '../Auth'
import App from '../App'
// import { registerIconLibrary } from '/dist/shoelace.js';

class AccordionButton extends LitElement {
    constructor() {
        super()
    }

    // element attributes
    static get properties() {
        return {
            textContent: {
                type: String
            },
            icon: {
                type: String
            },
            path: {
                type: String
            }
        }
    }

    firstUpdated() {
        super.firstUpdated()
    }

    render() {
            return html `
        <style>
            h3{
                margin: 1rem;
            }

            .container{
                border-bottom: 1px solid;
                color: white;
                background: var(--brand-color);
                width: 100%;
                display: flex;
                justify-content: flex-start;
                align-items: center;
                /* padding-left: 1rem; */
            }

            .container:hover{
                color: var(--brand-color);
                background: white;
                border: 1px solid white;
                cursor: pointer;
            }

            .icon{
                padding-left: 1rem;
            }

            .icon img{
                width: 2rem;
            }

            .icon img:hover{
                width: 2rem;
                color: var(--brand-color)
            }

            .icon:hover{
                /* color: var(--brand-color); */
                /* background: white; */
            }
        </style>

        <div class="container">
            <div class="icon">
                ${html`<img src="${App.apiBase}/${this.path}/${this.icon}" alt="${this.textContent} icon"/>`}
            </div>
            <h3>${this.textContent}</h3>
        </div>
        `
    }
}

customElements.define('aa-accordion-button', AccordionButton)