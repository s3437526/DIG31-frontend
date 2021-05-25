import App from "./App"
import Auth from './Auth'
import Toast from './Toast'

let headers = {}

class FetchAPI {

    // Get all places function using asynchronous fetch API call
    async getPlacesAsync() {

        // headers = {
        //     "Authorization": `Bearer ${localStorage.accessToken}` //,
        //         // "access": JSON.stringify(currentUser.accessLevel)
        // }
        let response = await fetch(`${App.apiBase}/place`, {
                method: 'GET',
                headers: { "Authorization": `Bearer ${localStorage.accessToken}` }
            })
            // Handle result of API call - if unsuccessful, throw error with customised message
        if (!response.ok) {
            const message = `Problem getting places ${response.status}`
            throw new Error(message)
        }
        // If successful, convert data to JSON and return it to the calling function
        let data = await response.json();
        // console.log(data)
        return data;
    }

    // Get all devices function using asynchronous fetch API call
    async getItemsAsync() {

        headers = {
            "Authorization": `Bearer ${localStorage.accessToken}` //,
                // "access": JSON.stringify(currentUser.accessLevel)
        }
        let response = await fetch(`${App.apiBase}/item`, {
                method: 'GET',
                headers: { "Authorization": `Bearer ${localStorage.accessToken}` }
            })
            // Handle result of API call - if unsuccessful, throw error with customised message
        if (!response.ok) {
            const message = `Problem getting items ${response.status}`
            throw new Error(message)
        }
        // If successful, convert data to JSON and return it to the calling function
        let data = await response.json();
        // console.log(data)
        return data;
    }

    // Get all devices function using asynchronous fetch API call
    async getDevicesAsync() {

        headers = {
            "Authorization": `Bearer ${localStorage.accessToken}` //,
                // "access": JSON.stringify(currentUser.accessLevel)
        }
        let response = await fetch(`${App.apiBase}/device`, {
                method: 'GET',
                headers: {
                    "Authorization": `Bearer ${localStorage.accessToken}`,
                    "access": `${localStorage.accessLevel}`
                }
            })
            // Handle result of API call - if unsuccessful, throw error with customised message
        if (!response.ok) {
            const message = `Problem getting devices ${response.status}`
            throw new Error(message)
        }
        // If successful, convert data to JSON and return it to the calling function
        let data = await response.json();
        // console.log(data)
        return data;
    }

    // Get all devices function using asynchronous fetch API call
    async getLocationsAsync() {

        headers = {
            "Authorization": `Bearer ${localStorage.accessToken}` //,
                // "access": JSON.stringify(currentUser.accessLevel)
        }
        let response = await fetch(`${App.apiBase}/location`, {
                method: 'GET',
                headers: {
                    "Authorization": `Bearer ${localStorage.accessToken}`,
                    "access": `${localStorage.accessLevel}`
                }
            })
            // Handle result of API call - if unsuccessful, throw error with customised message
        if (!response.ok) {
            const message = `Problem getting devices ${response.status}`
            throw new Error(message)
        }
        // If successful, convert data to JSON and return it to the calling function
        let data = await response.json();
        // console.log(data)
        return data;
    }

    // Get all users function using asynchronous fetch API call
    async getUsersAsync() {
        headers = {
            "Authorization": `Bearer ${localStorage.accessToken}` //,
                // "access": JSON.stringify(currentUser.accessLevel)
        }
        let response = await fetch(`${App.apiBase}/user`, {
                method: 'GET',
                headers: {
                    "Authorization": `Bearer ${localStorage.accessToken}`,
                    "access": `${localStorage.accessLevel}`
                }
            })
            // Handle result of API call - if unsuccessful, throw error with customised message
        if (!response.ok) {
            const message = `Problem getting users ${response.status}`
            throw new Error(message)
        }
        // If successful, convert data to JSON and return it to the calling function
        let data = await response.json();
        // console.log(data)
        return data;
    }

    // POST - create place function using asynchronous fetch API call
    async postPlaceAsync(formData) {
        headers = {
            "Authorization": `Bearer ${localStorage.accessToken}` //,
                // "access": JSON.stringify(currentUser.accessLevel)
        }
        let response = await fetch(`${App.apiBase}/place`, {
                method: 'POST',
                headers: {
                    "Authorization": `Bearer ${localStorage.accessToken}`,
                    "access": `${localStorage.accessLevel}`
                        // 'Content-Type': 'application/json'
                },
                // mode: 'cors',
                body: formData
            })
            // Handle result of API call - if unsuccessful, throw error with customised message
        if (!response.ok) {
            Toast.show(`Problem creating place: ${response.status}`)
            const message = `Problem creating place ${response.status}`
            throw new Error(message)
        }
        // If successful, convert data to JSON and return it to the calling function
        let data = await response.json();
        // console.log(data)
        return data;
    }

    // POST - create item function using asynchronous fetch API call
    async postItemAsync(formData) {
        headers = {
            "Authorization": `Bearer ${localStorage.accessToken}` //,
                // "access": JSON.stringify(currentUser.accessLevel)
        }
        let response = await fetch(`${App.apiBase}/item`, {
                method: 'POST',
                headers: {
                    "Authorization": `Bearer ${localStorage.accessToken}`,
                    "access": `${localStorage.accessLevel}`
                        // 'Content-Type': 'application/json'
                },
                // mode: 'cors',
                body: formData
            })
            // Handle result of API call - if unsuccessful, throw error with customised message
        if (!response.ok) {
            Toast.show(`Problem creating item: ${response.status}`)
            const message = `Problem creating item ${response.status}`
            throw new Error(message)
        }
        // If successful, convert data to JSON and return it to the calling function
        let data = await response.json();
        return data;
    }

    // PUT - update item function using asynchronous fetch API call
    async putItemAsync(formData, id) {

        console.log(formData)
        headers = {
            "Authorization": `Bearer ${localStorage.accessToken}` //,
                // "access": JSON.stringify(currentUser.accessLevel)
        }
        let response = await fetch(`${App.apiBase}/item/${id}`, {
                method: 'PUT',
                headers: {
                    "Authorization": `Bearer ${localStorage.accessToken}`,
                    'Content-Type': 'application/json'
                        // 'Content-Type': 'application/json'
                },
                // mode: 'cors',
                body: JSON.stringify(formData)
            })
            // Handle result of API call - if unsuccessful, throw error with customised message
        if (!response.ok) {
            Toast.show(`Problem updating item: ${response.status}`)
            const message = `Problem updating item ${response.status}`
            throw new Error(message)
        }
        // If successful, convert data to JSON and return it to the calling function
        let data = await response.json();
        return data;
    }

    // DELETE - delete item function using asynchronous fetch API call
    async deleteItemAsync(id) {
        console.log(id)
        headers = {
            "Authorization": `Bearer ${localStorage.accessToken}` //,
                // "access": JSON.stringify(currentUser.accessLevel)
        }
        let response = await fetch(`${App.apiBase}/item/${id}`, {
                method: 'DELETE',
                headers: {
                    "Authorization": `Bearer ${localStorage.accessToken}`
                        // 'Content-Type': 'application/json'
                },
                // mode: 'cors',
            })
            // Handle result of API call - if unsuccessful, throw error with customised message
        if (!response.ok) {
            Toast.show(`Problem deleting item: ${response.status}`)
            const message = `Problem deleting item ${response.status}`
            throw new Error(message)
        }
        // If successful, convert data to JSON and return it to the calling function
        let data = await response.json();
        return data;
    }
}
export default new FetchAPI();