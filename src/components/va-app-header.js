import { LitElement, html, css } from '@polymer/lit-element'
import { anchorRoute, gotoRoute } from './../Router'
import Auth from './../Auth'
import App from './../App'
import FetchAPI from '../FetchAPI'

let places, items, users, locations, devices = [{}]
let collections = [{ places, items, users, locations, devices }]
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
                const container = this.shadowRoot.querySelector('.accordion-menu')
                const signinDialog = this.shadowRoot.querySelector('.signin-dialog')
                const signupDialog = this.shadowRoot.querySelector('.signup-dialog')
                const registerPlaceDialog = this.shadowRoot.querySelector('.register-place-dialog')
                const registerDeviceDialog = this.shadowRoot.querySelector('.register-device-dialog')
                const menuItems = this.shadowRoot.querySelectorAll('sl-menu-item')
                const registerPlaceDropdown = this.shadowRoot.querySelector('#register-place-dropdown')
                const registerDeviceDropdown = this.shadowRoot.querySelector('#register-device-dropdown')
                const registerDeviceLocationDropdown = this.shadowRoot.querySelector('#register-device-location-dropdown')

                // set click event listener for menu items
                menuItems.forEach(menuItem => {
                    menuItem.addEventListener('click', (e) => {
                        // console.log(`Target clicked was: ${e.target.id}`)
                        if (e.target.id === 'register-user' || e.target.id === 'regsiter-user-side') {
                            signupDialog.show()
                        } else if (e.target.id === 'register-place' || e.target.id === 'regsiter-place-side') {
                            registerPlaceDialog.show()
                        } else if (e.target.id === 'register-device' || e.target.id === 'register-device-side') {
                            registerDeviceDialog.show()
                        }
                    })
                })

                // const emailInput = this.shadowRoot.querySelector('.email-input')
                // signinDialog.addEventListener('sl-initial-focus', event => {
                //     event.preventDefault();
                //     input.focus({ preventScroll: true });
                // });

                // if user is not signed in do not allow them to cancel the dialogs, otherwise
                // a signed in user is creating a new user and should be able to dismiss it
                if (typeof Auth.currentUser.accessLevel === 'undefined') signinDialog.show()
                if (!localStorage.accessLevel >= 1) {
                    signinDialog.addEventListener('sl-overlay-dismiss', event => event.preventDefault())
                    signupDialog.addEventListener('sl-overlay-dismiss', event => event.preventDefault())
                }

                // Close all other details when one is shown
                container.addEventListener('sl-show', event => {
                    [...container.querySelectorAll('sl-details')].map(details => (details.open = event.target === details));
                });

                // if user is signed in then load all the collections for rendering
                if (localStorage.accessLevel >= 1) {
                    collections.places = await FetchAPI.getPlacesAsync()
                    collections.items = await FetchAPI.getItemsAsync()
                    collections.users = localStorage.accessLevel == 2 ? await FetchAPI.getUsersAsync() : ""
                    collections.locations = localStorage.accessLevel == 2 ? await FetchAPI.getLocationsAsync() : ""
                    collections.devices = localStorage.accessLevel == 2 ? await FetchAPI.getDevicesAsync() : ""

                    // these HAVE to be streamlined...waaay to repetitive! Do if time permits, otherwise after unit completion!
                    this.renderPlacesButtons()
                    this.renderItemsButtons()
                    localStorage.accessLevel == 2 ? this.renderUsersButtons() : ""
                    const signinDialog = this.shadowRoot.querySelector('.signin-dialog');
                    signinDialog.addEventListener('sl-overlay-dismiss', event => event.preventDefault())
                }

                // switch between sign in and sign up dialogs based on user selection and supplied target
                const toggleDialogs = this.shadowRoot.querySelectorAll('.toggle-dialogs')
                toggleDialogs.forEach(toggleDialog => {
                    toggleDialog.addEventListener('click', (e) => {
                        if (e.target.textContent === "Sign Up") {
                            signinDialog.hide()
                            signupDialog.show()
                        } else {
                            localStorage.accessLevel >= 1 ? "" :
                                () => {
                                    signupDialog.hide()
                                    signinDialog.show()
                                }
                        }
                    })
                })

                // register place dropdown items
                localStorage.accessLevel >= 1 ? collections.locations.forEach(location => { // could just be straight up 2?
                    let dropdown = document.createElement('sl-menu-item')
                    dropdown.innerHTML = location.locationType
                    dropdown.classList.add('register-place-dropdown-item')
                    dropdown.setAttribute('id', location._id)
                    dropdown.setAttribute('value', location.locationType)
                    registerPlaceDropdown.appendChild(dropdown)
                }) : ""

                localStorage.accessLevel >= 1 ? collections.places.forEach(place => { // could just be straight up 2?
                    let dropdown = document.createElement('sl-menu-item')
                    dropdown.innerHTML = place.placeName
                    dropdown.classList.add('register-device-dropdown-location-item')
                    dropdown.setAttribute('id', `${place._id}-place-register`)
                    dropdown.setAttribute('value', place.placeName)
                    registerDeviceLocationDropdown.appendChild(dropdown)
                }) : ""

                localStorage.accessLevel >= 1 ? collections.devices.forEach(device => { // could just be straight up 2?
                    let dropdown = document.createElement('sl-menu-item')
                    dropdown.innerHTML = device.type
                    dropdown.classList.add('register-device-dropdown-type-item')
                    dropdown.setAttribute('id', `${device._id}-device-register`)
                    dropdown.setAttribute('value', device.type)
                    registerDeviceDropdown.appendChild(dropdown)
                }) : ""
            }

            async renderPlacesButtons() {
                let list = this.shadowRoot.querySelector('.places-list')
                collections.places.forEach(entity => {
                    let itemElement = document.createElement('aa-accordion-button')
                    itemElement.setAttribute('icon', entity.locationType.iconURL)
                    itemElement.setAttribute('path', "icons")
                    itemElement.append(entity.placeName)
                    list.appendChild(itemElement)
                    itemElement.addEventListener('click', () => {})
                })
            }

            async renderItemsButtons() {
                let list = this.shadowRoot.querySelector('.devices-list')
                collections.items.forEach(entity => {
                    let itemElement = document.createElement('aa-accordion-button')
                    itemElement.setAttribute('icon', `${entity.type.iconURL}`)
                    itemElement.setAttribute('path', "icons")
                    itemElement.append(entity.name)
                    list.appendChild(itemElement)
                    itemElement.addEventListener('click', () => {})
                })
            }

            renderImage(itemElement, entity) {
                itemElement.setAttribute('icon', `${App.apiBase}/images/${entity.imageURL}`)
                itemElement.setAttribute('path', "Images")
            }

            renderIcon(itemElement) {
                itemElement.setAttribute('icon', `account_circle`)
                itemElement.setAttribute('path', "icons")
            }

            async renderUsersButtons() {
                let list = this.shadowRoot.querySelector('.users-list')
                collections.users.forEach(entity => {
                    let itemElement = document.createElement('aa-accordion-button')
                    entity && entity.imageURL != "" ?
                        this.renderImage(itemElement, entity) :
                        this.renderIcon(itemElement)
                    itemElement.append(entity.firstName, " ", entity.lastName)
                    list.appendChild(itemElement)
                    itemElement.addEventListener('click', () => {
                        console.log(entity)
                    })
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

            signInSubmitHandler(e) {
                e.preventDefault()
                    // determine which dialog is sending the submit call to be able to carry out appropriate post method
                const signinDialog = this.shadowRoot.querySelector('.signin-dialog')
                const signupDialog = this.shadowRoot.querySelector('.signup-dialog')
                const formData = e.detail.formData
                const submitBtn = this.shadowRoot.querySelector('.submit-btn')
                    // console.log(e.target)
                if (e.target.innerText === "Sign In") {
                    submitBtn.setAttribute('loading', '')
                        // sign in using Auth    
                    Auth.signIn(formData, () => {
                            submitBtn.removeAttribute('loading')
                        })
                        // console.log(localStorage.accessLevel)
                    if (localStorage.accessLevel >= 1) {
                        signinDialog.hide()
                        submitBtn.removeAttribute('loading')
                    }
                    // sign up user
                } else {
                    // if its not an admin then append default user values
                    if (localStorage.accessLevel != 2) {
                        formData.append('accessLevel', 1)
                        formData.append('status', true)
                        formData.append('imageURL', "")
                    }
                    // if user creating account is admin then convert toggle buttons to input values and append them to the form data
                    else {
                        formData.append('status', this.shadowRoot.querySelector('#user-status-toggle').checked)
                        formData.append('accessLevel', this.shadowRoot.querySelector('#access-level-toggle').checked ? 2 : 1)
                        formData.append('imageURL', "")
                    }
                    // sign up using Auth
                    Auth.signUp(formData, () => {
                        submitBtn.removeAttribute('loading')
                    }, () => {
                        signupDialog.hide()
                        submitBtn.removeAttribute('loading')
                            // if the person who registered the new user is signed in then don't prompt them to log in
                        if (!localStorage.accessLevel >= 1) signinDialog.show()
                            // If the user is admin then refresh their users list
                        if (localStorage.accessLevel == 2) {
                            window.location.reload()
                        }
                    })
                }
            }

            registerPlaceSubmitHandler(e) {
                e.preventDefault()
                const formData = e.detail.formData
                const submitBtn = this.shadowRoot.querySelector('.submit-btn')
                const cancelBtn = this.shadowRoot.querySelector('.cancel-btn')
                const registerPlaceDialog = this.shadowRoot.querySelector('.register-place-dialog')
                const selectedObjectValue = this.shadowRoot.querySelector('#register-place-dropdown').value
                let objectId = null
                const deviceObject = collections.locations.filter(location => {
                    location.locationType === selectedObjectValue ? objectId = location._id : ""
                })

                formData.append("locationType", objectId)
                FetchAPI.postPlaceAsync(formData)

                // console.log(e.target.innerText)
                // if successful, hide dialog, if not, keep it open and show toast - otherwise keep dialog open

                // window.location.reload()

                // console.log(formData)
                for (var pair of formData.entries()) {
                    console.log(pair[0] + ', ' + pair[1]);
                }
                // if (e.target.innerText === "Cancel") {
                //     registerPlaceDialog.hide() // doesn't work at this stage...
                // }

            }

            registerDeviceSubmitHandler(e) {
                e.preventDefault()
                const formData = e.detail.formData
                const submitBtn = this.shadowRoot.querySelector('.submit-btn')
                const cancelBtn = this.shadowRoot.querySelector('.cancel-btn')
                const registerDeviceDialog = this.shadowRoot.querySelector('.register-device-dialog')
                let advancedToggle = this.shadowRoot.querySelector('#advanced-settings-toggle')
                let manAutoToggle = this.shadowRoot.querySelector('#manual-auto-toggle')
                const deviceName = this.shadowRoot.querySelector('#device-name').value
                const selectedObjectValue = this.shadowRoot.querySelector('#register-device-dropdown').value
                const locationObjectValue = this.shadowRoot.querySelector('#register-device-location-dropdown').value
                let typeObjectId, placeObjectId = null
                const deviceObject = collections.devices.filter(device => {
                    device.type === selectedObjectValue ? typeObjectId = device._id : ""
                })
                const locationObject = collections.places.filter(place => {
                    place.placeName === locationObjectValue ? placeObjectId = place._id : ""
                    console.log(place._id)
                    console.log(place.placeName, locationObjectValue)
                })
                const ipInput = this.shadowRoot.querySelector('#ip-input')
                const mqttInput = this.shadowRoot.querySelector('#mqtt-input')

                console.log(`The original ID is: ${placeObjectId}`)
                    // console.log(`Object id is: ${typeObjectId.split('-')[0]}`)
                console.log(e.target)
                console.log(typeObjectId)
                console.log(placeObjectId)

                console.log(advancedToggle)
                if (advancedToggle.checked) {
                    formData.append("type", typeObjectId)
                    formData.append("placeName", placeObjectId)
                    formData.append('enabled', this.shadowRoot.querySelector('#disable-enable-toggle').checked)
                    formData.append("pinned", false)
                    formData.append("state", 0)
                    formData.append("status", 0)
                    if (formData.get('ipAddress') === "") formData.set("ipAddress", "192.168.0.22") // Arbitrary at this point - will be dynamically allocated
                    if (formData.get('mqttTopic') === "") formData.set("mqttTopic", `${deviceName}_${locationObjectValue}_${selectedObjectValue}`)
                    console.log(formData.get('mqttTopic'))
                    console.log(formData.get('ipAddress'))
                    console.log(manAutoToggle.checked)
                    if (manAutoToggle.checked) {
                        console.log("Device is auto managed...")
                    } else {
                        formData.append("minTrigger", 0)
                        formData.append("maxTrigger", 0)
                    }
                } else {
                    formData.append("type", typeObjectId)
                    formData.append("placeName", placeObjectId)
                    formData.append('enabled', false)
                    formData.append("pinned", false)
                    formData.append("state", 0)
                    formData.append("status", 0)
                    formData.append("autoManage", true)
                        // formData.append("pollRate", 60)
                        // formData.append("reportingRate", 60)
                    formData.append("ipAddress", "192.168.0.22") // Arbitrary at this point - will be dynamically allocated
                    formData.append("mqttTopic", `${deviceName}_${locationObjectValue}_${selectedObjectValue}`)
                }

                // check that the mqttTopic, ipAddress do not already exist

                FetchAPI.postItemAsync(formData)

                if (e.target.innerText === "Cancel") {
                    registerDeviceDialog.hide()
                }
                // window.location.reload() // This for some reason doesn't allow the submission process to finish
            }

            handleAdvancedSettings(e) {
                const advancedDeviceSettings = this.shadowRoot.querySelector('.advanced-device-settings')
                advancedDeviceSettings.classList.toggle('hidden')
            }

            handleAutoManagement(e) {
                const minOnSetting = this.shadowRoot.querySelector('.min-on-setting')
                const minOffSetting = this.shadowRoot.querySelector('.min-off-setting')
                const minInputVal = this.shadowRoot.querySelector('.min-input-value')
                const maxInputVal = this.shadowRoot.querySelector('.max-input-value')


                if (e.target.checked) {
                    minOnSetting.setAttribute('disabled', false)
                    minOffSetting.setAttribute('disabled', false)
                    minInputVal.setAttribute('disabled', false)
                    maxInputVal.setAttribute('disabled', false)
                } else {
                    minOnSetting.setAttribute('disabled', true)
                    minOffSetting.setAttribute('disabled', true)
                    minInputVal.setAttribute('disabled', true)
                    maxInputVal.setAttribute('disabled', true)
                }
            }

            handleMinSliderValues(e) {
                const minInputVal = this.shadowRoot.querySelector('.min-input-value')
                console.log(e.target.value)
                minInputVal.value = e.target.value
            }

            handleMaxSliderValues(e) {
                const maxInputVal = this.shadowRoot.querySelector('.max-input-value')
                console.log(e.target.value)
                maxInputVal.value = e.target.value
            }

            handleMinInputValues(e) {
                const minInputVal = this.shadowRoot.querySelector('.min-on-setting')
                console.log(e.target.value)
                minInputVal.value = e.target.value
            }

            handleMaxInputValues(e) {
                const maxInputVal = this.shadowRoot.querySelector('.min-off-setting')
                console.log(e.target.value)
                maxInputVal.value = e.target.value
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
        --size: 20em;
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
        color: white;
      }

      .sidenav-content{
        display: flex; 
        flex-direction: column; 
        align-items: center; 
        height: 100%; 
        justify-content: space-between;
      }

      .accordion-container{
        width: 100%;
      }

      .dashboard-button::part(content){
        display: none;
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

      .menu-items::part(base){
        color: #fff;
      }

      .menu-items::part(base):hover{
        color: rgb(94,85,107);
      }

      sl-avatar::part(base){
        --size: 2rem;
        color: white;
      }

      sl-details::part(header){
        padding: var(--sl-spacing-x-small);
      }
      
      sl-details::part(content){
        padding: 0;
        border-top: 1px solid white;
      }

      sl-details::part(summary):hover{
        color: var(--base-color);
      }

      sl-details::part(base){
        color: white;
        background: var(--base-color);
      }

      sl-details::part(base):hover{
        color: var(--base-color);
        background: white;
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

      .summary-icon::part(summary){
        font-size: 2rem;
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

      .toggle-dialogs{
        cursor: pointer;
        color: var(--brand-color);
        text-decoration: underline;
      }

      .toggle-dialogs:hover{
        color: white;
      }

      .toggle-text{
        margin: 0;
        color: white;
      }

      .toggle-switch{
        --width: 60px; --height: 30px; --thumb-size: 28px;
        color: white;
        margin: 10px 0;
      }

      .input-labels{
        color: white;
      }

      .text-input-sml{
        width: 10rem;
      }

      .text-input-xs{
        width: 5rem;
      }

      .hidden{
        display: none;
      }
    </style>  
    <!-- Sign in dialog -->
    <link href="https://fonts.googleapis.com/icon?family=Material+Icons" rel="stylesheet">
    <sl-dialog no-header="true" slot="label" class="signin-dialog" style="--width: 30vw;">
    <span class="dialog-heading">Sign In</span>
    <div class="page-content page-centered">
        <div class="signinup-box">
        <div class="flex-center">
            <div class="material-icons" style="font-size: 8rem; margin: 1rem; color: white;">account_circle</div>          
        </div>
        <sl-form class="form-signup dark-theme" @sl-submit=${this.signInSubmitHandler}>          
            <div class="input-group">
            <sl-input class="pad-bottom email-input" name="email" type="email" placeholder="Email" required></sl-input>
            </div>
            <div class="input-group">
            <sl-input class="pad-bottom" name="password" type="password" placeholder="Password" required toggle-password></sl-input>
            </div>
            <sl-button class="submit-btn" type="primary" submit style="width: 100%;">Sign In</sl-button>
        </sl-form>
        <p>No Account? <span class="toggle-dialogs">Sign Up</span></p>
        </div>
    </div>
    </sl-dialog>
    <!-- Sign up dialog -->
    <sl-dialog no-header="true" slot="label" class="signup-dialog" style="--width: 30vw;">
    <span class="dialog-heading">Sign up</span>
    <div class="page-content page-centered">
        <div class="signupup-box">
        <div class="flex-center">
            <div class="material-icons" style="font-size: 8rem; margin: 1rem; color: white;">account_circle</div>          
        </div>
        <sl-form class="form-signup" @sl-submit=${this.signInSubmitHandler}>
            <div class="input-group">
              <sl-input class="pad-bottom" name="firstName" type="text" placeholder="First Name" required></sl-input>
            </div>
            <div class="input-group">
              <sl-input class="pad-bottom" name="lastName" type="text" placeholder="Last Name" required></sl-input>
            </div>
            <div class="input-group">
            <sl-input class="pad-bottom" name="username" type="text" placeholder="Username" required></sl-input>
            </div>
            <div class="input-group">
              <sl-input class="pad-bottom" name="email" type="email" placeholder="Email" required></sl-input>
            </div>
            <div class="input-group">
              <sl-input class="pad-bottom" name="password" type="password" placeholder="Password" required toggle-password></sl-input>
            </div>      
            ${Auth.currentUser.accessLevel == 2 ? html`
            <div class="input-group">
            <p class="toggle-text">User type (regular/admin)</p>
              <sl-switch class="toggle-switch" id="access-level-toggle"></sl-switch>      
            </div>
            <div class="input-group">
            <p class="toggle-text">User status (inactive/active)</p>
              <sl-switch class="toggle-switch"  id="user-status-toggle" checked></sl-switch>
            `:``}
            <sl-button type="primary" class="submit-btn" submit style="width: 100%;">Sign Up</sl-button>
        </sl-form>
        <p>Have an account? <span class="toggle-dialogs">Sign In</span></p>
        </div>
    </div>
    </sl-dialog>
    <!-- Register device menu -->
    <sl-dialog no-header="true" class="register-device-dialog" style="--width: 30vw;">
      <span class="dialog-heading">Register Device</span>
      <div class="page-content page-centered">
          <div class="flex-center">
              <div class="material-icons" style="font-size: 8rem; margin: 1rem; color: white;">sensors</div>          
          </div>
          <sl-form class="form-register-device dark-theme" @sl-submit=${this.registerDeviceSubmitHandler}>
              <div class="input-group pad-bottom input-labels">
                <sl-input name="name" type="text" id="device-name" placeholder="Device name... e.g. Hallway LEDs" required></sl-input>
              </div>
              <div class="input-group pad-bottom">
                <sl-select id="register-device-dropdown" placeholder="Select device type..."></sl-select>
              </div>      
              <div class="input-group pad-bottom">
                <sl-select id="register-device-location-dropdown" placeholder="Select device location..."></sl-select>
              </div>
              <div class="input-group input-labels">
                <p class="toggle-text">Advanced Settings</p>
                <sl-switch class="toggle-switch" id="advanced-settings-toggle" @sl-change=${this.handleAdvancedSettings}></sl-switch>      
              </div>
              <div class="advanced-device-settings hidden">
                <div style="display:flex; justify-content: center; align-items: center; border-bottom: 1px solid white; padding: 0 0 1rem 0; margin-bottom: 1rem; color: white;">
                  <div>Advanced Settings</div>
                </div>
                <div class="input-group pad-bottom input-labels">
                  <p class="toggle-text">Disable/Enable</p>
                  <sl-switch class="toggle-switch" id="disable-enable-toggle"></sl-switch>      
                </div>
                <div class="input-group pad-bottom input-labels">
                  <p class="toggle-text">Manual/Auto</p>
                  <sl-switch class="toggle-switch" id="manual-auto-toggle" @sl-change=${this.handleAutoManagement} checked></sl-switch>      
                </div>
                <div class="input-group">
                <!-- Will be replaced with custom made component containing two selector in one line -->
                  <sl-range class="min-on-setting" label="Moisture level on trigger" help-text="Turn on at %."min="0"max="100" value="30" @sl-change=${this.handleMinSliderValues}></sl-range>
                  <sl-range class="min-off-setting" label="Moisture level off trigger" help-text="Turn off at %."min="0"max="100" value="80" @sl-change=${this.handleMaxSliderValues}></sl-range>
                </div>
                <div class="input-group input-labels" style="display: flex;">
                  <sl-input class="pad-bottom text-input-xs min-input-value" name="minTrigger" type="number" label="Min." @sl-change=${this.handleMinInputValues} value="30"></sl-input>
                  <sl-input class="pad-bottom text-input-xs max-input-value" style="margin-left: 1rem;" name="maxTrigger" type="number" label="Max." @sl-change=${this.handleMaxInputValues} value="80"></sl-input>
                </div>
                <div class="input-group input-labels">
                  <sl-input class="pad-bottom text-input-xs" name="reportingRate" label="Reporting interval (sec)" type="number" value="60"></sl-input>
                </div>
                <div class="input-group input-labels">
                  <sl-input class="pad-bottom text-input-xs" name="pollRate" label="Polling rate (sec)" type="number" value="15"></sl-input>
                </div>
                <div class="input-group input-labels">
                  <sl-input class="pad-bottom text-input-sml" id="ip-input" name="ipAddress" label="IP address" type="text" value=""></sl-input>
                </div>
                <div class="input-group input-labels">
                  <sl-input class="pad-bottom text-input-sml" id="mqtt-input" name="mqttTopic" label="MQTT topic" type="string" value=""></sl-input>
                </div>
              </div>           
              <sl-button class="cancel-btn cancel pad-bottom" type="primary" submit style="width: 100%;">Cancel</sl-button>
              <sl-button class="submit-btn register-device pad-bottom" id="register-device-submit-btn" type="primary" submit style="width: 100%;">Register</sl-button>
          </sl-form>
      </div>
    </sl-dialog>
    <!-- Register place menu -->
    <sl-dialog no-header="true" slot="label" class="register-place-dialog" style="--width: 30vw;">
      <span class="dialog-heading">Register Place</span>
      <div class="page-content page-centered">
          <div class="flex-center">
              <div class="material-icons" style="font-size: 8rem; margin: 1rem; color: white;">home</div>          
          </div>
          <sl-form class="form-register-place dark-theme" @sl-submit=${this.registerPlaceSubmitHandler}>
              <div class="input-group pad-bottom">
                <sl-input name="placeName" type="text" placeholder="Place name... e.g. Master Bedroom" required></sl-input>
              </div>
              <div class="input-group pad-bottom">
              <sl-select id="register-place-dropdown" name="location" placeholder="Select location...">
              </sl-select>
            </div>      
              <sl-button class="cancel-btn cancel pad-bottom" type="primary" submit style="width: 100%;">Cancel</sl-button>
              <sl-button class="submit-btn register-place" type="primary" submit style="width: 100%;">Register</sl-button>
          </sl-form>
      </div>
    </sl-dialog>
    <!-- Hamburger -->
    <header class="app-header" style="display:flex; justify-content: space-between; align-items:center;">
      <div class="left-navs">
        <sl-icon-button class="hamburger-btn" name="list" @click="${this.hamburgerClick}"></sl-icon-button>       
      </div>
      <!-- Main (top) menus -->
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
            <!-- Not yet implemented -->
              <sl-menu-item @click="${() => gotoRoute('/')}"><sl-icon class="dropdown-icon" slot="prefix" name="wifi"></sl-icon>System Status</sl-menu-item>
              <sl-menu-item @click="${() => gotoRoute('/')}"><sl-icon class="dropdown-icon" slot="prefix" name="list-ul"></sl-icon>Logs</sl-menu-item>
            </sl-menu>
          </sl-dropdown>
          <sl-dropdown distance="0" class="dropdowns">
            <a slot="trigger" href="#" @click="${(e) => e.preventDefault()}">
              <sl-avatar image=${(this.user && this.user.imageURL) ? `${App.apiBase}/images/${this.user.imageURL}` : ``}></sl-avatar> ${this.user && this.user.firstName}
            </a>
            <sl-menu>            
            ${Auth.currentUser.accessLevel == 2 ? html`
              <sl-menu-item class="register-user menu-items" id="register-user">
                <sl-icon class="dropdown-icon" slot="prefix" name="person"></sl-icon>
                <sl-icon class="settings-icon" slot="prefix" name="plus"></sl-icon>
                  Register User
              ` : ``}
              </sl-menu-item>
              <sl-menu-item class="manage-account menu-items" id="manage-account" @click="${() => gotoRoute('/users')}">
                <sl-icon class="dropdown-icon" slot="prefix" name="person"></sl-icon>
                <sl-icon class="add-icon" slot="prefix" name="gear-fill"></sl-icon>
                  Manage Account
              </sl-menu-item>
              ${Auth.currentUser.accessLevel == 2 ? html`
              <sl-menu-divider></sl-menu-divider>
                <sl-menu-item class="register-place menu-items" id="register-place">
                  <sl-icon class="dropdown-icon" slot="prefix" name="house-door"></sl-icon>
                  <sl-icon class="settings-icon" slot="prefix" name="plus"></sl-icon>
                    Register Place
                </sl-menu-item>
              <sl-menu-item class="menu-items" @click="${() => gotoRoute('/places')}">
                <sl-icon class="dropdown-icon" slot="prefix" name="house-door"></sl-icon>
                <sl-icon class="manage-place" slot="prefix" name="gear-fill"></sl-icon>
                  Manage Place
              </sl-menu-item>
              <sl-menu-divider></sl-menu-divider>
              <sl-menu-item class="menu-items register-device" id="register-device">
                <sl-icon class="dropdown-icon" slot="prefix" name="broadcast"></sl-icon>
                <sl-icon class="manage-device" slot="prefix" name="plus"></sl-icon>
                  Register Device
              </sl-menu-item>
              <sl-menu-item class="menu-items" @click="${() => gotoRoute('/devices')}">
                <sl-icon class="dropdown-icon" slot="prefix" name="broadcast"></sl-icon>
                <sl-icon class="add-device" slot="prefix" name="gear-fill"></sl-icon>
                  Manage Device
              </sl-menu-item>
              <sl-menu-divider></sl-menu-divider>
              ` : ``}
              <sl-menu-item class="menu-items" @click="${() => Auth.signOut()}">
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
        <!-- accordion (details) container to list all entities categorically -->
        <div class="accordion-container">
        <link href="https://fonts.googleapis.com/icon?family=Material+Icons" rel="stylesheet">
          <div class="accordion-menu">
            <sl-details class="dashboard-button" @click="${() => gotoRoute('/')}"><span slot="summary" class="material-icons" style="font-size: 40px;">dashboard</span><span style="margin-left: 10px; font-weight:900;" slot="summary">Dashboard</span></sl-details>
            <sl-details class="details places-list" summary="Places" ><span slot="summary" class="material-icons" style="font-size: 40px;">home</span><span style="margin-left: 10px; font-weight:900;" slot="summary">Places</span></sl-details>
            <sl-details class="details devices-list" summary="Devices"><span slot="summary" class="material-icons" style="font-size: 40px;">sensors</span><span style="margin-left: 10px; font-weight:900;" slot="summary">Devices</span></sl-details>
            ${localStorage.accessLevel == 2 ? html `<sl-details class="details users-list" summary="Users"><span slot="summary" class="material-icons" style="font-size: 40px;">account_circle</span><span style="margin-left: 10px; font-weight:900;" slot="summary">Users</span></sl-details>`:``}
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
              <!-- Not yet implemented -->
                <sl-menu-item class="menu-items" @click="${() => gotoRoute('/')}"><sl-icon class="dropdown-icon" slot="prefix" name="wifi"></sl-icon>System Status</sl-menu-item>
                <sl-menu-item class="menu-items" @click="${() => gotoRoute('/')}"><sl-icon class="dropdown-icon" slot="prefix" name="list-ul"></sl-icon>Logs</sl-menu-item>
              </sl-menu>
            </sl-dropdown>
            <sl-dropdown skidding="-171" distance="10" class="dropdowns-left">
              <a slot="trigger" href="#" @click="${(e) => e.preventDefault()}">
                <sl-avatar image=${(this.user && this.user.avatar) ? `${App.apiBase}/images/${this.user.avatar}` : ``}>
              </a>
              <sl-menu class="left-menu">            
                ${Auth.currentUser.accessLevel == 2 ? html`
                  <sl-menu-item class="register-user menu-items" id="register-user-side">
                    <sl-icon class="dropdown-icon" slot="prefix" name="person"></sl-icon>
                    <sl-icon class="settings-icon" slot="prefix" name="plus"></sl-icon>
                      Register User
                  ` : ``}
                  </sl-menu-item>
                  <sl-menu-item class="manage-account menu-items" id="manage-account-side" @click="${() => gotoRoute('/users')}">
                    <sl-icon class="dropdown-icon" slot="prefix" name="person"></sl-icon>
                    <sl-icon class="add-icon" slot="prefix" name="gear-fill"></sl-icon>
                      Manage Account
                  </sl-menu-item>
                  ${Auth.currentUser.accessLevel == 2 ? html`
                  <sl-menu-divider></sl-menu-divider>
                    <sl-menu-item class="register-place-side menu-items"  id="register-place-side">
                      <sl-icon class="dropdown-icon" slot="prefix" name="house-door"></sl-icon>
                      <sl-icon class="settings-icon" slot="prefix" name="plus"></sl-icon>
                        Register Place
                    </sl-menu-item>
                  <sl-menu-item class="menu-items" @click="${() => gotoRoute('/places')}">
                    <sl-icon class="dropdown-icon" slot="prefix" name="house-door"></sl-icon>
                    <sl-icon class="manage-place" slot="prefix" name="gear-fill"></sl-icon>
                      Manage Place
                  </sl-menu-item>
                  <sl-menu-divider></sl-menu-divider>
                  <sl-menu-item class="menu-items register-device-side" id="register-device-side">
                    <sl-icon class="dropdown-icon" slot="prefix" name="broadcast"></sl-icon>
                    <sl-icon class="manage-device" slot="prefix" name="plus"></sl-icon>
                      Register Device
                  </sl-menu-item>
                  <sl-menu-item class="menu-items" @click="${() => gotoRoute('/devices')}">
                    <sl-icon class="dropdown-icon" slot="prefix" name="broadcast"></sl-icon>
                    <sl-icon class="add-device" slot="prefix" name="gear-fill"></sl-icon>
                      Manage Device
                  </sl-menu-item>
                  <sl-menu-divider></sl-menu-divider>
                  ` : ``}
                  <sl-menu-item class="menu-items" @click="${() => Auth.signOut()}">
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