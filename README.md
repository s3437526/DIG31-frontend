# DIG31-frontend
Front end development for DIG31

npm install
npm install --save lit-element lit-html

Notes to user/guide page:
- To use the system a user needs to be signed in - only interatction with it without authentication is sign in/sign up
- Any user can sign up - in the future, a user who is NOT signed and is signing up on behalf of themselves will be created inactive and will require an admin to make them active. This is for security purposes.
- An authenticated/signed in user can create accounts on behalf of others. They will be active by default.
- Only admins can make other accounts active - in fact, only admins can view other user accounts.
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
- Sign in dialog (when launched from logged in user) does not allow clicking outside it to dismiss it even though it should
- Implement system status and logs menu items
- Implement notifications and warnings menu items
- Add GSAP animation to device status lights
- Incorporate push pin with toggle animation