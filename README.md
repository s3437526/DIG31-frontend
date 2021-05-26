# DIG31-frontend
Front end development for DIG31

npm install
npm install --save lit-element lit-html

Notes to user/guide page:
- To use the system a user needs to be signed in - the only interatction with it without authentication is sign in/sign up
- Any user can sign up - in the future, a user who is NOT signed and is signing up on behalf of themselves will be created inactive and will require an admin to make them active. This is for security purposes.
- An authenticated/signed in user can create accounts on behalf of others. They will be active by default.
- Only admins can make other accounts active and change the user type - in fact, only admins can view other user accounts.
- Currently the best demo for dynamic data loading from backend into the charts on the dashboard is on the second chart - the pie chart. It demonstrates the display of most active devices. This will be further refined when more meaningful metrics are determined for display and will be further optimised to run more dynamically. At this point this is a proof of concept.
- A good demo of adding to the backend is by selecting ANY dropdown "Register" menu item. Currently requires page refresh to update.
- A good demo of updating backend is by selecting each light's power state (on/off) - currently requires manual page refresh to update
- A good demo of deleting items is by deleting any item from the devices list page (admin user only) - currently there is no confirmation dialog and requires manual page refresh to update
- Future iterations of the app will implement clicking each dashblard item. This will launch the dialog for direct interation with the item
- Best responsive size demonstration is on dashboard page


# Best demonstration of assessment rubric:
# 1 Essential functionality

## Backend

- User routes - all endpoints tested with front end via CRUD operations, with Create, Update and Delete being available to admin users only.
- Auth - all endpoints tested with any user signing in and making requests.
- User databse collections - all contain dynamically loaded and stored image urls
- User endpoint - includes functionality to process and upload of profile/avatar images as per assignment specification and Dan's week 9 lecutre (at the end) update.

## Frontend

- Sign in page - implemented via dialog
- Sign up page - implemented via dialog
- Guide/intro page - implemented after signing in as first time user
- Home page - implemented as dashboard via the "Dashboard" menu link (hamburger menu). This will be the main page for the app.
- Profile page - implemented via the "Manage Account" menu link.
- Sign out functionality - implemented via top menu dropdown.

# 2 Technical Execution

## Javascript

- Classes have been used
- Fetch has been used

## Setup and Frameworks

- SPA was used
- Shoelace components and ChartJs were used

## Styling (SCSS)

- SCSS was used for styling reusability - where possible even within custom components
- CSS @media queries were used for responsiveness - please refer above for best list of responsive elements

## Build Tools and Package Managers

- NPM was used
- Parcel was used

## Quality Assurance & Hosting

- Where possible, HTML, CSS and Javascript were checked for major errors. Noting that the online checkers return minor warnings.
- Back and front end hosted under the following URLs:
- https://aalduk-backend.herokuapp.com/
- https://elated-nightingale-5e8652.netlify.app/

Please refer to above comments regaring online hosting issues.

# 3 User experience

## UX Flow

- Interaction is as per assignment 2 (proposal) with strict adherence to logical and smooth experience for user. Please note above comments of work in progress for some features which require manual page refreshes for updates to display.
- Content engagement and relevance were the main focus of the app.

## Responsive Development

- App reponsiveness across all devices was a priority, however, please refer to above notes on best demonstration of responsiveness.
- CSS media queries were utilised throughout the project. Please refer to above notes for further information on responsiveness.
- App tested across two major browsers - Chrome and Firefox.

## Animation

- GSAP animation was utilised on the devices page with the flashing icons to indicate device activity.
- Chart.Js includes animation
- More animation will be implemented in future iterations where they will continue to provide meaningful and purposeful impact

# Visual Design

- As per Assignment 2 (proposal), the aim of the app is to be functional and visually appealing including appealing and purposeful layout, colour theory and typography.

TODO
- Menu buttons (icons) have tooltip that says "Home"
- Empty all arrays when signing out
- Fix active button indication
- Clear inputs after signin and signup
- Add imageURL and bio for user registration
- Add image upload
- Convert admin toggles to actual form values
- Disable overflow (scroll bar) on signup and sign in pages but allow scrolling
- Fix focus on sign up and sign in dialogs
- Condense and streamline all code especially in va-app-header
- Dynamically append dialogs to the top of the page (over the navbar) (week 9 lecure 51mins though - lit-html) and remove on close instead of rendering in body
- Add username to user collections
- Hide sidenav when clicking on item?
- Remove/change scrollbar to look more stylish and discrete while still indicating scrollable content
- Implement system status and logs menu items
- Implement notifications and warnings menu items
- Add GSAP animation to device status lights
- Incorporate push pin with toggle animation
- Fix responsive layouts for panel views e.g. devices, users, places
- Transfer all get (user, place, item) calls and data structures to feed into va-app-header for more global availability
- Add random colours to each entity type, ensuring no existing close colours exist already (for chart display)
- Change arrays of durations and activity history to external logs?
- Fix stuttering/staggering of dropdown selection in register place dialog when activating the dropdown
- Make register place dialog change icon when place type is selected from dropdown
- Register places dialog needs to allow cancelling and hide even if fields are empty. Currently this is not allowed.
- Make home view the overview and home to show blank home screen for aesthetics when signed out rather than an empty overview panel
- Firefox (only) shows error when signing in where user fetch request fails. Users loaded correctly however. Looks like a timing issue that is a non-issue. Chrome does not report this error.
- Implement manage user feature (bring up register user dialog and send data as PUT rather than post)
- Places menu link should list all DEVICES for the selected place
- Register device sliders (shoelace) labels and help text do not seem to work
- Register device dropdown text disappears when dropdown is not in focus. Text reappears on hover over respective box. Look at hoisting to fix this sl anomaly.
- Looks like clicking on icons in menu do not trigger the desired menu selection event. Have to click on the menu text to make it work at the moment.
- Make all bad toasts red with error class
- Register item when in basic mode needs to append default values
- Login credentials unsecured visible in dev tools??
- When signed out cannot go back to the signin screeen from sign up
- Device view dialog disappears if selecting dropdown and clicking away from it. Looks to be caused by the sl-after-hide statement which removes the dialog from the page. Look at hoisting to fix this issue.
- Dialogs do not refresh when adding and deleting devices
- Send selected user data to profile page via the goToRoute() function
- Guide page works but there are errors that come up with failing to load resources. It appears to be to do with the multiple renderings of the home page. This does NOT affect the opeartion of the program. Attempted to troubleshoot but was unable to fix given the submission timeline. Will address after submission.
- 