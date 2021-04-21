import App from '../../App'
import { html, render } from 'lit-html'
import { gotoRoute, anchorRoute } from '../../Router'
import Auth from '../../Auth'
import Utils from '../../Utils'

class HaircutsView {
    init() {
        document.title = 'Haircuts'
        this.render()
        Utils.pageIntroAnim()
    }

    render() {
        const template = html `
      <va-app-header title="Haircuts" user="${JSON.stringify(Auth.currentUser)}"></va-app-header>
      <div class="page-content">        
        <h1>Haircuts</h1>
        <p>Page content ...</p>
        
      </div>      
    `
        render(template, App.rootEl)
    }
}


export default new HaircutsView()