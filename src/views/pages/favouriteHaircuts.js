import App from '../../App'
import { html, render } from 'lit-html'
import { gotoRoute, anchorRoute } from '../../Router'
import Auth from '../../Auth'
import Utils from '../../Utils'

class FavouriteHaircutsView {
    init() {
        document.title = 'Favourite Haircuts'
        this.render()
        Utils.pageIntroAnim()
    }

    render() {
        const template = html `
      <va-app-header title="Favourite Haircuts" user="${JSON.stringify(Auth.currentUser)}"></va-app-header>
      <div class="page-content">        
        <h1>Favourite Haircuts</h1>
        <p>Page content ...</p>
        
      </div>      
    `
        render(template, App.rootEl)
    }
}


export default new FavouriteHaircutsView()