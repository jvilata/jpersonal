echo PASSWORD: &&Denia2020
jarsigner -verbose -sigalg SHA1withRSA -digestalg SHA1 -keystore d:\quasar\jpersonal\vidawm.p12 d:\quasar\jpersonal\dist\cordova\android\apk\release\app-release-unsigned.apk vidawm

zipalign -v 4 d:\quasar\jpersonal\dist\cordova\android\apk\release\app-release-unsigned.apk d:\quasar\jpersonal\dist\cordova\android\apk\release\edicomrrhh.apk