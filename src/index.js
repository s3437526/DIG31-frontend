import App from './App.js'

// components (custom web components)
import './components/va-app-header'
import './components/aa-accordion-button'
import './components/aa-panel-template'

// styles
import './scss/master.scss'

// app.init
document.addEventListener('DOMContentLoaded', () => {
    App.init()
})