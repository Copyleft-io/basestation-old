'use strict';

app.controller("SettingsCtrl", function($state, $scope, FIREBASE_URL, $firebaseObject, $firebaseArray, $stateParams, ngTableParams, Settings) {

    $scope.settings = Settings();

    //TODO PUT SETTINGS CODE HERE
    // USE FIREBASE TO STORE APP SETTINGS LIKE ENUMERATED VALUES, MESSAGE CATALOG, ETC

});

console.log('--> basestation/app/settings/settings.controller.js loaded');
