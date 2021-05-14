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

    async render(users) {
            const template = html `
      <style>
        .users-table{
          width: 100%;
          border-bottom: 1px solid;
        }

        .col1{
          width: 10%;
        }

        .col2{
          width: 70%;
          text-align: left;
        }

        .col3{
          width: 10%;
          text-align: left;
        }

        .col4{
          width: 10%;
          cursor: pointer;
          /* display: flex;
          align-items: center;
          justify-content: center; */
        }

        tr{
          /* margin: .5rem 0; */
        }
      </style>
      <link href="https://fonts.googleapis.com/icon?family=Material+Icons" rel="stylesheet">
      <va-app-header title="Users" user="${JSON.stringify(Auth.currentUser)}"></va-app-header>
      <div class="page-content">
        <aa-panel-template title=${document.title}>
          <div slot="body">
            <table class="users-table">
              <thead>
                <th class="col1"></th>
                <th class="col2">User Name</th>
                <th class="col3">Status</th>
                <th class="col4">Modify</th>
              </thead>
              <tbody>
                ${users.map(user => html`
                  <tr>
                    <td class=""><img src=${user.imageURL === "" ? html `
                      <div class="material-icons">account_circle</div>
                      ` : html `
                      ${user.imageURL}`} 
                      alt="${`${user.firstName} image`}"/>
                    </td>
                    ${console.log(user.imageURL)}
                    <td class="">${user.firstName} ${user.lastName}</td>
                    <td class="">${user.status ? "Active" : "Inactive"}</td>
                    <td class="material-icons">handyman</td>
                  </tr>
                  `
                )}
              </tbody>
            </table>
          </div>
        </aa-panel-template>
      </div>      
    `
        render(template, App.rootEl)
    }
}


export default new UsersView()