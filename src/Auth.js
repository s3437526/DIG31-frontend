import App from './App'
import Router, { gotoRoute } from './Router'
import splash from './views/partials/splash'
import { html, render } from 'lit-html'
import Toast from './Toast'
import FetchAPI from './FetchAPI'

class Auth {

    constructor() {
        this.currentUser = {}
    }

    // async getCurrentUser() {
    //     return this.currentUser
    // }

    async signUp(userData, fail = false, pass = false) {
        const response = await fetch(`${App.apiBase}/user`, {
            method: 'POST',
            body: userData
        })

        console.log(`Auth.js signup method receiving user data as: ${JSON.stringify(userData)}`)
            // if response not ok
        if (!response.ok) {
            // console log error
            const err = await response.json()
            if (err) console.log(err)
                // show error      
            Toast.show(`Problem creating user: ${response.status}`)
                // run fail() functon if set
            if (typeof fail == 'function') fail()
        } else if (response.ok) {
            /// sign up success - show toast and redirect to sign in page
            localStorage.accessLevel >= 1 ?
                Toast.show('Account created') :
                Toast.show('Account created, please sign in')
            pass()
                // redirect to signin
            gotoRoute('/')
        } else {
            // show error      
            // Toast.show(`Problem getting user: ${response.status}`)
        }
    }


    async signIn(userData, fail = false) {
        const response = await fetch(`${App.apiBase}/auth/signin`, {
            method: 'POST',
            body: userData
        })

        // if response not ok
        if (!response.ok) {
            // console log error
            const err = await response.json()
            if (err) console.log(err)
                // show error      
            Toast.show(`Problem signing in: ${err.message}`, 'error')
                // run fail() functon if set
            if (typeof fail == 'function') fail()
            return
        }

        // sign in success
        const data = await response.json()
        Toast.show(`Welcome  ${data.user.firstName}`)
            // save access token (jwt) to local storage
        localStorage.setItem('accessToken', data.accessToken)
            // set current user
        this.currentUser = data.user
        localStorage.setItem('accessLevel', data.user.accessLevel)

        // Initialise router and load all relevant entities
        Router.init()
            // await FetchAPI.getPlacesAsync()
            // await FetchAPI.getItemsAsync()
            // console.log(`Localstorage user is: ${this.currentUser.accessLevel}`)
            // localStorage.accessLevel == 2 ? await FetchAPI.getUsersAsync() : ""
            // redirect to home
        gotoRoute('/')
        window.location.reload()
    }


    async check(success) {
        // show splash screen while loading ...   
        render(splash, App.rootEl)

        // check local token is there
        if (!localStorage.accessToken) {
            // no local token!
            Toast.show("Please sign in")
                // redirect to sign in page      
            gotoRoute('/')
            return
        }

        // token must exist - validate token via the backend
        const response = await fetch(`${App.apiBase}/auth/validate`, {
            method: 'GET',
            headers: {
                "Authorization": `Bearer ${localStorage.accessToken}`
            }
        })

        // if response not ok
        if (!response.ok) {
            // console log error
            const err = await response.json()
            if (err) console.log(err)
                // delete local token
            localStorage.removeItem('accessToken')
            localStorage.removeItem('user')
            localStorage.removeItem('accessLevel')
            Toast.show("session expired, please sign in")
                // redirect to sign in      
            gotoRoute('/')
            return
        }

        // token is valid!
        const data = await response.json()
            // console.log(data)
            // set currentUser obj
        this.currentUser = data.user
            // run success
        success()
    }

    signOut() {
        Toast.show("You are signed out")
            // delete local token
        localStorage.removeItem('accessToken')
        localStorage.removeItem('user')
        localStorage.removeItem('accessLevel')
            // redirect to sign in    
        gotoRoute('/')
        window.location.reload()
            // unset currentUser
        this.currentUser = null
    }
}

export default new Auth()