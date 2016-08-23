'use strict';

app.factory("KnownErrors", function RequestFactory(FIREBASE_URL, $firebaseArray) {
  return function(){
    // snapshot of our data
    var ref = new Firebase(FIREBASE_URL + 'known-errors');
    // returning synchronized array
    return $firebaseArray(ref);
  }
});

console.log('--> basestation/app/known-errors/known-errors.service.js loaded');
