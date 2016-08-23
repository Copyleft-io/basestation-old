'use strict';

app.factory("KnownErrorComments", function KnownErrorCommentsFactory(FIREBASE_URL, $firebaseArray) {
  return function(id){
    // snapshot of our data
    var ref = new Firebase(FIREBASE_URL + 'known-errors/' + id + '/comments');
    // returning synchronized array
    return $firebaseArray(ref);
  }
});

console.log('--> basestation/app/known-error/comments.service.js loaded');
