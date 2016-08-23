'use strict';
app.factory('Users', function($firebaseArray, $firebaseObject, FIREBASE_URL){
    var usersRef = new Firebase(FIREBASE_URL+'users');
    var connectedRef = new Firebase(FIREBASE_URL+'.info/connected');
    var users = $firebaseArray(usersRef);
    var Users = {
      getProfile: function(uid){
        return $firebaseObject(usersRef.child(uid));
      },
      getEmail: function(uid){
        return users.$getRecord(uid).email;
      },
      getDisplayName: function(uid){
        return users.$getRecord(uid).displayName;
      },
      getGravatar: function(uid){
        return '//www.gravatar.com/avatar/' + users.$getRecord(uid).emailHash;
      },
      setOnline: function(uid){
        var connected = $firebaseObject(connectedRef);
        var online = $firebaseArray(usersRef.child(uid+'/online'));

        connected.$watch(function (){
          if(connected.$value === true){
            online.$add(true).then(function(connectedRef){
              connectedRef.onDisconnect().remove();
            });
          }
        });
      },
      all: users
    };

    return Users;
  });
  console.log('--> basestation/app/users/users.service.js loaded');
