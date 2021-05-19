# DIG31-frontend
Front end development for DIG31

npm install
npm install --save lit-element lit-html

Notes to user/guide page:
- To use the system a user needs to be signed in - only interatction with it without authentication is sign in/sign up
- Any user can sign up - in the future, a user who is NOT signed and is signing up on behalf of themselves will be created inactive and will require an admin to make them active. This is for security purposes.
- An authenticated/signed in user can create accounts on behalf of others. They will be active by default.
- Only admins can make other accounts active - in fact, only admins can view other user accounts.
- Currently the best demo for dynamic data loading from backend into the charts on the dashboard is on the second chart - the pie chart. It demonstrates the display of most active devices. This will be further refined when more meaningful metrics are determined for display and will be further optimised to run more dynamically. At this point this is a proof of concept.
- 
- Clicking each dashblard item will launch the dialog for direct interation with the item
- 
- Best responsive demonstration is on dashboard page
- 

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