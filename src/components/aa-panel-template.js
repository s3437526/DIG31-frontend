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
    }

    render() {
            return html `
        <style>
            .container{
                position: relative;
                color: white;
                background: var(--panel-color);
                width: 100%;
                /* min-width: 1024px; */
                height: 100%;
                border-radius: 10px;
                box-shadow: 10px 10px 10px rgba(0, 0, 0, 0.65);
                padding: 0 1.5rem;
                overflow: scroll;
                /* min-width: 500px; */
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

            .body-container{
                height: 100%;
                /* overflow-x: scroll; */
                /* overflow: hidden; */
            }

            .body{
                height: 100%;
                /* overflow-y: scroll; */
            }

      /* RESPONSIVE - MOBILE ------------------- */
      @media all and (max-width: 1024px){  
        /* .container{
            width: 2048px;
        } */
      }

        </style>

        <link href="https://fonts.googleapis.com/icon?family=Material+Icons" rel="stylesheet">
        <div class="container" part="container">
            <slot name="header-title" part="title">
            <div class="header">
                <div>${localStorage.accessLevel == 2 ? html`<div class="material-icons add-icon icon">add</div>` : ``}</div>
                <h2>${this.title}</h2></slot>
                <div>${localStorage.accessLevel == 2 ? html`<div class="material-icons settings-icon icon"></div>` : ``}</div>
            </div>
            <div class="body-container">
                <slot class="table-heading" name="table-heading" part="table-heading"></slot>
                <slot class="body" name="body" part="body"></slot>
            </div>
        </div>
        `
    }
}

customElements.define('aa-panel-template', PanelTemplate)