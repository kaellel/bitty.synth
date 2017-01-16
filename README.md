# bitty.synth
*Technical readme file*

## About

Bitty.synth is a simple music synthesizer designed with multi-touch in mind. Bitty.synth uses “frames” – snapshots of a sound – arranged with a seek to notate music. Individual frames with a common instrument and pace make a canvas. Mix and match up to five canvas sounds and three external sounds in a timeline view to create music, or compose on the fly using live view.

While bitty.synth is designed for touch devices, it also works well with a mouse and a keyboard on a large screen.

Bitty.synth is developed as a hobby, and comes with no warranty. It includes context-based hints for easier music editing.

## License

Bitty.synth is open source. It is distributed under the GNU GPLv3.

## Download and Run

Pre-built binaries include: Android (via Google Play), Linux (64 bit), Windows (64 bit), and HTML standalone.

For Android, download and install bitty.synth from Google Play. Alternatively, directly download, unzip, and install APK manually.  

For Linux, download, unzip, and run `bitty_synth`.

For Windows, download, unzip, and run `bitty_synth.exe`.

The HTML standalone can be run in a web browser (preferably Chrome) or by electron-prebuilt.

Source code is available on Github.

## Build and Distribute with Cordova

Building to mobile platforms (iOS, Android) requires [cordova](http://cordova.apache.org/). Since the code on Github only contains the `www` portion of the application, first create a new Cordova project:

` cordova create bitty.synth com.kaellel.bitty.synth bitty.synth `

Then, add a platform:

` cordova platform add android --save `

Note that to build for Android, one must have Android SDK installed. Ensure that all files in the directory `www` have been updated. Finally, build:

` cordova build `

## Build and Distribute with Electron

To distribute bitty.synth on a desktop platform such as Windows, Linux or macOS, use the prebuilt Electron libraries. For Windows, first, navigate to the `www` folder and package the application using:

` asar pack . app.asar `

Then, move `app.asar` to the directory `dist/resources` in the pre-built Electron folder. Use rcedit to modify version information and icons. Distribute all files under the `dist` directory.

## Help

Usage help is located in `help.html`. It is also accessible in the application.
