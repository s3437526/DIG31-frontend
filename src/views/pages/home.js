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
        <!-- <h1 class="anim-in">Hey ${Auth.currentUser.firstName}</h1>
      
              <h3>Button example:</h3>
              <sl-button class="anim-in" @click=${() => gotoRoute('/profile')}>View Profile</sl-button>
              <p>&nbsp;</p>
              <h3>Link example</h3>
              <a href="/profile" @click=${anchorRoute}>View Profile</a> -->
        <!-- <div class="details-group-example">
          <sl-details summary="First">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore
            magna
            aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo
            consequat.
          </sl-details>
      
          <sl-details summary="Second">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore
            magna
            aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo
            consequat.
          </sl-details>
      
          <sl-details summary="Third">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore
            magna
            aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo
            consequat.
          </sl-details>
        </div>
      
        <script>
          const container = document.querySelector('.details-group-example');
      
        // Close all other details when one is shown
        container.addEventListener('sl-show', event => {
          [...container.querySelectorAll('sl-details')].map(details => (details.open = event.target === details));
        });
        </script> -->
     
    `
        render(template, App.rootEl)
    }
}

export default new HomeView()