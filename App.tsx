/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React from 'react';
import {
  SafeAreaView,
  StyleSheet,
  Text,

} from 'react-native';
import Login from './src/screens/login/Login';




function App(): React.JSX.Element {


  return (
    <SafeAreaView >
      <Login></Login>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({

});

export default App;
