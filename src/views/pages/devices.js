import App from '../../App'
import { html, render } from 'lit-html'
import Auth from '../../Auth'
import Utils from '../../Utils'
import FetchAPI from '../../FetchAPI'
import gsap from 'gsap'
import LightDialog from './../../components/aa-light-dialog'

class DevicesView {
    async init() {
        document.title = 'Devices'
        let devices = await FetchAPI.getItemsAsync()
            // let places = await FetchAPI.getPlacesAsync()
        await this.render(devices)
        this.animateStatus()
        Utils.pageIntroAnim()
    }

    // blinking light for active status
    animateStatus() {
        const tl1 = new gsap.to(".active", {
            backgroundColor: "#3B90FF",
            delay: 0.5,
            duration: .5,
            repeat: -1,
            yoyo: true,
        });
    }

    handleClick(device, devices) {
        console.log(`Device selected... ${JSON.stringify(device)}`)
        LightDialog.init(device, devices)
    }

    async render(devices, places) {
            const template = html `
      <style>
        .status-container{
          display: flex; 
          align-items: center; 
          justify-content: center; 
        }

        .active{
          background: #003A85;
          width: 22px;
          height: 12px;
          margin-right: 10px;
          /* box-shadow: #000 0 -1px 7px 1px, inset #460 0 -1px 9px, #7D0 0 2px 12px; */
        }

        .inactive{
          background-color: red;
          width: 22px;
          height: 12px;
          margin-right: 10px;
        }

        .online{
          width: 22px;
          height: 12px;
          background-color: #00FF33;
          margin-right: 10px;
          /* box-shadow: #000 0 -1px 7px 1px, inset #460 0 -1px 9px, #7D0 0 2px 12px; */
        }

        .offline{
          width: 22px;
          height: 12px;
          background-color: lightgray;
          margin-right: 10px;
        }

        .image{
          height: 100%;
          width: auto;
        }

        .grid-container{
          display: grid;
          width: 100%;
          grid-template-columns: 10% 20% 20% 20% 20% 5% 5%;
        }

        .header{
          font-weight: 900;
          font-size: 1.2rem;
        }

        .cols{
          border-bottom: 1px solid;
          display: flex;
          justify-content: center;
          align-items: center;
          width: 100%;
          height: 4rem;
          padding: 0.5rem 0;
        }

        /* .col1{
        } */

        .col2{
          justify-content: flex-start;
          padding: 0 1rem;
        }

        .col3{
          justify-content: flex-start;
        }

        /* .col4{
        }

        .col5{
        }

        .col6{

        }

        .col7{

        } */

        .link{
          cursor: pointer;
        }

        .col1 .material-icons{
          font-size: 48px !important;
        }

        .page-content{
          display: flex;
          align-items: center;
          justify-content: center;
        }

        aa-panel-template{
          min-width: 1024px;
            width: 95%;
            height: 98%;
            /* overflow: scroll; */
          }

        /* RESPONSIVE - TABLET ------------------- */
        @media all and (max-width: 1024px){  
          /* aa-panel-template::part(container){ */
            /* width: 1024px !important; */
            /* overflow: scroll; */
          /* } */

          /* .page-content{
            width: 1024px;
            overflow: scroll;
          } */

          /* .container{
            width: 1024px;
            overflow: scroll;
          } */
        }
      </style>
      <link href="https://fonts.googleapis.com/icon?family=Material+Icons" rel="stylesheet">
      <va-app-header title="Devices" user="${JSON.stringify(Auth.currentUser)}"></va-app-header>
      <div class="page-content">
        <aa-panel-template title=${document.title}>
          <div slot="table-heading">
            <div class="grid-container">
              <div class="cols col1 header">
                <div></div>
              </div>
              <div class="cols col2 header">
                <div>Device Name</div>
              </div>
              <div class="cols col3 header">
                <div>Location</div>
              </div>
              <div class="cols col4 header">
                <div>Sensor Status</div>
              </div>
              <div class="cols col5 header">
                <div>Status</div>
              </div>
              <div class="cols col6 header">
                <div class="material-icons">push_pin</div>
              </div>
              <div class="cols col7 header">
                <div></div>
              </div>
            </div>
          </div>
          <div slot="body" part="body">
            <div class="grid-container">
            ${devices.map(device =>
              html`
            <div class="cols col1">
              <div class="material-icons">${device.type.iconURL}</div>
            </div>
            <div class="cols col2">
              <div>${device.name}</div>
            </div>
              <div class="cols col3">
                <div>${device.placeName.placeName}</div>
              </div>
              <div class="cols col4">
                <div class="status-container">
                  <div class="${device.status ? "online" : "offline"}"></div>
                  <div>${device.status ? "online" : "offline"}</div>
                </div>
              </div>
              <div class="cols col5">
                <div class="status-container">
                  <div class="${device.state ? "active" : "inactive"}"></div>
                  <div>${device.level ? `${device.level}%,` : ""} ${device.state ? "active" : "inactive"}</div>
                </div>
              </div>
            <div class="cols col6">
              <div class="${device.pinned ? "pinned" : "unpinned"} material-icons">${device.pinned ? "push_pin" : ""}</div>
            </div>
              <div class="cols col7">
                <div class="material-icons link" @click=${() => this.handleClick(device, devices)}>handyman</div>
              </div>
            </div>
            `
            )}
            </div>
          </div>
        </aa-panel-template>
      </div> 
`
    render(template, App.rootEl)
  }
}


export default new DevicesView()