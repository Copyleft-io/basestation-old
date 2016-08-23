'use strict';

app.factory("Assets", function DeviceFactory(FIREBASE_URL, $firebaseArray) {
  return function(){
    // snapshot of our data
    var ref = new Firebase(FIREBASE_URL + 'assets');
    // returning synchronized array
    return $firebaseArray(ref);
  }
});

console.log('--> basestation/app/assets/assets.service.js loaded');
