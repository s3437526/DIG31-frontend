import { LitElement, html, css } from "@polymer/lit-element";
import { anchorRoute, gotoRoute } from '../Router'
import Auth from '../Auth'
import App from '../App'

// const template = document.createElement
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
            },
            active: {
                type: String
            }
        }
    }

    firstUpdated() {
        super.firstUpdated()
        let button = this.shadowRoot.querySelector('.container')
        button.addEventListener('click', () => {
            this.shadowRoot.querySelector('.active-indicator').classList.toggle('active')
        })
    }

    render() {
            return html `
        <style>
            h3{
                margin: 1rem;
            }

            .container{
                position: relative;
                border-bottom: 1px solid;
                color: white;
                background: var(--brand-color);
                width: 100%;
                height: 100%;
                display: flex;
                justify-content: flex-start;
                align-items: center;
            }

            .container:hover{
                color: var(--brand-color);
                background: white;
                border: 0 1px 1px 1px solid white;
                cursor: pointer;
            }

            .icon{
                padding-left: 2rem;
                display: flex;
                justify-content: center;
                align-items: center;
            }

            .icon slot{
                width: 2rem;
            }

            .active-indicator{
                height: 100%; 
                width: 10px; 
                position: absolute; 
                right: 0;
            }

            .active-indicator.active{
                background: white;
            }
        </style>

        <link href="https://fonts.googleapis.com/icon?family=Material+Icons" rel="stylesheet">
            <div class="container" part="container">
            ${this.path === "icons" ? html `
            <span class="material-icons icon" style="font-size: 2rem;">${this.icon}</span>
            `: html `
            <img class="icon" style="width: auto; height: 40px;" src=${this.icon}></span>
            `}
            <h3>${this.textContent}</h3>
            <div class="active-indicator" part="active-indicator"></div>
        </div>
        `
    }
}

customElements.define('aa-accordion-button', AccordionButton)