import { LitElement, html, css } from "@polymer/lit-element";
import { anchorRoute, gotoRoute } from '../Router'
import Auth from '../Auth'
import App from '../App'

// const template = document.createElement
class SignIn extends LitElement {
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
        const signinDialog = this.shadowRoot.querySelector('.signin-dialog');
        const signupDialog = this.shadowRoot.querySelector('.signup-dialog');
        // const openButton = signinDialog.nextElementSibling;
        // const closeButton = signinDialog.querySelector('sl-button[slot="footer"]');

        // openButton.addEventListener('click', () => signinDialog.show());
        // closeButton.addEventListener('click', () => signinDialog.hide());
        signinDialog.addEventListener('sl-overlay-dismiss', event => event.preventDefault());
        // console.log(`Current user is: ${Auth.currentUser._id}`)

        if (typeof Auth.currentUser.accessLevel === 'undefined') signinDialog.show() // keep?

        const toggleDialogs = this.shadowRoot.querySelector('.toggle-dialogs')
        toggleDialogs.addEventListener('click', () => {
            // signinDialog.hide()
            // // console.log("Hiding sigin dialog")
            // signupDialog.show()

            signinDialog.open() ? signinDialog.hide() : signinDialog.show()
            signupDialog.open() ? signupDialog.hide() : signupDialog.show()
        })
    }

    signInSubmitHandler(e) {
        e.preventDefault()
        const signinDialog = this.shadowRoot.querySelector('.signin-dialog');
        const formData = e.detail.formData
        const submitBtn = this.shadowRoot.querySelector('.submit-btn')
        submitBtn.setAttribute('loading', '')
            // sign in using Auth    
        Auth.signIn(formData, () => {
            submitBtn.removeAttribute('loading')
        })
        console.log(localStorage.accessLevel)
        if (localStorage.accessLevel >= 1) {
            console.log("Valid id")
            signinDialog.hide()
            submitBtn.removeAttribute('loading')
                // this.hide()
        }
    }

    render() {
            return html `
        <style>
            .dialog-heading{
                display: flex; 
                align-items: center; 
                justify-content: center; 
                font-size: 1.5rem; 
                font-weight: 900;
                color: white;
            }

            .flex-center{
                display:flex;
                align-items: center;
                justify-content: center;
            }

            sl-dialog::part(panel){
                background: var(--dialog-background);
            }

            .pad-bottom{
                padding-bottom: 20px;
            }

            .signin-dialog{
                display: none;
            }

            .signup-dialog{
                display:block;
            }

        </style>

        <link href="https://fonts.googleapis.com/icon?family=Material+Icons" rel="stylesheet">
            <!-- <sl-dialog no-header="true" slot="label" class="signin-dialog" style="--width: 30vw;">
            <span class="dialog-heading">Sign in</span>
            <div class="page-content page-centered">
                <div class="signinup-box">
                <div class="flex-center">
                    <div class="material-icons" style="font-size: 8rem; margin: 1rem; color: white;">account_circle</div>          
                </div>
                <sl-form class="form-signup dark-theme" @sl-submit=${this.signInSubmitHandler}>          
                    <div class="input-group">
                    <sl-input class="pad-bottom" name="email" type="email" placeholder="Email" required></sl-input>
                    </div>
                    <div class="input-group">
                    <sl-input class="pad-bottom" name="password" type="password" placeholder="Password" required toggle-password></sl-input>
                    </div>
                    <sl-button class="submit-btn" type="primary" submit style="width: 100%;">Sign In</sl-button>
                </sl-form>
                <p>No Account? <span class="toggle-dialogs">Sign Up</span></p>
                </div>
            </div>
            </sl-dialog> -->
            <sl-dialog no-header="true" slot="label" class="signup-dialog" style="--width: 30vw;">
            <span class="dialog-heading">Sign up</span>
            <div class="page-content page-centered">
                <div class="signupup-box">
                    <div class="flex-center">
                        <div class="material-icons" style="font-size: 8rem; margin: 1rem; color: white;">account_circle</div>          
                    </div>
                    <sl-form class="form-signup" @sl-submit=${this.signUpSubmitHandler}>
                        <div class="input-group">
                            <sl-input name="firstName" type="text" placeholder="First Name" required></sl-input>
                        </div>
                        <div class="input-group">
                            <sl-input name="lastName" type="text" placeholder="Last Name" required></sl-input>
                        </div>
                        <div class="input-group">
                            <sl-input name="email" type="email" placeholder="Email" required></sl-input>
                        </div>
                        <div class="input-group">
                            <sl-input name="password" type="password" placeholder="Password" required toggle-password></sl-input>
                        </div>            
                        <div class="input-group">
                            <sl-select name="accessLevel" placeholder="I am a ...">
                                <sl-menu-item value="1">Customer</sl-menu-item>
                                <sl-menu-item value="2">Hairdresser</sl-menu-item>
                            </sl-select>
                        </div>         
                        <sl-button type="primary" class="submit-btn" submit style="width: 100%;">Sign Up</sl-button>
                    </sl-form>
                    <p>No Account? <span class="toggle-dialogs">Sign Up</span></p>
                </div>
            </div>
            </sl-dialog>




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

<!-- 


        <style>
            .dialog-heading{
                display: flex; 
                align-items: center; 
                justify-content: center; 
                font-size: 1.5rem; 
                font-weight: 900;
                color: white;
            }

            /* .dialog__body::part(body){
                display:none;
            } */

            .flex-center{
                display:flex;
                align-items: center;
                justify-content: center;
            }

            sl-dialog::part(panel){
                background: var(--dialog-background);
            }

            .pad-bottom{
                padding-bottom: 20px;
            }
        </style>

        <link href="https://fonts.googleapis.com/icon?family=Material+Icons" rel="stylesheet">
            <sl-dialog no-header="true" slot="label" class="signup-dialog" style="--width: 30vw;">
            <span class="dialog-heading">Sign up</span>
            <div class="page-content page-centered">
                <div class="signupup-box">
                    <div class="flex-center">
                        <div class="material-icons" style="font-size: 8rem; margin: 1rem; color: white;">account_circle</div>          
                    </div>
                    <sl-form class="form-signup" @sl-submit=${this.signUpSubmitHandler}>
                        <div class="input-group">
                            <sl-input name="firstName" type="text" placeholder="First Name" required></sl-input>
                        </div>
                        <div class="input-group">
                            <sl-input name="lastName" type="text" placeholder="Last Name" required></sl-input>
                        </div>
                        <div class="input-group">
                            <sl-input name="email" type="email" placeholder="Email" required></sl-input>
                        </div>
                        <div class="input-group">
                            <sl-input name="password" type="password" placeholder="Password" required toggle-password></sl-input>
                        </div>            
                        <div class="input-group">
                            <sl-select name="accessLevel" placeholder="I am a ...">
                                <sl-menu-item value="1">Customer</sl-menu-item>
                                <sl-menu-item value="2">Hairdresser</sl-menu-item>
                            </sl-select>
                        </div>         
                        <sl-button type="primary" class="submit-btn" submit style="width: 100%;">Sign Up</sl-button>
                    </sl-form>
                    <p>No Account? <span class="toggle-dialogs">Sign Up</span></p>
                </div>
            </div>
</sl-dialog> -->
        `
    }
}

customElements.define('aa-signin-dialog', SignIn)