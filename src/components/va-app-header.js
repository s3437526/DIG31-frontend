import { LitElement, html, css } from '@polymer/lit-element'
import { anchorRoute, gotoRoute } from './../Router'
import Auth from './../Auth'
import App from './../App'
import FetchAPI from '../FetchAPI'


let places, items, users = [{}]
let collections = [{ places, items, users }]
    //const listButton = (item) => { html `<h3>${item}</h3>` }

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

            async firstUpdated() {
                super.firstUpdated()
                this.navActiveLinks()
                const container = this.shadowRoot.querySelector('.accordion-menu');

                // Close all other details when one is shown
                container.addEventListener('sl-show', event => {
                    [...container.querySelectorAll('sl-details')].map(details => (details.open = event.target === details));
                });

                collections.places = await FetchAPI.getPlacesAsync()
                collections.items = await FetchAPI.getItemsAsync()
                    // collections.devices = await FetchAPI.getDevicesAsync()
                collections.users = localStorage.accessLevel == 2 ? await FetchAPI.getUsersAsync() : ""
                    // console.log(`Places are: ${JSON.stringify(places)}`)
                    // console.log(`Items are: ${JSON.stringify(items)}`)
                    // console.log(`Users are: ${JSON.stringify(users)}`)

                // these HAVE to be streamlined...waaay to repetitive! Do if time permits, otherwise after unit completion!
                this.renderPlacesButtons()
                this.renderItemsButtons()
                    // this.renderLocationsButtons()
                    // this.renderDevicesButtons()
                this.renderUsersButtons()
            }

            async renderPlacesButtons() {
                let list = this.shadowRoot.querySelector('.places-list')
                collections.places.forEach(entity => {
                    let itemElement = document.createElement('aa-accordion-button')
                    itemElement.setAttribute('icon', entity.locationType.iconURL)
                    itemElement.setAttribute('path', "icons")
                    itemElement.append(entity.placeName)
                    list.appendChild(itemElement)

                    // let name = "name"
                    // console.log(`Thing is.... ${JSON.stringify(entity.locationType)}`)
                })
            }

            // async renderLocationsButtons() {
            //     let list = this.shadowRoot.querySelector('.places-list')
            //     collections.places.forEach(entity => {
            //         let itemElement = document.createElement('aa-accordion-button')
            //         itemElement.setAttribute('icon', entity.locationType.iconURL)
            //         itemElement.setAttribute('path', "icons")
            //         itemElement.append(entity.placeName)
            //         list.appendChild(itemElement)

            //         // let name = "name"
            //         // console.log(`Thing is.... ${JSON.stringify(entity.locationType)}`)
            //     })
            // }

            async renderItemsButtons() {
                let list = this.shadowRoot.querySelector('.devices-list')
                collections.items.forEach(entity => {
                    let itemElement = document.createElement('aa-accordion-button')
                    itemElement.append(entity.name)
                    itemElement.setAttribute('icon', `${entity.type.iconURL}`)
                    itemElement.setAttribute('path', "icons")
                        // console.log(`Icon url is: ${JSON.stringify(entity)}`)
                    list.appendChild(itemElement)

                    // console.log(entity)
                    // console.log(`Device is: ${entity.type.iconURL}`)
                })
            }

            // async renderDevicesButtons() {
            //     let list = this.shadowRoot.querySelector('.devices-list')
            //     collections.items.forEach(entity => {
            //         let itemElement = document.createElement('aa-accordion-button')
            //         itemElement.append(entity.name)
            //         itemElement.setAttribute('icon', `${entity.type.iconURL}`)
            //             // console.log(`Icon url is: ${JSON.stringify(entity)}`)
            //         list.appendChild(itemElement)

            //         // console.log(entity)
            //     })
            // }

            async renderUsersButtons() {
                    let list = this.shadowRoot.querySelector('.users-list')
                    collections.users.forEach(entity => {
                                let itemElement = document.createElement('aa-accordion-button')
                                itemElement.setAttribute('icon', `${(entity && entity.imageURL != "") ? `${entity.imageURL}` : "account_circle_white_24dp.svg"}`)
                                itemElement.setAttribute('path', `${(entity && entity.imageURL != "") ? `images` : `icons`}`)
                    itemElement.append(entity.firstName, " ", entity.lastName)
                    list.appendChild(itemElement)

                    // console.log(entity.imageURL)
                })
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

                // Test console logs - remove later****************************************************************
                // console.log(`Access token is: ${localStorage.accessToken}`)
                // console.log(`Access level is is: ${localStorage.accessLevel}`)
                // console.log(`Full local storage is: ${JSON.stringify(localStorage)}`)
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
        --size: 18em;
      }

      sl-drawer::part(body){
        padding: 0;
        scrollbar-width: none; /* Firefox */
        -ms-overflow-style: none;  /* IE 10+ */
        &::-webkit-scrollbar {
        width: 0px;
        background: transparent; /* Chrome/Safari/Webkit */
        }
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

      .accordion-container{
        width: 100%;
      }

      .accordion-menu{

      }

      .dashboard-button::part(content){
        display:none;
      }

      .bottom-menus{
        width: 100%;
        padding: 5%;
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
        /* color: white; */
      }

      sl-icon:hover{
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
        color: white;
      }
      
      sl-details::part(content){
        padding: 0;
        
        border-top: 1px solid white;
      }

      sl-details::part(summary){
        /* color: white; */
      }

      sl-details::part(summary):hover{
        color: var(--base-color);
      }

      sl-details::part(base){
        color: white;
        background: var(--base-color);
        /* font-size: 1rem; */
      }

      sl-details::part(base):hover{
        color: var(--base-color);
        background: white;
      }

      /* aa-accordion-button.icon{
        color: red;
      } */

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

      <div class="right-navs">
        <nav class="app-top-nav">
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
              <sl-avatar image=${(this.user && this.user.imageURL) ? `${App.apiBase}/images/${this.user.imageURL}` : ``}></sl-avatar> ${this.user && this.user.firstName}
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
        <!-- <div class="top-menus"> -->
          <!-- <img class="app-side-menu-logo" src="/images/logo.svg"> -->
          <!-- <nav class="app-side-menu-items"> -->
            <!-- <a href="/" @click="${this.menuClick}">Dashboard</a> -->
            <!-- <a href="/hairdressers" @click="${this.menuClick}">Find a Hairdresser</a>
            <a href="/haircute" @click="${this.menuClick}">Find a Haircut</a>
            <a href="/favouriteHaircuts" @click="${this.menuClick}">Hairdressers</a>
            <a href="/profile" @click="${this.menuClick}">Profile</a>
            <a href="#" @click="${() => Auth.signOut()}">Sign Out</a> -->
          <!-- </nav>   -->
        <!-- </div> -->
        <!--  -->
        <div class="accordion-container">
          <div class="accordion-menu">
            <sl-details summary="Dashboard" class="dashboard-button"></sl-details>
            <sl-details summary="Places" class="details places-list"></sl-details>
            <sl-details summary="Devices" class="details devices-list"></sl-details>
            <sl-details summary="Users" class="details users-list">
            </sl-details>
          </div>

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
                <sl-icon slot="icon" name="gear-fill" style="font-size: 2rem; color: white;"></sl-icon>
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