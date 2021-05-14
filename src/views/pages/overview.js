import App from '../../App'
import { html, render } from 'lit-html'
import { gotoRoute, anchorRoute } from '../../Router'
import Auth from '../../Auth'
import Utils from '../../Utils'

class OverviewView {
    init() {
        document.title = 'Overview'
        this.render()
        Utils.pageIntroAnim()
    }

    render() {
        const template = html `
      <va-app-header title="Overview" user="${JSON.stringify(Auth.currentUser)}"></va-app-header>
      <div class="page-content">        
        <h1>Overview</h1>
        <p>Page content ...</p>
        
      </div>      
    `
        render(template, App.rootEl)
    }
}


export default new OverviewView()