import App from '../../App'
import { html, render } from 'lit-html'
import { gotoRoute, anchorRoute } from '../../Router'
import Auth from '../../Auth'
import Utils from '../../Utils'

class GuideView {
    init() {
        document.title = 'Guide'
        this.render()
        Utils.pageIntroAnim()
    }

    render() {
        const template = html `
      <va-app-header title="Guide" user="${JSON.stringify(Auth.currentUser)}"></va-app-header>
      <div class="page-content calign">
        <h3 class="brand-color">Welcome ${Auth.currentUser.firstName}!</h3>
        <p>This is a quick tour to teach you the basics of using Haircuts ...</p>

      
        <sl-button type="primary" @click=${()=> gotoRoute('/')}>Okay got it!</sl-button>
      
      
      </div>
    `
        render(template, App.rootEl)
    }
}


export default new GuideView()