import App from './../../App'
import { html, render } from 'lit-html'
import { gotoRoute, anchorRoute } from './../../Router'
import Auth from './../../Auth'
import Utils from './../../Utils'

class HomeView {
    init() {
        console.log('HomeView.init')
        document.title = 'Dashboard'
        this.render()
        Utils.pageIntroAnim()
    }

    render() {
        const template = html `
      <va-app-header title="Dashboard" user=${JSON.stringify(Auth.currentUser)}></va-app-header>
      <div class="page-content">
      
      </div>
    `
        render(template, App.rootEl)
    }
}

export default new HomeView()