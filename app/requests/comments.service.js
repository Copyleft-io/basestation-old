'use strict';

app.factory("RequestComments", function RequestCommentsFactory(FIREBASE_URL, $firebaseArray) {
  return function(id){
    // snapshot of our data
    var ref = new Firebase(FIREBASE_URL + 'requests/' + id + '/comments');
    // returning synchronized array
    return $firebaseArray(ref);
  }
});

console.log('--> basestation/app/requests/comments.service.js loaded');
