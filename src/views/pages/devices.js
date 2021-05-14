import App from '../../App'
import { html, render } from 'lit-html'
import { gotoRoute, anchorRoute } from '../../Router'
import Auth from '../../Auth'
import Utils from '../../Utils'

class DevicesView {
    init() {
        document.title = 'Devices'
        this.render()
        Utils.pageIntroAnim()
    }

    render() {
        const template = html `
      <va-app-header title="Devices" user="${JSON.stringify(Auth.currentUser)}"></va-app-header>
      <div class="page-content">        
        <h1>Devices</h1>
        <p>Page content ...</p>
        
      </div>      
    `
        render(template, App.rootEl)
    }
}


export default new DevicesView()