'use strict';

var app = angular.module('basestation', ['firebase','angular-md5','ui.bootstrap','ui.router', 'ngTable', 'ngTagsInput', 'textAngular', 'elasticui', 'elasticsearch'])
  .config(function ($stateProvider, $urlRouterProvider) {
    $stateProvider
      .state('home', {
        url: '/',
        //templateUrl: 'static/home.html',
        resolve: {
          requireNoAuth: function($state, Auth){
            return Auth.$requireAuth().then(function(auth){
              $state.go('dashboard');
            }, function(error){
              $state.go('login');
            });
          }
        }
      })
      .state('login', {
        url: '/login',
        controller: 'AuthCtrl as authCtrl',
        templateUrl: 'auth/login.html',
        resolve: {
          requireNoAuth: function($state, Auth){
            return Auth.$requireAuth().then(function(auth){
              $state.go('dashboard');
            }, function(error){
              return;
            });
          }
        }
      })
      .state('password-reset', {
        url: '/password-reset',
        controller: 'AuthCtrl as authCtrl',
        templateUrl: 'auth/password-reset.html',
        resolve: {
          requireNoAuth: function($state, Auth){
            return Auth.$requireAuth().then(function(auth){
              $state.go('dashboard');
            }, function(error){
              return;
            });
          }
        }
      })
      .state('help', {
        url: '/help',
        //controller: 'HelpCtrl as helpCtrl',
        templateUrl: 'help/help.html'
      })
      /* Removing Registration Route...
      Email Logins should be managed by an admin interface
      This can be done via Firebase Forge in the meantime

      .state('register', {
        url: '/register',
        controller: 'AuthCtrl as authCtrl',
        templateUrl: 'auth/register.html',
        resolve: {
          requireNoAuth: function($state, Auth){
            return Auth.$requireAuth().then(function(auth){
              $state.go('home');
            }, function(error){
              return;
            });
          }
        }
      })*/
      .state('contacts', {
        url: '/contacts',
        //controller: 'HelpCtrl as helpCtrl',
        templateUrl: 'contacts/index.html'
      })
      .state('docs', {
        url: '/docs',
        //controller: 'HelpCtrl as helpCtrl',
        templateUrl: 'docs/index.html'
      })
      .state('links', {
        url: '/links',
        //controller: 'HelpCtrl as helpCtrl',
        templateUrl: 'links/index.html'
      })
      .state('events', {
        url: '/events',
        //controller: 'HelpCtrl as helpCtrl',
        templateUrl: 'events/index.html'
      })
      .state('incidents', {
        url: '/incidents',
        //controller: 'HelpCtrl as helpCtrl',
        templateUrl: 'incidents/index.html'
      })
      .state('problems', {
        url: '/problems',
        //controller: 'HelpCtrl as helpCtrl',
        templateUrl: 'problems/index.html'
      })
      .state('changes', {
        url: '/changes',
        //controller: 'HelpCtrl as helpCtrl',
        templateUrl: 'changes/index.html'
      })
      .state('releases', {
        url: '/releases',
        //controller: 'HelpCtrl as helpCtrl',
        templateUrl: 'releases/index.html'
      })
      .state('applications', {
        url: '/applications',
        //controller: 'HelpCtrl as helpCtrl',
        templateUrl: 'applications/index.html'
      })
      .state('networks', {
        url: '/networks',
        //controller: 'HelpCtrl as helpCtrl',
        templateUrl: 'networks/index.html'
      })
      .state('security', {
        url: '/security',
        //controller: 'HelpCtrl as helpCtrl',
        templateUrl: 'security/index.html'
      })
      .state('settings', {
        url: '/settings',
        //controller: 'HelpCtrl as helpCtrl',
        templateUrl: 'settings/index.html'
      })
      .state('dashboard', {
        url: '/dashboard',
        controller: 'DashboardCtrl as dashboardCtrl',
        templateUrl: 'dashboard/index.html',
        resolve: {
          auth: function($state, Users, Auth){
            return Auth.$requireAuth().catch(function(){
              $state.go('login');
            });
          },
          dashboard: function(Users, Auth){
            return Auth.$requireAuth().then(function(auth){
              return Users.getProfile(auth.uid).$loaded();
            });
          }
        }
      })
      .state('tagged', {
        url: '/tagged/{tag}',
        templateUrl: 'dashboard/tagged.html',
        controller: 'TaggedCtrl as taggedCtrl',
        resolve: {
          auth: function($state, Users, Auth){
            return Auth.$requireAuth().catch(function(){
              $state.go('login');
            });
          }
        }
      })
      .state('directory', {
        url: '/directory',
        controller: 'DirectoryCtrl as directoryCtrl',
        templateUrl: 'directory/index.html',
        resolve: {
          auth: function($state, Users, Auth){
            return Auth.$requireAuth().catch(function(){
              $state.go('login');
            });
          },
          dashboard: function(Users, Auth){
            return Auth.$requireAuth().then(function(auth){
              return Users.getProfile(auth.uid).$loaded();
            });
          }
        }
      })
      .state('directory/user', {
        url: '/directory/user/{userId}',
        templateUrl: 'directory/view.html',
        controller: 'DirectoryCtrl as directoryCtrl',
        resolve: {
          auth: function($state, Users, Auth){
            return Auth.$requireAuth().catch(function(){
              $state.go('home');
            });
          }
        }
      })
      .state('about', {
        url: '/about',
        templateUrl: 'static/about.html'
      })
      .state('known-errors', {
        url: '/known-errors',
        controller: 'KnownErrorsCtrl as knownErrorsCtrl',
        templateUrl: 'known-errors/index.html',
        resolve: {
          requests: function (KnownErrors){
             return KnownErrors();
           },
          auth: function($state, Users, Auth){
            return Auth.$requireAuth().catch(function(){
              $state.go('home');
            });
          }
        }
      })
      .state('known-errors/create', {
        url: '/known-errors/create',
        templateUrl: 'known-errors/create.html',
        controller: 'KnownErrorsCtrl as knownErrorsCtrl',
        resolve: {
          auth: function($state, Users, Auth){
            return Auth.$requireAuth().catch(function(){
              $state.go('home');
            });
          }
        }
      })
      .state('known-errors/view', {
        url: '/known-errors/view/{knownErrorId}',
        templateUrl: 'known-errors/view.html',
        controller: 'KnownErrorsCtrl as knownErrorsCtrl'
      })
      .state('known-errors/edit', {
        url: '/known-errors/edit/{knownErrorId}',
        templateUrl: 'known-errors/edit.html',
        controller: 'KnownErrorsCtrl as knownErrorsCtrl',
        resolve: {
          auth: function($state, Users, Auth){
            return Auth.$requireAuth().catch(function(){
              $state.go('home');
            });
          }
        }
      })
      .state('profile', {
        url: '/profile',
        controller: 'ProfileCtrl as profileCtrl',
        templateUrl: 'users/profile.html',
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
      })
      .state('requests', {
        url: '/requests',
        controller: 'RequestsCtrl as requestsCtrl',
        templateUrl: 'requests/index.html',
        resolve: {
          requests: function (Requests){
             return Requests();
           },
          auth: function($state, Users, Auth){
            return Auth.$requireAuth().catch(function(){
              $state.go('home');
            });
          }
        }
      })
      .state('requests/create', {
        url: '/requests/create',
        templateUrl: 'requests/create.html',
        controller: 'RequestsCtrl as requestsCtrl',
        resolve: {
          auth: function($state, Users, Auth){
            return Auth.$requireAuth().catch(function(){
              $state.go('home');
            });
          }
        }
      })
      .state('requests/view', {
        url: '/requests/view/{requestId}',
        templateUrl: 'requests/view.html',
        controller: 'RequestsCtrl as requestsCtrl',
        resolve: {
          auth: function($state, Users, Auth){
            return Auth.$requireAuth().catch(function(){
              $state.go('home');
            });
          }
        }
      })
      .state('requests/view/{requestId}', {
        url: '/requests/view/{requestId}',
        templateUrl: 'requests/view.html',
        controller: 'RequestsCtrl as requestsCtrl',
        resolve: {
          auth: function($state, Users, Auth){
            return Auth.$requireAuth().catch(function(){
              $state.go('home');
            });
          }
        }
      })
      .state('requests/edit', {
        url: '/requests/edit/{requestId}',
        templateUrl: 'requests/edit.html',
        controller: 'RequestsCtrl as requestsCtrl',
        resolve: {
          auth: function($state, Users, Auth){
            return Auth.$requireAuth().catch(function(){
              $state.go('home');
            });
          }
        }
      })
      .state('teams', {
        url: '/teams',
        controller: 'TeamsCtrl as teamsCtrl',
        templateUrl: 'teams/index.html',
        resolve: {
          teams: function (Teams){
             return Teams();
           },
          auth: function($state, Users, Auth){
            return Auth.$requireAuth().catch(function(){
              $state.go('home');
            });
          }
        }
      })
      .state('teams/create', {
        url: '/teams/create',
        templateUrl: 'teams/create.html',
        controller: 'TeamsCtrl as teamsCtrl',
        resolve: {
          auth: function($state, Users, Auth){
            return Auth.$requireAuth().catch(function(){
              $state.go('home');
            });
          }
        }
      })
      .state('teams/view', {
        url: '/teams/view/{teamId}',
        templateUrl: 'teams/view.html',
        controller: 'TeamsCtrl as teamsCtrl',
        resolve: {
          auth: function($state, Users, Auth){
            return Auth.$requireAuth().catch(function(){
              $state.go('home');
            });
          }
        }
      })
      .state('teams/view/{teamId}', {
        url: '/teams/view/{teamId}',
        templateUrl: 'teams/view.html',
        controller: 'TeamsCtrl as teamsCtrl',
        resolve: {
          auth: function($state, Users, Auth){
            return Auth.$requireAuth().catch(function(){
              $state.go('home');
            });
          }
        }
      })
      .state('teams/edit', {
        url: '/teams/edit/{teamId}',
        templateUrl: 'teams/edit.html',
        controller: 'TeamsCtrl as teamsCtrl',
        resolve: {
          auth: function($state, Users, Auth){
            return Auth.$requireAuth().catch(function(){
              $state.go('home');
            });
          }
        }
      })
      .state('environments', {
        url: '/environments',
        controller: 'EnvironmentsCtrl as environmentsCtrl',
        templateUrl: 'environments/index.html',
        resolve: {
          environments: function (Environments){
             return Environments();
           },
          auth: function($state, Users, Auth){
            return Auth.$requireAuth().catch(function(){
              $state.go('home');
            });
          }
        }
      })
      .state('environments/create', {
        url: '/environments/create',
        templateUrl: 'environments/create.html',
        controller: 'EnvironmentsCtrl as environmentsCtrl',
        resolve: {
          auth: function($state, Users, Auth){
            return Auth.$requireAuth().catch(function(){
              $state.go('home');
            });
          }
        }
      })
      .state('environments/view', {
        url: '/environments/view/{environmentId}',
        templateUrl: 'environments/view.html',
        controller: 'EnvironmentsCtrl as environmentsCtrl',
        resolve: {
          auth: function($state, Users, Auth){
            return Auth.$requireAuth().catch(function(){
              $state.go('home');
            });
          }
        }
      })
      .state('environments/edit', {
        url: '/environments/edit/{environmentId}',
        templateUrl: 'environments/edit.html',
        controller: 'EnvironmentsCtrl as environmentsCtrl',
        resolve: {
          auth: function($state, Users, Auth){
            return Auth.$requireAuth().catch(function(){
              $state.go('home');
            });
          }
        }
      })
      .state('devices', {
        url: '/devices',
        controller: 'DevicesCtrl as devicesCtrl',
        templateUrl: 'devices/index.html',
        resolve: {
          devices: function (Devices){
             return Devices();
           },
          auth: function($state, Users, Auth){
            return Auth.$requireAuth().catch(function(){
              $state.go('home');
            });
          }
        }
      })
      .state('devices/create', {
        url: '/devices/create',
        templateUrl: 'devices/create.html',
        controller: 'DevicesCtrl as devicesCtrl',
        resolve: {
          auth: function($state, Users, Auth){
            return Auth.$requireAuth().catch(function(){
              $state.go('home');
            });
          }
        }
      })
      .state('devices/config', {
        url: '/devices/config/{deviceId}',
        templateUrl: 'devices/config.html',
        controller: 'DevicesCtrl as devicesCtrl',
        resolve: {
          auth: function($state, Users, Auth){
            return Auth.$requireAuth().catch(function(){
              $state.go('home');
            });
          }
        }
      })
      .state('devices/health', {
        url: '/devices/health/{deviceId}',
        templateUrl: 'devices/health.html',
        controller: 'DevicesCtrl as devicesCtrl',
        resolve: {
          auth: function($state, Users, Auth){
            return Auth.$requireAuth().catch(function(){
              $state.go('home');
            });
          }
        }
      })
      .state('devices/view', {
        url: '/devices/view/{deviceId}',
        templateUrl: 'devices/view.html',
        controller: 'DevicesCtrl as devicesCtrl',
        resolve: {
          auth: function($state, Users, Auth){
            return Auth.$requireAuth().catch(function(){
              $state.go('home');
            });
          }
        }
      })
      .state('devices/edit', {
        url: '/devices/edit/{deviceId}',
        templateUrl: 'devices/edit.html',
        controller: 'DevicesCtrl as devicesCtrl',
        resolve: {
          auth: function($state, Users, Auth){
            return Auth.$requireAuth().catch(function(){
              $state.go('home');
            });
          }
        }
      })
      .state('assets', {
        url: '/assets',
        controller: 'AssetsCtrl as assetsCtrl',
        templateUrl: 'assets/index.html',
        resolve: {
          devices: function (Assets){
             return Assets();
           },
          auth: function($state, Users, Auth){
            return Auth.$requireAuth().catch(function(){
              $state.go('home');
            });
          }
        }
      })
      .state('assets/create', {
        url: '/assets/create',
        templateUrl: 'assets/create.html',
        controller: 'AssetsCtrl as assetsCtrl',
        resolve: {
          auth: function($state, Users, Auth){
            return Auth.$requireAuth().catch(function(){
              $state.go('home');
            });
          }
        }
      })
      .state('assets/view', {
        url: '/assets/view/{assetId}',
        templateUrl: 'assets/view.html',
        controller: 'AssetsCtrl as assetsCtrl',
        resolve: {
          auth: function($state, Users, Auth){
            return Auth.$requireAuth().catch(function(){
              $state.go('home');
            });
          }
        }
      })
      .state('assets/edit', {
        url: '/assets/edit/{assetId}',
        templateUrl: 'assets/edit.html',
        controller: 'AssetsCtrl as assetsCtrl',
        resolve: {
          auth: function($state, Users, Auth){
            return Auth.$requireAuth().catch(function(){
              $state.go('home');
            });
          }
        }
      });
    $urlRouterProvider.otherwise('/');
  })
.constant('FIREBASE_URL', 'https://basestation.firebaseio.com/')
/*.constant('FIREBASE_URL', 'https://edo-basestation-dev.firebaseio.com/');*/
.constant('euiHost', '192.168.168.168:9200');
console.log('--> basestation/app/app.js loaded');
