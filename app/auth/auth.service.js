'use strict';
app.factory('Auth', function($firebaseAuth, FIREBASE_URL){
    var ref = new Firebase(FIREBASE_URL);
    var auth = $firebaseAuth(ref);
    return auth;
  });
console.log('--> basestation/app/auth/auth.service.js loaded');
