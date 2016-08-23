'use strict';

app.factory("Teams", function DeviceFactory(FIREBASE_URL, $firebaseArray) {
  return function(){
    // snapshot of our data
    var ref = new Firebase(FIREBASE_URL + 'teams');
    // returning synchronized array
    return $firebaseArray(ref);
  }
});

console.log('--> basestation/app/teams/teams.service.js loaded');
