/**
 * @format
 */

import {AppRegistry} from 'react-native';
import App from './App';
import {name as appName} from './app.json';
import { backgroundSyncHeadlessTask } from './src/services/BackgroundHealthSync';
import { setupBackgroundSync } from './src/services/BackgroundHealthSync';


 AppRegistry.registerComponent(appName, () => App);
AppRegistry.registerComponent('Main', () => App);
AppRegistry.registerHeadlessTask('BackgroundSync', () => backgroundSyncHeadlessTask);
AppRegistry.registerHeadlessTask('BackgroundFetch', () =>
    async (event) => {
        // Import fetchHealthData here if needed
        const { fetchHealthData } = require('./App');
        await fetchHealthData();
    }
);