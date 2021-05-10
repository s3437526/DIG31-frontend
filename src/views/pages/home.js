import App from './../../App'
import { html, render } from 'lit-html'
import { gotoRoute, anchorRoute } from './../../Router'
import Auth from './../../Auth'
import Utils from './../../Utils'

class HomeView {
    init() {
        console.log('HomeView.init')
        document.title = 'Sign in/Sign up'
        this.render()
        Utils.pageIntroAnim()
    }

    render() {
        const template = html `
      <va-app-header title="Sign in/Sign up" user=${JSON.stringify(Auth.currentUser)}></va-app-header>
      <div class="page-content">
        <aa-signin-signup-dialog></aa-signin-signup-dialog>
      </div>
    `
        render(template, App.rootEl)
    }
}

export default new HomeView()