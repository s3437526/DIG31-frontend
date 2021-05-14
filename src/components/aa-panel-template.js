import { LitElement, html, css } from "@polymer/lit-element";
import { anchorRoute, gotoRoute } from '../Router'
import Auth from '../Auth'
import App from '../App'

// const template = document.createElement
class PanelTemplate extends LitElement {
    constructor() {
        super()
    }

    // element attributes
    static get properties() {
        return {
            title: {
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
            // let button = this.shadowRoot.querySelector('.container')
            // button.addEventListener('click', () => {
            //     this.shadowRoot.querySelector('.active-indicator').classList.toggle('active')
            // })
    }

    render() {
            return html `
        <style>
            .container{
                position: relative;
                color: white;
                background: var(--panel-color);
                width: 100%;
                height: 100%;
                border-radius: 10px;
                box-shadow: 10px 10px 10px rgba(0, 0, 0, 0.65);
                padding: 0 1.5rem;
            }

            .header{
                display: flex;
                justify-content: space-between;
                align-items: center;
                margin-bottom: 1rem;
            }

            .icon{
                cursor: pointer;
            }

        </style>

        <link href="https://fonts.googleapis.com/icon?family=Material+Icons" rel="stylesheet">
        <div class="container" part="container">
        <div class="header">
            ${localStorage.accessLevel == 2 ? html`<div class="material-icons add-icon icon">add</div>` : ``}
            <slot name="header-title" part="title"><h2>${this.title}</h2></slot>
            ${localStorage.accessLevel == 2 ? html`<div class="material-icons settings-icon icon"></div>` : ``}
        </div>
            <slot name="body" part="body"></slot>
        </div>
        `
    }
}

customElements.define('aa-panel-template', PanelTemplate)