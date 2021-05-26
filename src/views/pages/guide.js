import App from '../../App'
import { html, render } from 'lit-html'
import { gotoRoute, anchorRoute } from '../../Router'
import Auth from '../../Auth'
import Utils from '../../Utils'
import UserAPI from './../../UserAPI'
import Toast from '../../Toast'

class GuideView {
    init() {
        console.log("Guide.init")
        document.title = 'Guide'
        this.render()
            // Utils.pageIntroAnim()
        this.updateCurrentUser()
    }

    async updateCurrentUser() {
        try {
            const updatedUser = await UserAPI.updateUser(Auth.currentUser._id, { newUser: true }, 'json')
        } catch (err) {
            Toast.show(err, 'error')
        }
    }

    handleClick() {
        gotoRoute('/')
    }

    render() {
        const template = html `
      <va-app-header title="Guide" user="${JSON.stringify(Auth.currentUser)}"></va-app-header>
      <div class="page-content calign">
        <h3 class="brand-color">Welcome ${Auth.currentUser.firstName}!</h3>
        <p>This is a quick tour to teach you the basics of using HomeIQ ...</p>
        <p>This page will have meaningful data for the use of HomeIQ, however, in the meantime it will host some work in
          progress information and known bugs that are in the process of being fixed</p>
      
        <ul><strong>Notes to user/guide page:</strong>
          <li>- To use the system a user needs to be signed in - only interatction with it without authentication is sign
            in/sign up</li>
          <li>- Any user can sign up - in the future, a user who is NOT signed and is signing up on behalf of themselves will
            be created inactive and will require an admin to make them active. This is for security purposes.</li>
          <li>- An authenticated/signed in user can create accounts on behalf of others. They will be active by default.</li>
          <li>- Only admins can make other accounts active - in fact, only admins can view other user accounts.</li>
          <li>- Currently the best demo for dynamic data loading from backend into the charts on the dashboard is on the
            second chart - the pie chart. It demonstrates the display of most active devices. This will be further refined
            when more meaningful metrics are determined for display and will be further optimised to run more dynamically. At
            this point this is a proof of concept.</li>
          <li>- Clicking each dashblard item will launch the dialog for direct interation with the item</li>
          <li>- Best responsive demonstration is on dashboard page</li>
          <li>- A good demo of updating backend is by selecting each light's power state (on/off) - currently requires manual page refresh to update</li>
          <li>- A good demo of deleting items is by deleting any item from the devices list page - currently no confirmation dialog and requires manual page refresh to update</li>
        </ul>
      
        <ul><strong>TODO</strong>
          <li>- Menu buttons (icons) have tooltip that says "Home"</li>
          <li>- Empty all arrays when signing out</li>
          <li>- Fix active button indication</li>
          <li>- Clear inputs after signin and signup</li>
          <li>- Add imageURL and bio for user registration</li>
          <li>- Convert admin toggles to actual form values</li>
          <li>- Disable overflow (scroll bar) on signup and sign in pages but allow scrolling</li>
          <li>- Fix focus on sign up and sign in dialogs</li>
          <li>- Condense and streamline all code especially in va-app-header</li>
          <li>- Dynamically append dialogs to the top of the page (over the navbar) (week 9 lecure 51mins though - lit-html)
            and remove on close instead of rendering in body</li>
          <li>- Add username to user collections</li>
          <li>- Hide sidenav when clicking on item?</li>
          <li>- Remove/change scrollbar to look more stylish and discrete while still indicating scrollable content</li>
          <li>- Implement system status and logs menu items</li>
          <li>- Implement notifications and warnings menu items</li>
          <li>- Incorporate push pin with toggle animation</li>
          <li>- Fix responsive layouts for panel views e.g. devices, users, places</li>
          <li style="color:white;">More info on README.md</li>
        </ul>
      
        <sl-button type="primary" @click=${this.handleClick}>Okay got it!</sl-button>
      </div>
    `
        render(template, App.rootEl)
    }
}


export default new GuideView()