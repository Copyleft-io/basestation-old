'use strict';

app.factory("Requests", function RequestFactory(FIREBASE_URL, $firebaseArray) {
  return function(){
    // snapshot of our data
    var ref = new Firebase(FIREBASE_URL + 'requests');
    // returning synchronized array
    return $firebaseArray(ref);
  }
});

console.log('--> basestation/app/requests/requests.service.js loaded');
