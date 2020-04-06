Prerequisite

Node: https://nodejs.org/en/

React native: https://facebook.github.io/react-native/docs/getting-started

Android sdk: https://developer.android.com/studio


After cloning

After cloning the app open the cmd prompt in mobile directory and run the command npm install


Run on Android

You have to connect hardware device using ADB or run emulator.

Invoke react-native run-android command

To take release build  run the 

cd android/gradlew assembleRelease command


Run on iOS

You have to get Xcode installed on your machine.

Open rockolychef\ios\rockoly.xcworkspace in xcode and run the app

To take release build in iOS

Change the device to Generic iOS Device in the top left and then goto product and select the Archive to take release build

                                               (or)

Open cmd prompt with app directory and run the react-native run-ios command

Others build instructions placed in Mobile folder\instructions\pre_build_config.md . please check the Issues

Section if have faced any build issues


Components Used in Rockoly app


Basic Components:

Calendar: https://github.com/wix/react-native-calendars

UI Components: https://nativebase.io/

Login,Notification: https://rnfirebase.io/

Backend: https://www.apollographql.com/docs/react/

"apollo-client"

"apollo -link-context"

"apollo-link" etc...

Image picker: https://github.com/ivpusic/react-native-image-crop-picker

Facebook login: https://github.com/facebook/react-native-fbsdk

Google sign in : https://github.com/react-native-community/react-native-google-signin

Icons: https://github.com/oblador/react-native-vector-icons

Fetching Location: https://github.com/FaridSafi/react-native-gifted-chat

Chat : https://github.com/FaridSafi/react-native-gifted-chat


Other components refer rockolychef\package.json
