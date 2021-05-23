import { LitElement, html, css } from "@polymer/lit-element";
import { render } from 'lit-html'
import { anchorRoute, gotoRoute } from '../Router'
import Auth from '../Auth'
import App from '../App'
import FetchAPI from './../FetchAPI'

// const template = document.createElement
class LightDialog {
    constructor() {
        const devices = null
        const device = null
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
        this.init
            // let button = this.shadowRoot.querySelector('.container')
            // button.addEventListener('click', () => {
            //         this.shadowRoot.querySelector('.active-indicator').classList.toggle('active')
            //     })

        // // register place dropdown items
        // localStorage.accessLevel >= 1 ? collections.locations.forEach(location => { // could just be straight up 2?
        //     let dropdown = document.createElement('sl-menu-item')
        //     dropdown.innerHTML = location.locationType
        //     dropdown.classList.add('register-place-dropdown-item')
        //     dropdown.setAttribute('id', location._id)
        //     dropdown.setAttribute('value', location.locationType)
        //     registerPlaceDropdown.appendChild(dropdown)
        // }) : ""

        // localStorage.accessLevel >= 1 ? collections.places.forEach(place => { // could just be straight up 2?
        //     let dropdown = document.createElement('sl-menu-item')
        //     dropdown.innerHTML = place.placeName
        //     dropdown.classList.add('register-device-dropdown-location-item')
        //     dropdown.setAttribute('id', `${place._id}-place-register`)
        //     dropdown.setAttribute('value', place.placeName)
        //     registerDeviceLocationDropdown.appendChild(dropdown)
        // }) : ""

        // localStorage.accessLevel >= 1 ? collections.devices.forEach(device => { // could just be straight up 2?
        //     let dropdown = document.createElement('sl-menu-item')
        //     dropdown.innerHTML = device.type
        //     dropdown.classList.add('register-device-dropdown-type-item')
        //     dropdown.setAttribute('id', `${device._id}-device-register`)
        //     dropdown.setAttribute('value', device.type)
        //     registerDeviceDropdown.appendChild(dropdown)
        // }) : ""
    }

    init(device, devices) {
        this.devices = devices
        this.device = device

        console.log(devices)

        this.renderDialog(device)
        console.log(device)

        this.renderDevices()
    }

    registerSubmitHandler(e) {
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

        // if (e.target.innerText === "Cancel") {
        //     registerDeviceDialog.hide()
        // }
        // window.location.reload() // This for some reason doesn't allow the submission process to finish
    }

    renderDevices() {
        // const registerDeviceDropdown = document.querySelector('#register-device-dropdown')
        // registerDeviceDropdown.value = this.device.name
        // localStorage.accessLevel >= 1 ? this.devices.forEach(device => { // could just be straight up 2?
        //     let dropdown = document.createElement('sl-menu-item')
        //     dropdown.innerHTML = device.type.type
        //     dropdown.classList.add('register-device-dropdown-type-item')
        //     dropdown.setAttribute('id', `${device._id}-device-register`)
        //     dropdown.setAttribute('value', device.name)
        //     registerDeviceDropdown.appendChild(dropdown)
        // }) : ""
    }

    handleAdvancedSettings(e) {
        const advancedDeviceSettings = document.querySelector('.advanced-device-settings')
        advancedDeviceSettings.classList.toggle('hidden')
    }

    handleEnabledDisabled(e) {
        const disableEnable = document.querySelector('#disable-enable-toggle')


        if (e.target.checked) {
            disableEnable.setAttribute('checked', true)
        } else {
            disableEnable.removeAttribute('checked')
        }
    }

    handleLevelInputValues(e) {
        const sliderLvlVal = document.querySelector('.slider-level-input-value')
        console.log(e.target.value)
        sliderLvlVal.value = e.target.value
    }

    handleLevelSliderValues(e) {
        const lvlInputVal = document.querySelector('.level-input-value')
        console.log(e.target.value)
        lvlInputVal.value = e.target.value
    }

    handlePinnedUnpinned(e) {
        const pinnedInput = document.querySelector('#pin-unpin-toggle')
            // console.log(e.target.value)
        pinnedInput.value = e.target.value
    }

    handlePowerStatus(e) {
        e.preventDefault()
            // const formData = e.detail.formData
        const pinnedInput = document.querySelector('#off-on-toggle')
        if (e.target.checked) {
            console.log(e.target.checked)
            pinnedInput.setAttribute('checked', true)
                // formData.set("state", "1")
            FetchAPI.putItemAsync(JSON.parse('{ "state": "1" }'))
        } else {
            pinnedInput.removeAttribute('checked')
                // formData.set("state", "0")
            FetchAPI.putItemAsync(JSON.parse('{ "state": "0" }'))
        }
        console.log(e.target.checked)
            // pinnedInput.value = e.target.value
            // FetchAPI.putItemAsync(e.target.value)
    }

    renderDialog(device) {
        // create dialog
        const lightDialog = document.createElement('sl-dialog')
            // add classname
        lightDialog.className = 'register-device-dialog'
            // append header details
        lightDialog.setAttribute('no-header', 'true')
        lightDialog.setAttribute('style', '--width: 30vw;')

        // dialog content
        const dialogContent = html `
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

        <link href="https://fonts.googleapis.com/icon?family=Material+Icons" rel="stylesheet">
        <span class="dialog-heading">${device.name}</span>
            <div class="flex-center">
                <div class="material-icons" style="font-size: 8rem; margin: 1rem; color: white;">${device.type.iconURL}</div>          
            </div>
            <sl-form class="form-register-device dark-theme" @sl-submit=${this.registerSubmitHandler}>
                <!-- <div class="input-group pad-bottom input-labels">
                    <sl-input name="name" type="text" id="device-name" required value=${device.name} disabled="true"></sl-input>
                </div> -->
                <!-- <div class="input-group pad-bottom device-container">
                    <sl-select id="register-device-dropdown"></sl-select>
                </div>      
                <div class="input-group pad-bottom">
                    <sl-select id="register-device-location-dropdown" value=${device.placeName.placeName}></sl-select>
                </div> -->
                <div class="input-group pad-bottom input-labels">
                        <p class="toggle-text">Pin to dash</p>
                        <sl-switch class="toggle-switch" id="pin-unpin-toggle" name="pinned" @sl-change=${this.handlePinnedUnpinned}></sl-switch>      
                </div>
                <div class="input-group pad-bottom input-labels">
                        <p class="toggle-text">Off/On</p>
                        <sl-switch class="toggle-switch" id="off-on-toggle" name="pinned" @sl-change=${this.handlePowerStatus}></sl-switch>      
                </div>
                <div class="input-group">
                <!-- Will be replaced with custom made component containing two selector in one line -->
                  <sl-range class="slider-level-input-value" label="Level" help-text="Light intensity"min="0"max="100" value="50" @sl-change=${this.handleLevelSliderValues}></sl-range><!-- set max input level -->
                  <!-- add rgb values if RGB LED -->
                </div>
                <div class="input-group input-labels" style="display: flex;">
                  <sl-input class="pad-bottom text-input-xs level-input-value" name="level" type="number" label="Level" @sl-change=${this.handleLevelInputValues} value="50"></sl-input>
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
                        <sl-switch class="toggle-switch" id="disable-enable-toggle" @sl-change=${this.handleEnabledDisabled}></sl-switch>      
                    </div>
                    <div class="input-group input-labels">
                        <sl-input class="pad-bottom text-input-xs" name="reportingRate" label="Reporting interval (sec)" type="number"  value=${device.reportingRate}></sl-input>
                    </div>
                    <div class="input-group input-labels">
                        <sl-input class="pad-bottom text-input-xs" name="pollRate" label="Polling rate (sec)" type="number"  value=${device.pollRate}></sl-input>
                    </div>
                    <div class="input-group input-labels">
                        <sl-input class="pad-bottom text-input-sml" id="ip-input" name="ipAddress" label="IP address" type="text"  value=${device.ipAddress}></sl-input>
                    </div>
                    <div class="input-group input-labels">
                        <sl-input class="pad-bottom text-input-sml" id="mqtt-input" name="mqttTopic" label="MQTT topic" type="string"  value=${device.mqttTopic}></sl-input>
                    </div>
                </div>           
                <sl-button class="cancel-btn cancel pad-bottom" type="primary" submit style="width: 100%;">Cancel</sl-button>
                <sl-button class="submit-btn register-device pad-bottom" id="register-device-submit-btn" type="primary" submit style="width: 100%;">Register</sl-button>
            </sl-form>
        `
        render(dialogContent, lightDialog)

        // append to document.body
        document.body.append(lightDialog)

        // show dialog
        lightDialog.show()

        // on hide delete dialog
        lightDialog.addEventListener('sl-after-hide', () => {
            lightDialog.remove()
        })
    }

    render() {
        // alert(`somthing happened... ${JSON.stringify(device.placeName.placeName)}`)
        return
    }
}

export default new LightDialog