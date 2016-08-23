'use strict';

app.factory("Environments", function EnvironmentFactory(FIREBASE_URL, $firebaseArray) {
  return function(){
    // snapshot of our data
    var ref = new Firebase(FIREBASE_URL + 'environments');
    // returning synchronized array
    return $firebaseArray(ref);
  }
});

console.log('--> basestation/app/environments/environments.service.js loaded');
