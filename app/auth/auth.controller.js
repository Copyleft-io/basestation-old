'use strict';
app.controller('AuthCtrl', function(FIREBASE_URL, Auth, $state, $scope, $rootScope){
    var ref = new Firebase(FIREBASE_URL);
    var authCtrl = this;

    authCtrl.user = {
      email: '',
      password: ''
    };

    authCtrl.login = function (){
      Auth.$authWithPassword(authCtrl.user).then(function (authData){
        console.log("[authCtrl] Email Login Successful with payload ",authData);
        $state.go('dashboard');
      }, function (error){
        authCtrl.error = error;
      });
    };

    authCtrl.resetPassword = function (){
      ref.resetPassword({
        email : authCtrl.user.email
      }, function(error) {
          if (error === null) {
            console.log("Password reset email sent successfully");
            $state.go('dashboard');
          } else {
            console.log("Error sending password reset email:", error);
          }
        });
    };

  });
  console.log('--> basestation/app/auth/auth.controller.js loaded');
