'use strict';

app.factory("AssetComments", function AssetCommentsFactory(FIREBASE_URL, $firebaseArray) {
  return function(id){
    // snapshot of our data
    var ref = new Firebase(FIREBASE_URL + 'assets/' + id + '/comments');
    // returning synchronized array
    return $firebaseArray(ref);
  }
});

console.log('--> basestation/app/asset/comments.service.js loaded');
