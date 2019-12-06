#### To disable warning yellowbox 
- console.disableYellowBox = false in App.js
- useReactotron : false in Constants


To install openssl in windows : https://code.google.com/archive/p/openssl-for-windows/downloads

To create key store 
- keytool -genkeypair -v -keystore debug.keystore -alias androiddebugkey -keyalg RSA -keysize 2048 -validity 10000

Run this command in android/app 
To get SHA1 
  - keytool -list -v -alias androiddebugkey -keystore ./debug.keystore
  https://console.firebase.google.com/u/1/project/rockoly-dev/settings/general/android:com.rockoly.chef
  https://console.firebase.google.com/u/1/project/rockoly/settings/general/android:com.rockoly.chef
To get the hashkey 
updated the key bottom android section :https://developers.facebook.com/apps/499226790899527/settings/basic/
  - keytool -exportcert -alias androiddebugkey -keystore ./debug.keystore | openssl sha1 -binary | openssl base64
  - keytool -exportcert -alias rockolyreleasekey -keystore ./my-release-key.keystore | openssl sha1 -binary | openssl base64


### DEV BUILD

## Android
To run dev build in android mobile - 
- npm run android:dev


## IOS
To run dev build in ios
- npm run ios:dev

***Issues***
To fix Rn Fetch blob pod install issue 
- Change the s.dependency 'React/Core' to s.dependency 'React-Core' in the /Users/neosme/Desktop/ChefApp/rockolychef/node_modules/rn-fetch-blob/rn-fetch-blob.podspec


To fix react-native-fbsdk 
- node modules/react-native-fbsdk/android/builld.gradle
-  def DEFAULT_FACEBOOK_SDK_VERSION = "[5.0,6.0[ -> def DEFAULT_FACEBOOK_SDK_VERSION   = "[5.0,5.11.0[



### PROD BUILD

https://bundlephobia.com/scan