# House Market project notes
## Setup
Brad Traversy's Gist has details for creating read write rules for the Firebase integration [here](https://gist.github.com/bradtraversy/caab8ebd8ff4b6e947632887e0183761).
Included in this link is the setup data for a single listing as well.

As part of the firebase setup, we also created a single collection item for listings and 3 indexes. See details of the indexes below:
![Listing indexes.](https://github.com/MarkCondello/react-house-marketplace/blob/master/src/assets/jpg/listings-indexes.png)

### Authentication
The `sign-up` page uses firebase auth to create new users with username and password crednetials. [View the firebase docs here.](https://firebase.google.com/docs/auth/web/start)

### Adding signed-up users to FireStore
As well as adding users to Authentication, we also add their details to the FireStore from the `sign-up` page. [View the Firestore docs here.](https://firebase.google.com/docs/firestore/manage-data/add-data)

### Authed users
- Logged in user data is stored in an Applications > IndexedDb on the browser console.
- Auth routes are set with the <PrivateRoute /> component which acts as a Controler based on the `loggedIn` boolean value returned from the `useAuthStatus` custom hook. The implementation of the route is like so:

```
<Route path="/profile" element={<PrivateRoute />}>{/* Uses the Outlet component from react-router-dom */}
  <Route path="/profile" element={<Profile />}></Route>
</Route>
```

### Google OAuth login
Included is the option for users to sign in or up with their Google account. This like the manual sign up saves the users details (name, email and timestamp) to the firestore. When the Promises resolve, the image is stored in Firesbase storage and an image url is returned. These image urls are saved under the `imgUrls` property on the listing in Firebase Database.

### Reading listings
A `Category` component which receives either `rent` or `sale` categories, queries Firebase for the associated `listings` saved.

### Geo Location
The Google API Geolocation is used to gather the lat longs for a listing address. An .env located in the root with a property named `REACT_APP_GEOCODE_API_KEY` must be present to call the API and receive the location data.

### Image uploads
[View the firebase docs here.](https://firebase.google.com/docs/storage/web/upload-files#monitor_upload_progress).
The `create listings` feature allows for multiple image uploads. To support this, we have modified the code example in the docs link above and included the Promise.all() API to process all the images uploaded through the file input.
The UUID npm package is used to set a uniqie image ID.
---------

# Getting Started with Create React App

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

The page will reload when you make changes.\
You may also see any lint errors in the console.

### `npm test`

Launches the test runner in the interactive watch mode.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `npm run build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `npm run eject`

**Note: this is a one-way operation. Once you `eject`, you can't go back!**

If you aren't satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you're on your own.

You don't have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn't feel obligated to use this feature. However we understand that this tool wouldn't be useful if you couldn't customize it when you are ready for it.

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).

### Code Splitting

This section has moved here: [https://facebook.github.io/create-react-app/docs/code-splitting](https://facebook.github.io/create-react-app/docs/code-splitting)

### Analyzing the Bundle Size

This section has moved here: [https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size](https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size)

### Making a Progressive Web App

This section has moved here: [https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app](https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app)

### Advanced Configuration

This section has moved here: [https://facebook.github.io/create-react-app/docs/advanced-configuration](https://facebook.github.io/create-react-app/docs/advanced-configuration)

### Deployment

This section has moved here: [https://facebook.github.io/create-react-app/docs/deployment](https://facebook.github.io/create-react-app/docs/deployment)

### `npm run build` fails to minify

This section has moved here: [https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify](https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify)
