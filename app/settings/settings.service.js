'use strict';

app.factory("Settings", function SettingFactory(FIREBASE_URL, $firebaseArray) {
  return function(){
    // snapshot of our data
    var ref = new Firebase(FIREBASE_URL + 'settings');
    // returning synchronized array
    return $firebaseArray(ref);
  }
});

console.log('--> basestation/app/settings/settings.service.js loaded');
