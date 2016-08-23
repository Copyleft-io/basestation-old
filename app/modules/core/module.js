'use strict';
/*
$.getScript('/modules/core/users/users.service.js',function(){});
$.getScript('/modules/core/users/profile.controller.js',function(){});
$.getScript('/modules/core/auth/auth.service.js',function(){});
$.getScript('/modules/core/auth/auth.controller.js',function(){});
*/
app.config(function ($stateProvider, $urlRouterProvider) {
    $stateProvider
      .state('home', {
        url: '/',
        templateUrl: 'modules/core/static/home.html',
        resolve: {
          requireNoAuth: function($state, Auth){
            return Auth.$requireAuth().then(function(auth){
              $state.go('about');
            }, function(error){
              return;
            });
          }
        }
      })
      .state('about', {
        url: '/about',
        templateUrl: 'modules/core/static/about.html'
      })
      .state('login', {
        url: '/login',
        controller: 'AuthCtrl as authCtrl',
        templateUrl: 'modules/core/auth/login.html',
        resolve: {
          requireNoAuth: function($state, Auth){
            return Auth.$requireAuth().then(function(auth){
              $state.go('home');
            }, function(error){
              return;
            });
          }
        }
      })
      .state('register', {
        url: '/register',
        controller: 'AuthCtrl as authCtrl',
        templateUrl: 'modules/core/auth/register.html',
        resolve: {
          requireNoAuth: function($state, Auth){
            return Auth.$requireAuth().then(function(auth){
              $state.go('home');
            }, function(error){
              return;
            });
          }
        }
      })
      .state('profile', {
        url: '/profile',
        controller: 'ProfileCtrl as profileCtrl',
        templateUrl: 'modules/core/users/profile.html',
        resolve: {
          auth: function($state, Users, Auth){
            return Auth.$requireAuth().catch(function(){
              $state.go('home');
            });
          },
          profile: function(Users, Auth){
            return Auth.$requireAuth().then(function(auth){
              return Users.getProfile(auth.uid).$loaded();
            });
          }
        }
      });

    $urlRouterProvider.otherwise('/');
  });

  console.log('--> basestation/app/modules/core/module.js loaded');
