import App from "./App"
import Auth from './Auth'

let headers = {}

class FetchAPI {

    // Get all posts function using asynchronous fetch API call
    async getPlacesAsync(currentUser) {

        headers = {
            "Authorization": `Bearer ${localStorage.accessToken}` //,
                // "access": JSON.stringify(currentUser.accessLevel)
        }
        let response = await fetch(`${App.apiBase}/place`, {
                method: 'GET',
                headers: { "Authorization": `Bearer ${localStorage.accessToken}` }
            })
            // Handle result of API call - if unsuccessful, throw error with customised message
        if (!response.ok) {
            const message = `Problem getting places ${response.status}`
            throw new Error(message)
        }
        // If successful, converd data to JSON and return it to the calling function
        let data = await response.json();
        console.log(data)
        return data;
    }
}
export default new FetchAPI();