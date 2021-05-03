import { LitElement, html, css } from '@polymer/lit-element'
import { anchorRoute, gotoRoute } from './../Router'
import Auth from './../Auth'
import App from './../App'
import FetchAPI from '../FetchAPI'

// async function getPlaces() {
//     const places = await fetch('localhost:3000/places')
//     console.log(places)
// }

// FetchAPI.getPlacesAsync()
console.log(`Current user is: ${JSON.stringify((Auth.getCurrentUser))}`)

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
        justify-content: flex-end;
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
        font-size: 2.5em;
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

      sl-drawer::part(panel){
        background-color: rgb(94,85,107);
        --size: 15em;
        overflow-y:hidden;
      }

      sl-drawer::part(body){
        /* overflow:hidden; */
        padding: 0;
        
        /* overflow:scroll; */
      }
      
      sl-drawer::part(overlay){
        background: transparent;
      }

      sl-drawer::part(close-button){
        color:white;
      }

      .sidenav-content{
        display:flex; 
        flex-direction:column; 
        align-items:center; 
        height: 100%; 
        justify-content: space-between;
      }

      .bottom-menus{
        width: 100%;
      }

      .app-side-menu-items a {
        display: block;
        padding: .5em;
        text-decoration: none;
        font-size: 1.3em;
        color: var(--app-header-txt-color);
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
      
      sl-icon{
        color:white;
      }

      #bell-icon, #bell-icon-sidenav, #alert-icon, #alert-icon-sidenav, .bi-bell{
        color: gray;
      }

      sl-dropdown::part(panel){
        background-color: rgb(94,85,107);
        border: none;
        max-height: 100vh;
        border-radius:  0 0 5px 5px;
      }

      sl-menu.left-menu::part(base){
        border: 1px solid #fff;
        border-radius: 5px;
      }

      sl-menu-item::part(base){
        color: #fff;
      }

      sl-menu-item::part(base):hover{
        color: rgb(94,85,107);
      } 

      sl-avatar::part(base){
        --size: 2rem;
        color:white;
      }
      
      .dropdown-icon{
        font-size: 2rem;

      }.settings-icon{
        font-size: 1.5rem; 
        position:relative; 
        top:-25%; 
        left: -15%; 
        margin-right:0;
      }

      .add-icon{
        font-size: 1rem; 
        position:relative; 
        top:-25%; 
        left: -5%;
      }

      .manage-place{
        font-size: 1rem; 
        position:relative; 
        top:-25%; 
        left: -5%;
      }

      .manage-device{
        font-size: 1.5rem; 
        position:relative; 
        top:-25%; 
        left: -5%; 
        margin-right:0;
      }

      .add-device{
        font-size: 1rem; 
        position:relative; 
        top:-25%; 
        left: 0;
      }

      .signout-icon{
        font-size: 2rem;
        left: 10%;
        margin-right:1.5rem;
      }

      .app-side-nav{
        display:none;
      }

      /* RESPONSIVE - MOBILE ------------------- */
      @media all and (max-width: 768px){       
        
        .app-top-nav {
          display: none;
        }

        .app-side-nav{
          display:flex;
          align-items: center;
          justify-content: space-evenly;
        }
      }

    </style>

    <header class="app-header" style="display:flex; justify-content: space-between; align-items:center;">
      <div class="left-navs">
        <sl-icon-button class="hamburger-btn" name="list" @click="${this.hamburgerClick}"></sl-icon-button>       
      </div>

      <!-- <div class="app-header-main">
        ${this.title ? html`
          <h1 class="page-title">${this.title}</h1>
        `: ``}
        <slot></slot>
      </div> -->
      <div class="right-navs">
        <nav class="app-top-nav">
          <!-- <a href="/" @click="${anchorRoute}">Home</a>         -->
          <a slot="trigger" href="#" style="display: flex; align-items: center;" @click="${(e) => e.preventDefault()}">
              <sl-icon id="bell-icon" slot="icon" name="bell" style="font-size: 2rem;"></sl-icon>
            </a>
          <a slot="trigger" href="#" style="display: flex; align-items: center;" @click="${(e) => e.preventDefault()}">
              <sl-icon id="alert-icon" slot="icon" name="exclamation-circle" style="font-size: 2rem;"></sl-icon>
            </a>
          <sl-dropdown>
            <a slot="trigger" href="#" style="display: flex; align-items: center;" @click="${(e) => e.preventDefault()}">
              <sl-icon slot="icon" name="gear-fill" style="font-size: 1.9rem;"></sl-icon>
            </a>
            <sl-menu>            
              <sl-menu-item @click="${() => gotoRoute('/profile')}"><sl-icon class="dropdown-icon" slot="prefix" name="wifi"></sl-icon>System Status</sl-menu-item>
              <sl-menu-item @click="${() => gotoRoute('/editProfile')}"><sl-icon class="dropdown-icon" slot="prefix" name="list-ul"></sl-icon>Logs</sl-menu-item>
            </sl-menu>
          </sl-dropdown>
          <sl-dropdown distance="0" class="dropdowns">
            <a slot="trigger" href="#" @click="${(e) => e.preventDefault()}">
              <sl-avatar image=${(this.user && this.user.avatar) ? `${App.apiBase}/images/${this.user.avatar}` : ``}></sl-avatar> ${this.user && this.user.firstName}
            </a>
            <sl-menu>            
            ${Auth.currentUser.accessLevel == 2 ? html`
              <sl-menu-item @click="${() => gotoRoute('/profile')}">
                <sl-icon class="dropdown-icon" slot="prefix" name="person"></sl-icon>
                <sl-icon class="settings-icon" slot="prefix" name="plus"></sl-icon>
                  Register User
              ` : ``}
              </sl-menu-item>
              <sl-menu-item @click="${() => gotoRoute('/editProfile')}">
                <sl-icon class="dropdown-icon" slot="prefix" name="person"></sl-icon>
                <sl-icon class="add-icon" slot="prefix" name="gear-fill"></sl-icon>
                  Manage Account
              </sl-menu-item>
              ${Auth.currentUser.accessLevel == 2 ? html`
              <sl-menu-divider></sl-menu-divider>
                <sl-menu-item @click="${() => gotoRoute('/profile')}">
                  <sl-icon class="dropdown-icon" slot="prefix" name="house-door"></sl-icon>
                  <sl-icon class="settings-icon" slot="prefix" name="plus"></sl-icon>
                    Register Place
                </sl-menu-item>
              <sl-menu-item @click="${() => gotoRoute('/editProfile')}">
                <sl-icon class="dropdown-icon" slot="prefix" name="house-door"></sl-icon>
                <sl-icon class="manage-place" slot="prefix" name="gear-fill"></sl-icon>
                  Manage Place
              </sl-menu-item>
              <sl-menu-divider></sl-menu-divider>
              <sl-menu-item @click="${() => gotoRoute('/profile')}">
                <sl-icon class="dropdown-icon" slot="prefix" name="broadcast"></sl-icon>
                <sl-icon class="manage-device" slot="prefix" name="plus"></sl-icon>
                  Register Device
              </sl-menu-item>
              <sl-menu-item @click="${() => gotoRoute('/editProfile')}">
                <sl-icon class="dropdown-icon" slot="prefix" name="broadcast"></sl-icon>
                <sl-icon class="add-device" slot="prefix" name="gear-fill"></sl-icon>
                  Manage Device
              </sl-menu-item>
              <sl-menu-divider></sl-menu-divider>
              ` : ``}
              <sl-menu-item @click="${() => Auth.signOut()}">
                <sl-icon class="signout-icon" slot="prefix" name="box-arrow-right"></sl-icon>
                  Sign Out
              </sl-menu-item>
            </sl-menu>
          </sl-dropdown>
        </nav>
      </div>
    </header>
    <sl-drawer class="app-side-menu" placement="left">
      <div class="sidenav-content">
        <div class="top-menus">
          <!-- <img class="app-side-menu-logo" src="/images/logo.svg"> -->
          <nav class="app-side-menu-items">
            <a href="/" @click="${this.menuClick}">Dashboard</a>
            <a href="/hairdressers" @click="${this.menuClick}">Find a Hairdresser</a>
            <a href="/haircute" @click="${this.menuClick}">Find a Haircut</a>
            <a href="/favouriteHaircuts" @click="${this.menuClick}">Hairdressers</a>
            <a href="/profile" @click="${this.menuClick}">Profile</a>
            <a href="#" @click="${() => Auth.signOut()}">Sign Out</a>
          </nav>  
        </div>
        <!--  -->
        <div>
          <div class="details-group-example">
            <sl-details summary="Places">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna
              aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
            </sl-details>

            <sl-details summary="Devices">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna
              aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
            </sl-details>

            <sl-details summary="Users">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna
              aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
            </sl-details>
          </div>

          <script>
            const container = document.querySelector('.details-group-example');

            // Close all other details when one is shown
            container.addEventListener('sl-show', event => {
              [...container.querySelectorAll('sl-details')].map(details => (details.open = event.target === details));
            });
          </script>

          <style>
            .details-group-example sl-details:not(:last-of-type) {
              margin-bottom: var(--sl-spacing-xx-small);
            }
          </style>
        </div>
        <!--  -->
        <div class="bottom-menus">
          <nav class="app-side-nav">
            <!-- <a href="/" @click="${anchorRoute}">Home</a>         -->
            <a slot="trigger" href="#" style="display: flex; align-items: center;" @click="${(e) => e.preventDefault()}">
                <sl-icon id="bell-icon-sidenav" slot="icon" name="bell" style="font-size: 2rem;"></sl-icon>
              </a>
            <a slot="trigger" href="#" style="display: flex; align-items: center;" @click="${(e) => e.preventDefault()}">
                <sl-icon id="alert-icon-sidenav" slot="icon" name="exclamation-circle" style="font-size: 2rem;"></sl-icon>
              </a>
            <sl-dropdown skidding="-109" distance="10">
              <a slot="trigger" href="#" style="display: flex; align-items: center;" @click="${(e) => e.preventDefault()}">
                <sl-icon slot="icon" name="gear-fill" style="font-size: 2rem;"></sl-icon>
              </a>
              <sl-menu class="left-menu">            
                <sl-menu-item @click="${() => gotoRoute('/profile')}"><sl-icon class="dropdown-icon" slot="prefix" name="wifi"></sl-icon>System Status</sl-menu-item>
                <sl-menu-item @click="${() => gotoRoute('/editProfile')}"><sl-icon class="dropdown-icon" slot="prefix" name="list-ul"></sl-icon>Logs</sl-menu-item>
              </sl-menu>
            </sl-dropdown>
            <sl-dropdown skidding="-171" distance="10" class="dropdowns-left">
              <a slot="trigger" href="#" @click="${(e) => e.preventDefault()}">
                <sl-avatar image=${(this.user && this.user.avatar) ? `${App.apiBase}/images/${this.user.avatar}` : ``}>
              </a>
              <sl-menu class="left-menu">            
                ${Auth.currentUser.accessLevel == 2 ? html`
                  <sl-menu-item @click="${() => gotoRoute('/profile')}">
                    <sl-icon class="dropdown-icon" slot="prefix" name="person"></sl-icon>
                    <sl-icon class="settings-icon" slot="prefix" name="plus"></sl-icon>
                      Register User
                  ` : ``}
                  </sl-menu-item>
                  <sl-menu-item @click="${() => gotoRoute('/editProfile')}">
                    <sl-icon class="dropdown-icon" slot="prefix" name="person"></sl-icon>
                    <sl-icon class="add-icon" slot="prefix" name="gear-fill"></sl-icon>
                      Manage Account
                  </sl-menu-item>
                  ${Auth.currentUser.accessLevel == 2 ? html`
                  <sl-menu-divider></sl-menu-divider>
                    <sl-menu-item @click="${() => gotoRoute('/profile')}">
                      <sl-icon class="dropdown-icon" slot="prefix" name="house-door"></sl-icon>
                      <sl-icon class="settings-icon" slot="prefix" name="plus"></sl-icon>
                        Register Place
                    </sl-menu-item>
                  <sl-menu-item @click="${() => gotoRoute('/editProfile')}">
                    <sl-icon class="dropdown-icon" slot="prefix" name="house-door"></sl-icon>
                    <sl-icon class="manage-place" slot="prefix" name="gear-fill"></sl-icon>
                      Manage Place
                  </sl-menu-item>
                  <sl-menu-divider></sl-menu-divider>
                  <sl-menu-item @click="${() => gotoRoute('/profile')}">
                    <sl-icon class="dropdown-icon" slot="prefix" name="broadcast"></sl-icon>
                    <sl-icon class="manage-device" slot="prefix" name="plus"></sl-icon>
                      Register Device
                  </sl-menu-item>
                  <sl-menu-item @click="${() => gotoRoute('/editProfile')}">
                    <sl-icon class="dropdown-icon" slot="prefix" name="broadcast"></sl-icon>
                    <sl-icon class="add-device" slot="prefix" name="gear-fill"></sl-icon>
                      Manage Device
                  </sl-menu-item>
                  <sl-menu-divider></sl-menu-divider>
                  ` : ``}
                  <sl-menu-item @click="${() => Auth.signOut()}">
                    <sl-icon class="signout-icon" slot="prefix" name="box-arrow-right"></sl-icon>
                      Sign Out
                  </sl-menu-item>
              </sl-menu>
            </sl-dropdown>
          </nav>
        </div>
      </div>
    </sl-drawer>
    `
  }

})