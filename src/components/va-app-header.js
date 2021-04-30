import { LitElement, html, css } from '@polymer/lit-element'
import { anchorRoute, gotoRoute } from './../Router'
import Auth from './../Auth'
import App from './../App'

customElements.define('va-app-header', class AppHeader extends LitElement {
            constructor() {
                super()
            }

            static get properties() {
                return {
                    title: {
                        type: String
                    },
                    user: {
                        type: Object
                    }
                }
            }

            firstUpdated() {
                super.firstUpdated()
                this.navActiveLinks()
            }

            navActiveLinks() {
                const currentPath = window.location.pathname
                const navLinks = this.shadowRoot.querySelectorAll('.app-top-nav a, .app-side-menu-items a')
                navLinks.forEach(navLink => {
                    if (navLink.href.slice(-1) == '#') return
                    if (navLink.pathname === currentPath) {
                        navLink.classList.add('active')
                    }
                })
            }

            hamburgerClick() {
                const appMenu = this.shadowRoot.querySelector('.app-side-menu')
                appMenu.show()
            }

            menuClick(e) {
                e.preventDefault()
                const pathname = e.target.closest('a').pathname
                const appSideMenu = this.shadowRoot.querySelector('.app-side-menu')
                    // hide appMenu
                appSideMenu.hide()
                appSideMenu.addEventListener('sl-after-hide', () => {
                    // goto route after menu is hidden
                    gotoRoute(pathname)
                })
            }

            render() {
                    return html `
    <style>      
      * {
        box-sizing: border-box;
      }
      .app-header {
        background: rgb(94,85,107);
        position: fixed;
        top: 0;
        right: 0;
        left: 0;
        height: var(--app-header-height);
        color: #fff;
        display: flex;
        justify-content: flex-end; /*Added*/
        z-index: 9;
        box-shadow: 4px 0px 10px rgba(0,0,0,0.2);
        align-items: center;
      }
      

      .app-header-main {
        flex-grow: 1;
        display: flex;
        align-items: center;
      }

      .app-header-main::slotted(h1){
        color: #fff;
      }

      .app-logo a {
        color: #fff;
        text-decoration: none;
        font-weight: bold;
        font-size: 1.2em;
        padding: .6em;
        display: inline-block;        
      }

      .app-logo img {
        width: 90px;
      }
      
      .hamburger-btn::part(base) {
        color: #fff;
      }

      .app-top-nav {
        display: flex;
        height: 100%;
        align-items: center;
      }

      .app-top-nav a {
        display: inline-block;
        padding: .8em;
        text-decoration: none;
        color: #fff;
      }
      
      .app-side-menu-items a {
        display: block;
        padding: .5em;
        text-decoration: none;
        font-size: 1.3em;
        color: #333;
      }

      .app-side-menu-logo {
        width: 120px;
        margin-bottom: 1em;
        position: absolute;
        top: 2em;
        left: 1.5em;
      }

      .page-title {
        color: var(--app-header-txt-color);
        margin-right: 0.5em;
        font-size: var(--app-header-title-font-size);
      }

      /* active nav links */
      .app-top-nav a.active,
      .app-side-menu-items a.active {
        font-weight: bold;
      }

      #bell-icon, #alert-icon{
        color: gray;
      }

      sl-dropdown::part(panel){
        background-color: rgb(94,85,107);
        border: none;
      }

      /* RESPONSIVE - MOBILE ------------------- */
      @media all and (max-width: 768px){       
        
        .app-top-nav {
          display: none;
        }
      }

    </style>

    <header class="app-header">
      <!-- <sl-icon-button class="hamburger-btn" name="list" @click="${this.hamburgerClick}" style="font-size: 1.5em;"></sl-icon-button>       
      
      <div class="app-header-main">
        ${this.title ? html`
          <h1 class="page-title">${this.title}</h1>
        `: ``}
        <slot></slot> -->
      </div>

      <nav class="app-top-nav">
        <!-- <a href="/" @click="${anchorRoute}">Home</a>         -->
        <a slot="trigger" id="bell-icon" href="#" style="display: flex; align-items: center;" @click="${(e) => e.preventDefault()}">
             <sl-icon slot="icon" name="bell" style="font-size: 2rem;"></sl-icon>
          </a>
        <a slot="trigger" id="alert-icon" href="#" style="display: flex; align-items: center;" @click="${(e) => e.preventDefault()}">
             <sl-icon slot="icon" name="exclamation-circle" style="font-size: 2rem;"></sl-icon>
          </a>
        <sl-dropdown>
          <a slot="trigger" href="#" style="display: flex; align-items: center;" @click="${(e) => e.preventDefault()}">
             <sl-icon slot="icon" name="gear-fill" style="font-size: 2rem;"></sl-icon>
          </a>
          <sl-menu>            
            <sl-menu-item @click="${() => gotoRoute('/profile')}">System Status</sl-menu-item>
            <sl-menu-item @click="${() => gotoRoute('/editProfile')}">Logs</sl-menu-item>
          </sl-menu>
        </sl-dropdown>
        <sl-dropdown>
          <a slot="trigger" href="#" @click="${(e) => e.preventDefault()}">
            <sl-avatar style="--size: 2rem;" image=${(this.user && this.user.avatar) ? `${App.apiBase}/images/${this.user.avatar}` : ``}></sl-avatar> ${this.user && this.user.firstName}
          </a>
          <sl-menu>            
            <sl-menu-item @click="${() => gotoRoute('/profile')}">Register User</sl-menu-item>
            <sl-menu-item @click="${() => gotoRoute('/editProfile')}">Manage User</sl-menu-item>
            <sl-menu-item @click="${() => gotoRoute('/profile')}">Register Place</sl-menu-item>
            <sl-menu-item @click="${() => gotoRoute('/editProfile')}">Manage Place</sl-menu-item>
            <sl-menu-item @click="${() => gotoRoute('/profile')}">Register Device</sl-menu-item>
            <sl-menu-item @click="${() => gotoRoute('/editProfile')}">Manage Device</sl-menu-item>
            <sl-menu-item @click="${() => Auth.signOut()}">Sign Out</sl-menu-item>
          </sl-menu>
        </sl-dropdown>
      </nav>
    </header>

    <sl-drawer class="app-side-menu" placement="left">
      <!-- <img class="app-side-menu-logo" src="/images/logo.svg">
      <nav class="app-side-menu-items">
        <a href="/" @click="${this.menuClick}">Home</a>
        <a href="/hairdressers" @click="${this.menuClick}">Find a Hairdresser</a>
        <a href="/haircute" @click="${this.menuClick}">Find a Haircut</a>
        <a href="/favouriteHaircuts" @click="${this.menuClick}">Hairdressers</a>
        <a href="/profile" @click="${this.menuClick}">Profile</a>
        <a href="#" @click="${() => Auth.signOut()}">Sign Out</a> -->
      </nav>  
    </sl-drawer>
    `
  }

})