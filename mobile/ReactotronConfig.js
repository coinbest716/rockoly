/** @format */

// /** @format */

// import Reactotron from "reactotron-react-native";
// import { reactotronRedux as reduxPlugin } from "reactotron-redux";

// console.disableYellowBox = true;

// Reactotron.configure({ name: "Rockoly" });

// Reactotron.useReactNative({
//   asyncStorage: { ignore: ["secret"] },
// });

// Reactotron.use(reduxPlugin());

// if (__DEV__) {
//   Reactotron.connect();
//   Reactotron.clear();
// }

// console.tron = Reactotron;

import Reactotron from 'reactotron-react-native'
import AsyncStorage from '@react-native-community/async-storage'

console.disableYellowBox = true

Reactotron.setAsyncStorageHandler(AsyncStorage) // AsyncStorage would either come from `react-native` or `@react-native-community/async-storage` depending on where you get it from
  .configure({
    name: 'Rockoly',
  })
  .useReactNative({
    asyncStorage: false, // there are more options to the async storage.
    networking: {
      // optionally, you can turn it off with false.
      // ignoreUrls: /symbolicate/
    },
    editor: false, // there are more options to editor
    errors: {veto: stackFrame => false}, // or turn it off with false
    overlay: false, // just turning off overlay
  })
  .connect()
