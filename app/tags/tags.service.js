'use strict';

app.factory("Tags", function RequestMessageFactory(FIREBASE_URL, $firebaseArray) {
  return function(id){
    // snapshot of our data
    var ref = new Firebase(FIREBASE_URL + 'tags');
    // returning synchronized array
    return $firebaseArray(ref);
  }
});

console.log('--> basestation/app/tags/tags.service.js loaded');
