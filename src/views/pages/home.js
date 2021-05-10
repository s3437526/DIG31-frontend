import App from './../../App'
import { html, render } from 'lit-html'
import { gotoRoute, anchorRoute } from './../../Router'
import Auth from './../../Auth'
import Utils from './../../Utils'
// import SignInSignup from './../../components/aa-signin-signup-panel'

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
        <aa-signin-signup-panel></aa-signin-signup-panel>
      </div>
    `
        render(template, App.rootEl)
    }
}

export default new HomeView()