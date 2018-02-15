A. FOR MAC OS:

A.1 iOS build

1. Install Node.js (recommend latest ver. 6.11.2)
Download and install from https://nodejs.org/en/download/

2. Install Cordova: (recommend latest ver. 7.0.1)
sudo npm install -g cordova

3. Install Ionic: (recommend latest ver. 3.9.2)
sudo npm install -g ionic

5. Install Xcode (recommend latest ver. 8.3.3)

In folder of prototype, run:

6. sudo npm install

7. sudo ionic cordova platform add ios

8. sudo chown -v -R -L yourUserName /pathtoYourApp

9. cd platforms/ios/cordova/node_modules/

10. sudo npm install ios-sim@latest

11. Go back to the project folder

12. ionic cordova build ios

13. ionic cordova emulate ios --target="iPhone-7"

A.2 Android build

1. Install Node.js (recommend latest ver. 6.11.2)
Download and install from https://nodejs.org/en/download/

2. Install Cordova: (recommend latest ver. 7.0.1)
sudo npm install -g cordova

3. Install Ionic: (recommend latest ver. 3.9.2)
sudo npm install -g ionic

5. Install Android Studio, JDK (recommend latest versions of both)

In folder of prototype, run:

6. sudo npm install

7. sudo ionic cordova platform add android

8. It might be you have this issue:
"You have not accepted the license agreements of the following SDK components"
Run:
cd ~/Library/Android/sdk/tools/bin
./sdkmanager --licenses

Accept all licenses prompt.

8. ionic cordova build android

9. Open an Android simulator

13. ionic cordova emulate android

B. In Windows

A. Set up the environment

1. Install Node.js

2. Install Cordova:
  npm install -g cordova

3. Install ionic
  npm install -g ionic

4. Install Android SDK for building Android app. Best please install Android Studio to run emulator
5. Install Xcode for building iOS app

B. Install dependencies of prototype
In folder of prototyp, run:
npm install

C. Build the app
4. Add platforms
$ ionic cordova platform add android

C. Build and run the app

For Android:
$ ionic cordova build android
ionic cordova emulate android

or

$ ionic cordova run android

Verification video is recording on real Android device:
https://youtu.be/OLYGw1Wy6wY
