import { LitElement, html, css } from "@polymer/lit-element";
import { anchorRoute, gotoRoute } from '../Router'
import Auth from '../Auth'
import App from '../App'

// const template = document.createElement
class SignInSignup extends LitElement {
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
        const dialog = this.shadowRoot.querySelector('.dialog-width');
        const openButton = dialog.nextElementSibling;
        // const closeButton = dialog.querySelector('sl-button[slot="footer"]');

        openButton.addEventListener('click', () => dialog.show());
        // closeButton.addEventListener('click', () => dialog.hide());
    }

    signInSubmitHandler(e) {
        e.preventDefault()
        const formData = e.detail.formData
        const submitBtn = document.querySelector('.submit-btn')
        submitBtn.setAttribute('loading', '')

        // sign in using Auth    
        Auth.signIn(formData, () => {
            submitBtn.removeAttribute('loading')
        })
    }

    render() {
        return html`
        <style>
            .dialog-heading{
                display: flex; 
                align-items: center; 
                justify-content: center; 
                font-size: 1.5rem; 
                font-weight: 400;
            }
        </style>

        <link href="https://fonts.googleapis.com/icon?family=Material+Icons" rel="stylesheet">
            <sl-dialog no-header="true" slot="label" class="dialog-width" style="--width: 50vw;">
            <span class="dialog-heading">Sign in</span>
            <div class="page-content page-centered">
        <div class="signinup-box">
          <div class="material-icons" style="font-size: 5rem;">account_circle</div>          
          <sl-form class="form-signup dark-theme" @sl-submit=${this.signInSubmitHandler}>          
            <div class="input-group">
              <sl-input name="email" type="email" placeholder="Email" required></sl-input>
            </div>
            <div class="input-group">
              <sl-input name="password" type="password" placeholder="Password" required toggle-password></sl-input>
            </div>
            <sl-button class="submit-btn" type="primary" submit style="width: 100%;">Sign In</sl-button>
          </sl-form>
          <p>No Account? <a href="/signup" @click=${anchorRoute}>Sign Up</a></p>
        </div>
      </div>
  <!-- <sl-button slot="footer" type="primary">Close</sl-button> -->
</sl-dialog>

<sl-button>Open Dialog</sl-button>



        <!-- <style>
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
            ${this.path === "icons" ? html`
            <span class="material-icons icon" style="font-size: 2rem;">${this.icon}</span>
            `: html`
            <img class="icon" style="width: auto; height: 40px;" src=${this.icon}></span>
            `}
            <h3>${this.textContent}</h3>
            <div class="active-indicator" part="active-indicator"></div>
        </div> -->
        `
    }
}

customElements.define('aa-signin-signup-panel', SignInSignup)