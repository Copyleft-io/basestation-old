'use strict';

app.factory("Devices", function DeviceFactory(FIREBASE_URL, $firebaseArray) {
  return function(){
    // snapshot of our data
    var ref = new Firebase(FIREBASE_URL + 'devices');
    // returning synchronized array
    return $firebaseArray(ref);
  }
});

console.log('--> basestation/app/devices/devices.service.js loaded');
