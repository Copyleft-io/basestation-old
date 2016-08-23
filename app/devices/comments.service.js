'use strict';

app.factory("DeviceComments", function DeviceCommentsFactory(FIREBASE_URL, $firebaseArray) {
  return function(id){
    // snapshot of our data
    var ref = new Firebase(FIREBASE_URL + 'devices/' + id + '/comments');
    // returning synchronized array
    return $firebaseArray(ref);
  }
});

console.log('--> basestation/app/device/comments.service.js loaded');
