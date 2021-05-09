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
                border: 1px solid white;
                cursor: pointer;
            }

            .icon{
                padding-left: 1rem;
                display: flex;
                justify-content: center;
                align-items: center;
                /* font-size: 3rem; */
            }

            .icon slot{
                width: 2rem;
            }

            .active-indicator{
                height: 100%; 
                width: 15px; 
                position: absolute; 
                right: 0;
            }

            .active-indicator:active{
                background: white;
            }
        </style>

        <link href="https://fonts.googleapis.com/icon?family=Material+Icons" rel="stylesheet">
            ${console.log(`Inner HTML is: ${this.innerHTML}`)}
            ${console.log(`Icon is: ${this.icon}`)}
            <div class="container" part="container">
            ${this.path === "icons" ? html `
            <span class="material-icons icon" style="font-size: 2rem;">${this.icon}</span>
            `: html `
            <img class="icon" style="width: auto; height: 40px;" src=${this.icon}></span>
            `}
            <!-- <slot class="icon" part="icon-part"></slot> -->
            <!-- <div class="icon" part="icon-part"> -->
                <!-- <slot name="icon-slot"></slot> -->
                <!-- <span class="material-icons">local_florist</span> -->
                <!-- ${this.path == "images" ? html`
                <img src="${App.apiBase}/${this.path}/${this.icon}" alt="${this.textContent} icon"/>
                ` : html `
                <img src="${App.apiBase}/${this.path}/${this.icon}" alt="${this.textContent} icon"/>
                `} -->
            <!-- </div> -->
            <h3>${this.textContent}</h3>
            <div class="active-indicator" part="active-indicator"></div>
        </div>
        `
    }
}

customElements.define('aa-accordion-button', AccordionButton)

/**
 *         <!-- ${console.log(`Path sent in is: ${this.path}`)} -->
        <div class="container" part="container">
            <slot class="icon" part="icon-part"></slot>
            <!-- <div class="icon" part="icon-part"> -->
                <!-- <slot name="icon-slot"></slot> -->
                <!-- <span class="material-icons">local_florist</span> -->
                <!-- ${this.path == "images" ? html`
                <img src="${App.apiBase}/${this.path}/${this.icon}" alt="${this.textContent} icon"/>
                ` : html `
                <img src="${App.apiBase}/${this.path}/${this.icon}" alt="${this.textContent} icon"/>
                `} -->
            <!-- </div> -->
            <h3>${this.textContent}</h3>
            <div class="active-indicator" part="active-indicator"></div>
        </div>
 * 
 */