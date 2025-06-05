/**
 * @format
 */

import {AppRegistry} from 'react-native';
import App from './App';
import {name as appName} from './app.json';
 import { backgroundSyncHeadlessTask } from './src/services/BackgroundHealthSync';


 AppRegistry.registerComponent(appName, () => App);
AppRegistry.registerComponent('Main', () => App);
AppRegistry.registerHeadlessTask('BackgroundSync', () => backgroundSyncHeadlessTask);
