import App from '../../App'
import { html, render } from 'lit-html'
import { gotoRoute, anchorRoute } from '../../Router'
import Auth from '../../Auth'
import Utils from '../../Utils'
import FetchAPI from '../../FetchAPI'

class UsersView {
    async init() {
        document.title = 'Users'
        let users = await FetchAPI.getUsersAsync()
        await this.render(users)
        Utils.pageIntroAnim()
    }

    handleClick(user) {
        // console.log(`User selected... ${JSON.stringify(user)}`)
        gotoRoute('/profile', Auth.currentUser)
        console.log(Auth.currentUser)
    }

    async render(users) {
            const template = html `
      <style>
        .active{
          color: lightgreen;
        }

        .inactive{
          color: red;
        }

        .image{
          height: 100%;
          width: auto;
        }

        .grid-container{
          display: grid;
          width: 100%;
          grid-template-columns: 10% 40% 40% 10%;
        }

        .header{
          font-weight: 900;
          font-size: 1.2rem;
        }

        .cols{
          border-bottom: 1px solid;
          display: flex;
          justify-content: center;
          align-items: center;
          width: 100%;
          height: 4rem;
          padding: 0.5rem 0;
        }

        .col1{
        }

        .col2{
          justify-content: flex-start;
          padding: 0 1rem;
        }

        .col3{

        }

        .col4{
          justify-content: flex-end;
        }

        .link{
          cursor: pointer;
        }

        .col1 .material-icons{
          font-size: 48px !important;
        }

        div::part(body){
          /* background: orange; */
        }

      </style>
      <link href="https://fonts.googleapis.com/icon?family=Material+Icons" rel="stylesheet">
      <va-app-header title="Users" user="${JSON.stringify(Auth.currentUser)}"></va-app-header>
      <div class="page-content">
        <aa-panel-template title=${document.title}>
          <div slot="table-heading">
            <div class="grid-container">
              <div class="cols col1 header">
                <div></div>
              </div>
              <div class="cols col2 header">
                <div>User Name</div>
              </div>
              <div class="cols col3 header">
                <div>Status</div>
              </div>
              <div class="cols col4 header">
                <div></div>
              </div>
            </div>
          </div>
          <div slot="body" part="body">
            <div class="grid-container">
              ${users.map(user => 
                html`
              <div class="cols col1">
                  ${user.imageURL === "" ? html `
                      <div class="material-icons">account_circle</div>
                      ` : html `    
                      <img src=${`${App.apiBase}/images/${user.imageURL}`} 
                            alt="${`${user.firstName} image`}"
                            class="image"/>
                    `}
                </div>
                <div class="cols col2">
                  <div>${user.firstName} ${user.lastName}</div>
                </div>
                <div class="cols col3">
                  <div class=${user.status ? "active" : "inactive"}>${user.status ? "Active" : "Inactive"}</div>
                </div>
                <div class="cols col4">
                  <div class="material-icons link" @click=${() => this.handleClick(user)}>handyman</div>
                </div>
              </div>
              `
                )}
                </div>
            </div>
          </div>
        </aa-panel-template>
      </div>      
    `
        render(template, App.rootEl)
    }
}


export default new UsersView()