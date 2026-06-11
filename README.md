# Dragon Boat Seating

This is an app to aid captains and coaches in balancing their dragon boats. [View the demo here](https://varoper.github.io/dragonboat-seating/).

## Setting your roster

Add your roster to /rosters/, following the format described in example-rosters.csv

## Saving seating charts

Seating charts can be exported and placed in /charts/. Run `npm run build` to add the new chart to the JSON file in that same directory.

# Running the app

## Available Scripts

In the project directory, you can run:

### `npm run dev`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

The page will reload when you make changes.\
You may also see any lint errors in the console.

### `npm test`

Launches the test runner in the interactive watch mode.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

TODO write tests...

### `npm run build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `npm run charts`

Regenerates the list of saved seating charts.