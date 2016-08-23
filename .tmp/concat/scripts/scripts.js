'use strict';

var app = angular.module('basestation', ['firebase','angular-md5','ui.bootstrap','ui.router', 'ngTable', 'ngTagsInput', 'textAngular', 'elasticui', 'elasticsearch'])
  .config(["$stateProvider", "$urlRouterProvider", function ($stateProvider, $urlRouterProvider) {
    $stateProvider
      .state('home', {
        url: '/',
        //templateUrl: 'static/home.html',
        resolve: {
          requireNoAuth: ["$state", "Auth", function($state, Auth){
            return Auth.$requireAuth().then(function(auth){
              $state.go('dashboard');
            }, function(error){
              $state.go('login');
            });
          }]
        }
      })
      .state('login', {
        url: '/login',
        controller: 'AuthCtrl as authCtrl',
        templateUrl: 'auth/login.html',
        resolve: {
          requireNoAuth: ["$state", "Auth", function($state, Auth){
            return Auth.$requireAuth().then(function(auth){
              $state.go('dashboard');
            }, function(error){
              return;
            });
          }]
        }
      })
      .state('password-reset', {
        url: '/password-reset',
        controller: 'AuthCtrl as authCtrl',
        templateUrl: 'auth/password-reset.html',
        resolve: {
          requireNoAuth: ["$state", "Auth", function($state, Auth){
            return Auth.$requireAuth().then(function(auth){
              $state.go('dashboard');
            }, function(error){
              return;
            });
          }]
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
          auth: ["$state", "Users", "Auth", function($state, Users, Auth){
            return Auth.$requireAuth().catch(function(){
              $state.go('login');
            });
          }],
          dashboard: ["Users", "Auth", function(Users, Auth){
            return Auth.$requireAuth().then(function(auth){
              return Users.getProfile(auth.uid).$loaded();
            });
          }]
        }
      })
      .state('tagged', {
        url: '/tagged/{tag}',
        templateUrl: 'dashboard/tagged.html',
        controller: 'TaggedCtrl as taggedCtrl',
        resolve: {
          auth: ["$state", "Users", "Auth", function($state, Users, Auth){
            return Auth.$requireAuth().catch(function(){
              $state.go('login');
            });
          }]
        }
      })
      .state('directory', {
        url: '/directory',
        controller: 'DirectoryCtrl as directoryCtrl',
        templateUrl: 'directory/index.html',
        resolve: {
          auth: ["$state", "Users", "Auth", function($state, Users, Auth){
            return Auth.$requireAuth().catch(function(){
              $state.go('login');
            });
          }],
          dashboard: ["Users", "Auth", function(Users, Auth){
            return Auth.$requireAuth().then(function(auth){
              return Users.getProfile(auth.uid).$loaded();
            });
          }]
        }
      })
      .state('directory/user', {
        url: '/directory/user/{userId}',
        templateUrl: 'directory/view.html',
        controller: 'DirectoryCtrl as directoryCtrl',
        resolve: {
          auth: ["$state", "Users", "Auth", function($state, Users, Auth){
            return Auth.$requireAuth().catch(function(){
              $state.go('home');
            });
          }]
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
          requests: ["KnownErrors", function (KnownErrors){
             return KnownErrors();
           }],
          auth: ["$state", "Users", "Auth", function($state, Users, Auth){
            return Auth.$requireAuth().catch(function(){
              $state.go('home');
            });
          }]
        }
      })
      .state('known-errors/create', {
        url: '/known-errors/create',
        templateUrl: 'known-errors/create.html',
        controller: 'KnownErrorsCtrl as knownErrorsCtrl',
        resolve: {
          auth: ["$state", "Users", "Auth", function($state, Users, Auth){
            return Auth.$requireAuth().catch(function(){
              $state.go('home');
            });
          }]
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
          auth: ["$state", "Users", "Auth", function($state, Users, Auth){
            return Auth.$requireAuth().catch(function(){
              $state.go('home');
            });
          }]
        }
      })
      .state('profile', {
        url: '/profile',
        controller: 'ProfileCtrl as profileCtrl',
        templateUrl: 'users/profile.html',
        resolve: {
          auth: ["$state", "Users", "Auth", function($state, Users, Auth){
            return Auth.$requireAuth().catch(function(){
              $state.go('home');
            });
          }],
          profile: ["Users", "Auth", function(Users, Auth){
            return Auth.$requireAuth().then(function(auth){
              return Users.getProfile(auth.uid).$loaded();
            });
          }]
        }
      })
      .state('requests', {
        url: '/requests',
        controller: 'RequestsCtrl as requestsCtrl',
        templateUrl: 'requests/index.html',
        resolve: {
          requests: ["Requests", function (Requests){
             return Requests();
           }],
          auth: ["$state", "Users", "Auth", function($state, Users, Auth){
            return Auth.$requireAuth().catch(function(){
              $state.go('home');
            });
          }]
        }
      })
      .state('requests/create', {
        url: '/requests/create',
        templateUrl: 'requests/create.html',
        controller: 'RequestsCtrl as requestsCtrl',
        resolve: {
          auth: ["$state", "Users", "Auth", function($state, Users, Auth){
            return Auth.$requireAuth().catch(function(){
              $state.go('home');
            });
          }]
        }
      })
      .state('requests/view', {
        url: '/requests/view/{requestId}',
        templateUrl: 'requests/view.html',
        controller: 'RequestsCtrl as requestsCtrl',
        resolve: {
          auth: ["$state", "Users", "Auth", function($state, Users, Auth){
            return Auth.$requireAuth().catch(function(){
              $state.go('home');
            });
          }]
        }
      })
      .state('requests/view/{requestId}', {
        url: '/requests/view/{requestId}',
        templateUrl: 'requests/view.html',
        controller: 'RequestsCtrl as requestsCtrl',
        resolve: {
          auth: ["$state", "Users", "Auth", function($state, Users, Auth){
            return Auth.$requireAuth().catch(function(){
              $state.go('home');
            });
          }]
        }
      })
      .state('requests/edit', {
        url: '/requests/edit/{requestId}',
        templateUrl: 'requests/edit.html',
        controller: 'RequestsCtrl as requestsCtrl',
        resolve: {
          auth: ["$state", "Users", "Auth", function($state, Users, Auth){
            return Auth.$requireAuth().catch(function(){
              $state.go('home');
            });
          }]
        }
      })
      .state('teams', {
        url: '/teams',
        controller: 'TeamsCtrl as teamsCtrl',
        templateUrl: 'teams/index.html',
        resolve: {
          teams: ["Teams", function (Teams){
             return Teams();
           }],
          auth: ["$state", "Users", "Auth", function($state, Users, Auth){
            return Auth.$requireAuth().catch(function(){
              $state.go('home');
            });
          }]
        }
      })
      .state('teams/create', {
        url: '/teams/create',
        templateUrl: 'teams/create.html',
        controller: 'TeamsCtrl as teamsCtrl',
        resolve: {
          auth: ["$state", "Users", "Auth", function($state, Users, Auth){
            return Auth.$requireAuth().catch(function(){
              $state.go('home');
            });
          }]
        }
      })
      .state('teams/view', {
        url: '/teams/view/{teamId}',
        templateUrl: 'teams/view.html',
        controller: 'TeamsCtrl as teamsCtrl',
        resolve: {
          auth: ["$state", "Users", "Auth", function($state, Users, Auth){
            return Auth.$requireAuth().catch(function(){
              $state.go('home');
            });
          }]
        }
      })
      .state('teams/view/{teamId}', {
        url: '/teams/view/{teamId}',
        templateUrl: 'teams/view.html',
        controller: 'TeamsCtrl as teamsCtrl',
        resolve: {
          auth: ["$state", "Users", "Auth", function($state, Users, Auth){
            return Auth.$requireAuth().catch(function(){
              $state.go('home');
            });
          }]
        }
      })
      .state('teams/edit', {
        url: '/teams/edit/{teamId}',
        templateUrl: 'teams/edit.html',
        controller: 'TeamsCtrl as teamsCtrl',
        resolve: {
          auth: ["$state", "Users", "Auth", function($state, Users, Auth){
            return Auth.$requireAuth().catch(function(){
              $state.go('home');
            });
          }]
        }
      })
      .state('environments', {
        url: '/environments',
        controller: 'EnvironmentsCtrl as environmentsCtrl',
        templateUrl: 'environments/index.html',
        resolve: {
          environments: ["Environments", function (Environments){
             return Environments();
           }],
          auth: ["$state", "Users", "Auth", function($state, Users, Auth){
            return Auth.$requireAuth().catch(function(){
              $state.go('home');
            });
          }]
        }
      })
      .state('environments/create', {
        url: '/environments/create',
        templateUrl: 'environments/create.html',
        controller: 'EnvironmentsCtrl as environmentsCtrl',
        resolve: {
          auth: ["$state", "Users", "Auth", function($state, Users, Auth){
            return Auth.$requireAuth().catch(function(){
              $state.go('home');
            });
          }]
        }
      })
      .state('environments/view', {
        url: '/environments/view/{environmentId}',
        templateUrl: 'environments/view.html',
        controller: 'EnvironmentsCtrl as environmentsCtrl',
        resolve: {
          auth: ["$state", "Users", "Auth", function($state, Users, Auth){
            return Auth.$requireAuth().catch(function(){
              $state.go('home');
            });
          }]
        }
      })
      .state('environments/edit', {
        url: '/environments/edit/{environmentId}',
        templateUrl: 'environments/edit.html',
        controller: 'EnvironmentsCtrl as environmentsCtrl',
        resolve: {
          auth: ["$state", "Users", "Auth", function($state, Users, Auth){
            return Auth.$requireAuth().catch(function(){
              $state.go('home');
            });
          }]
        }
      })
      .state('devices', {
        url: '/devices',
        controller: 'DevicesCtrl as devicesCtrl',
        templateUrl: 'devices/index.html',
        resolve: {
          devices: ["Devices", function (Devices){
             return Devices();
           }],
          auth: ["$state", "Users", "Auth", function($state, Users, Auth){
            return Auth.$requireAuth().catch(function(){
              $state.go('home');
            });
          }]
        }
      })
      .state('devices/create', {
        url: '/devices/create',
        templateUrl: 'devices/create.html',
        controller: 'DevicesCtrl as devicesCtrl',
        resolve: {
          auth: ["$state", "Users", "Auth", function($state, Users, Auth){
            return Auth.$requireAuth().catch(function(){
              $state.go('home');
            });
          }]
        }
      })
      .state('devices/config', {
        url: '/devices/config/{deviceId}',
        templateUrl: 'devices/config.html',
        controller: 'DevicesCtrl as devicesCtrl',
        resolve: {
          auth: ["$state", "Users", "Auth", function($state, Users, Auth){
            return Auth.$requireAuth().catch(function(){
              $state.go('home');
            });
          }]
        }
      })
      .state('devices/health', {
        url: '/devices/health/{deviceId}',
        templateUrl: 'devices/health.html',
        controller: 'DevicesCtrl as devicesCtrl',
        resolve: {
          auth: ["$state", "Users", "Auth", function($state, Users, Auth){
            return Auth.$requireAuth().catch(function(){
              $state.go('home');
            });
          }]
        }
      })
      .state('devices/view', {
        url: '/devices/view/{deviceId}',
        templateUrl: 'devices/view.html',
        controller: 'DevicesCtrl as devicesCtrl',
        resolve: {
          auth: ["$state", "Users", "Auth", function($state, Users, Auth){
            return Auth.$requireAuth().catch(function(){
              $state.go('home');
            });
          }]
        }
      })
      .state('devices/edit', {
        url: '/devices/edit/{deviceId}',
        templateUrl: 'devices/edit.html',
        controller: 'DevicesCtrl as devicesCtrl',
        resolve: {
          auth: ["$state", "Users", "Auth", function($state, Users, Auth){
            return Auth.$requireAuth().catch(function(){
              $state.go('home');
            });
          }]
        }
      })
      .state('assets', {
        url: '/assets',
        controller: 'AssetsCtrl as assetsCtrl',
        templateUrl: 'assets/index.html',
        resolve: {
          devices: ["Assets", function (Assets){
             return Assets();
           }],
          auth: ["$state", "Users", "Auth", function($state, Users, Auth){
            return Auth.$requireAuth().catch(function(){
              $state.go('home');
            });
          }]
        }
      })
      .state('assets/create', {
        url: '/assets/create',
        templateUrl: 'assets/create.html',
        controller: 'AssetsCtrl as assetsCtrl',
        resolve: {
          auth: ["$state", "Users", "Auth", function($state, Users, Auth){
            return Auth.$requireAuth().catch(function(){
              $state.go('home');
            });
          }]
        }
      })
      .state('assets/view', {
        url: '/assets/view/{assetId}',
        templateUrl: 'assets/view.html',
        controller: 'AssetsCtrl as assetsCtrl',
        resolve: {
          auth: ["$state", "Users", "Auth", function($state, Users, Auth){
            return Auth.$requireAuth().catch(function(){
              $state.go('home');
            });
          }]
        }
      })
      .state('assets/edit', {
        url: '/assets/edit/{assetId}',
        templateUrl: 'assets/edit.html',
        controller: 'AssetsCtrl as assetsCtrl',
        resolve: {
          auth: ["$state", "Users", "Auth", function($state, Users, Auth){
            return Auth.$requireAuth().catch(function(){
              $state.go('home');
            });
          }]
        }
      });
    $urlRouterProvider.otherwise('/');
  }])
.constant('FIREBASE_URL', 'https://basestation.firebaseio.com/')
/*.constant('FIREBASE_URL', 'https://edo-basestation-dev.firebaseio.com/');*/
.constant('euiHost', '192.168.168.168:9200');
console.log('--> basestation/app/app.js loaded');

'use strict';

app.factory("Settings", ["FIREBASE_URL", "$firebaseArray", function SettingFactory(FIREBASE_URL, $firebaseArray) {
  return function(){
    // snapshot of our data
    var ref = new Firebase(FIREBASE_URL + 'settings');
    // returning synchronized array
    return $firebaseArray(ref);
  }
}]);

console.log('--> basestation/app/settings/settings.service.js loaded');

'use strict';

app.controller("SettingsCtrl", ["$state", "$scope", "FIREBASE_URL", "$firebaseObject", "$firebaseArray", "$stateParams", "ngTableParams", "Settings", function($state, $scope, FIREBASE_URL, $firebaseObject, $firebaseArray, $stateParams, ngTableParams, Settings) {

    $scope.settings = Settings();

    //TODO PUT SETTINGS CODE HERE
    // USE FIREBASE TO STORE APP SETTINGS LIKE ENUMERATED VALUES, MESSAGE CATALOG, ETC

}]);

console.log('--> basestation/app/settings/settings.controller.js loaded');

'use strict';
app.factory('Auth', ["$firebaseAuth", "FIREBASE_URL", function($firebaseAuth, FIREBASE_URL){
    var ref = new Firebase(FIREBASE_URL);
    var auth = $firebaseAuth(ref);
    return auth;
  }]);
console.log('--> basestation/app/auth/auth.service.js loaded');

'use strict';
app.controller('AuthCtrl', ["FIREBASE_URL", "Auth", "$state", "$scope", "$rootScope", function(FIREBASE_URL, Auth, $state, $scope, $rootScope){
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

  }]);
  console.log('--> basestation/app/auth/auth.controller.js loaded');

'use strict';
app.factory('Users', ["$firebaseArray", "$firebaseObject", "FIREBASE_URL", function($firebaseArray, $firebaseObject, FIREBASE_URL){
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
  }]);
  console.log('--> basestation/app/users/users.service.js loaded');

'use strict';
app.service('User', ["FIREBASE_URL", "$firebaseAuth", "Users", function(FIREBASE_URL, $firebaseAuth, Users){

// A Convience Service for getting authenticated user information id and email

var User = this;
var ref = new Firebase(FIREBASE_URL);
var authObj = $firebaseAuth(ref);
var userObj = {
  uid: '',
  email: ''
};

User.getId = function(){
  return userObj.uid;
};

User.getEmail = function(){
  return userObj.email;
};

// RUNS ON INITIALIZATION AND ON AUTH CHANGES
authObj.$onAuth(function(authData) {
  if (authData) {
    console.log("[user service] authenticated User is logged in as:", authData.uid);
    userObj.uid = authData.uid;
    userObj.email = authData.password.email;
    return userObj;
      } else {
    console.log("[user service] authenticated user Logged out");
    userObj = {
      uid: '',
      email: ''
    };
    console.log("[user service] returned user:", userObj);
    return userObj;
  }
});


}]);

'use strict';
app.controller('ProfileCtrl', ["FIREBASE_URL", "$state", "Auth", "md5", "auth", "profile", "User", "Users", function(FIREBASE_URL, $state, Auth, md5, auth, profile, User, Users){
    var ref = new Firebase(FIREBASE_URL);
    var profileCtrl = this;

    profileCtrl.profile = profile;
    profileCtrl.updateProfile = function(){
      profileCtrl.profile.email = auth.password.email;
      profileCtrl.profile.emailHash = md5.createHash(auth.password.email);
      //profileCtrl.profile.gravatar = Users.getGravatar(User.getId);
      profileCtrl.profile.$save().then(function(){
        $state.go('dashboard');
      });
    };
    profileCtrl.logout = function(){
      profileCtrl.profile.online = null;
      profileCtrl.profile.$save().then(function(){
        Auth.$unauth();
        $state.go('login');
      });
    };
    profileCtrl.changePassword = function(){
      ref.changePassword({
        email       :  profileCtrl.profile.email,
        oldPassword :  profileCtrl.profile.currentPassword,
        newPassword :  profileCtrl.profile.newPassword
      }, function(error) {
          if (error === null) {
            console.log("Password changed successfully");
            profileCtrl.profile.currentPassword = '';
            profileCtrl.profile.newPassword = '';
          } else {
            console.log("Error changing password:", error);
          }
      });
    };
  }]);

console.log('--> basestation/app/users.profile.js loaded');

'use strict';

app.factory("Teams", ["FIREBASE_URL", "$firebaseArray", function DeviceFactory(FIREBASE_URL, $firebaseArray) {
  return function(){
    // snapshot of our data
    var ref = new Firebase(FIREBASE_URL + 'teams');
    // returning synchronized array
    return $firebaseArray(ref);
  }
}]);

console.log('--> basestation/app/teams/teams.service.js loaded');

'use strict';

app.controller("TeamsCtrl", ["$state", "$scope", "$location", "FIREBASE_URL", "$firebaseObject", "$firebaseArray", "$stateParams", "ngTableParams", "$filter", "Teams", "User", function($state, $scope, $location, FIREBASE_URL, $firebaseObject, $firebaseArray, $stateParams, ngTableParams, $filter, Teams, User) {

    $scope.teams = Teams();


    // Create a New Team and Add to firebaseArray
    $scope.create = function(team) {
      $scope.teams.createdBy = User.getEmail();
      $scope.teams.createdById = User.getId();
      $scope.teams.createdAt = Firebase.ServerValue.TIMESTAMP;

      $scope.teams.$add(team).then(function() {
        console.log('team Created');
        //$location.path('/devices');
        $state.go('teams');

      }).catch(function(error) {
        console.log(error);
      });
    };

    // Deletes an Existing Team firebaseObject
    $scope.delete = function(team) {
        // THIS WORKS
        var deviceRef = new Firebase(FIREBASE_URL + 'teams/' + team.$id);
        var confirm = window.confirm("Are you sure you want to delete team: " + team.name + "?");
        if(confirm == true) {
          deviceRef.remove(onDelete);
          $state.go('teams');
        } else {
          console.log('Team was not deleted');
        }

        var onDelete = function(error) {
          if (error) {
            console.log('Team Delete Failed');
          } else {
            console.log('Team Delete Succeeded');
            $state.go('teams');
          }
        };

      };

    // getTeam on init for /team/edit/:id route
    $scope.getTeam = function() {
      var ref = new Firebase(FIREBASE_URL + 'teams');
      $scope.team = $firebaseObject(ref.child($stateParams.teamId));
    };

    // Update an Existing Team and save it
    $scope.update = function() {
      // save firebaseObject
      $scope.team.$save().then(function(){
        console.log('team Updated');
        // redirect to /devices path after update
        //$location.path('/teams');
        $location.path('/teams/view/' + $stateParams.teamId);
        //$state.go('teams');
      }).catch(function(error){
        console.log(error);
      });
    };

    // Since the data is asynchronous we'll need to use the $loaded promise.
    // Once data is available we'll set the data variable and init the ngTable
    $scope.teams.$loaded().then(function(devices) {
      console.log(teams.length); // data is loaded here
      var data = teams;

      $scope.tableTeams = new ngTableParams({
            page: 1,            // show first page
            count: 10,          // count per page
            sorting: { name: 'asc' }    // initial sorting
        }, {
            total: data.length, // length of data
            getData: function($defer, params) {
                // use build-in angular filter
                var orderedData = params.sorting() ? $filter('filter')(data, params.filter()) : data;
                $defer.resolve(orderedData.slice((params.page() - 1) * params.count(), params.page() * params.count()));
            }
        });

    });

    // Listening for list updates to Teams to update Table
    var ref = new Firebase(FIREBASE_URL + 'teams');
    var list = $firebaseArray(ref);
    list.$watch(function(event) {
      console.log(event);
      $scope.teams.$loaded().then(function(){
        $scope.tableTeams.reload();
      });
    });


    // Listening for Child removed
    //
    //var ref = new Firebase(FIREBASE_URL + 'environments');
    // $scope.environments.on('child_removed', function() {
    //   console.log('/environments child removed');
    //    $scope.tableEnvironments.reload();
    //  });



     // logs { event: "child_removed", key: "foo" }
    //  list.$remove({
    //    console.log('Environments List Updated... List Item Added');
    //  });

     // logs { event: "child_added", key: "<new _id>", prevId: "<prev_id>" }
    //  list.$add({
    //    console.log('Environments List Updated... List Item Removed');
    //  });

}]);

console.log('--> basestation/app/teams/teams.controller.js loaded');

'use strict';
app.controller('NavbarCtrl', ["$scope", "$state", "$firebaseAuth", "FIREBASE_URL", "Users", function($scope, $state, $firebaseAuth, FIREBASE_URL, Users){

    var ref = new Firebase(FIREBASE_URL);
    $scope.authObj = $firebaseAuth(ref);
    //$scope.userObj = null;
    $scope.loggedin = false;

    // RUNS ON INITIALIZATION AND ON AUTH CHANGES
    $scope.authObj.$onAuth(function(authData) {
      if (authData) {
        console.log("[onAuth] Logged in as:", authData.uid);
        $scope.userObj = Users.getProfile(authData.uid);
        $scope.loggedin = true;
        console.log($scope.userObj);
        console.log("User logged in: ", $scope.loggedin);
      } else {
        console.log("[onAuth] Logged out");
        $scope.userObj = {};
        $scope.loggedin = false;
        console.log($scope.userObj);
        console.log("User logged in: ", $scope.loggedin);
      }
    });

    // $scope.login = function(){
    //   $scope.authObj.$authWithPassword({
    //     email: $scope.user.email,
    //     password: $scope.user.password
    //     }).then(function(authData) {
    //         console.log("[authWithPassword] Logged in as:", authData.uid);
    //     }).catch(function(error) {
    //         console.error("[authWithPassword] Authentication failed:", error);
    //     });
    // };
    //
    $scope.logout = function(){
       $scope.authObj.$unauth();
       console.log("[unauth] Logged out");
       $state.go('login');
     };

  }]);

console.log('--> basestation/app/navbar/navbar.controller.js loaded');

'use strict';

app.service("esClient", ["esFactory", function (esFactory) {
  return esFactory({
    //host: 'http://localhost:9200/'
    // Currently Points to Virtual Instance Managed via Test Kitchen and Copyleft-Basestation Cookbook in Copyleft Chef-Repo
    host: 'http://192.168.168.168:9200/'
  });
}]);

console.log('--> basestation/app/elasticsearch/elastic.service.js loaded');

'use strict';

app.controller('DashboardCtrl', ["$state", "$scope", "esClient", "esFactory", function($state, $scope, esClient, esFactory){
    var DashboardCtrl = this;
        $scope.totalIncidents = incidentCount;
        $scope.totalProblems = problemCount;
        $scope.totalChanges = changeCount;
        $scope.totalRequests = requestCount;


    //Elastic Search Query For Count of Type: Incident
    var incidentCount = esClient.count({
      type: 'incident'
      }, function (error, response) {
       console.log(response.count);
       $scope.totalIncidents = response.count;
       // ...
      });

    //Elastic Search Query For Count of Type: Problem
    var problemCount = esClient.count({
      type: 'problem'
      }, function (error, response) {
       console.log(response.count);
       $scope.totalProblems = response.count;
       // ...
      });

    //Elastic Search Query For Count of Type: Change
    var changeCount = esClient.count({
      type: 'change'
      }, function (error, response) {
       console.log(response.count);
       $scope.totalChanges = response.count;
       // ...
      });

    //Elastic Search Query For Count of Type: Request
    var requestCount = esClient.count({
      type: 'request'
      }, function (error, response) {
       console.log(response.count);
       $scope.totalRequests = response.count;
       // ...
      });

  }]);

console.log('--> basestation/app/dashboard/dashboard.controller.js loaded');

'use strict';


app.controller("TaggedCtrl", ["$state", "$scope", "$stateParams", "FIREBASE_URL", "Users", "esClient", function($state, $scope, $stateParams, FIREBASE_URL, Users, esClient) {

    $scope.users = Users;
    $scope.getIdsByTag = function() {
        esClient.search({
            q: $stateParams.tag
        }, function (error, response) {
            console.log(response.hits);
            $scope.tagged || ($scope.tagged  = {});
            $scope.tag = $stateParams.tag;
            $scope.tagged[$scope.tag] = response.hits.hits;
            console.log(response.hits);
        });
    };

}]);

console.log('--> basestation/app/tagged.controller.js loaded');

'use strict';
app.controller('DirectoryCtrl', ["$state", "$scope", "FIREBASE_URL", "$firebaseObject", "$firebaseArray", "$stateParams", "ngTableParams", "$filter", "Users", function($state, $scope, FIREBASE_URL, $firebaseObject, $firebaseArray, $stateParams, ngTableParams, $filter, Users){

    var usersRef = new Firebase(FIREBASE_URL+'users');
    $scope.users = $firebaseArray(usersRef);

    // getUser on /directory/user/view/:id route
    $scope.getUser = function() {
    var ref = new Firebase(FIREBASE_URL + 'users');
    $scope.user = $firebaseObject(ref.child($stateParams.userId));
    };

    // Since the data is asynchronous we'll need to use the $loaded promise.
    // Once data is available we'll set the data variable and init the ngTable
    $scope.users.$loaded().then(function(users) {
      console.log(users.length); // data is loaded here
      var data = users;

      $scope.tableDirectory = new ngTableParams({
            page: 1,            // show first page
            count: 10,          // count per page
            sorting: { title: 'asc' }    // initial sorting
        }, {
            total: data.length, // length of data
            getData: function($defer, params) {
                // use build-in angular filter
                var orderedData = params.sorting() ? $filter('filter')(data, params.filter()) : data;
                $defer.resolve(orderedData.slice((params.page() - 1) * params.count(), params.page() * params.count()));
            }
        });

    });

    // Listening for list updates to Procedures to update Table
    var ref = new Firebase(FIREBASE_URL + 'users');
    var list = $firebaseArray(ref);
    list.$watch(function(event) {
      console.log(event);
      $scope.users.$loaded().then(function(){
        $scope.tableDirectory.reload();
      });
    });

}]);

console.log('--> basestation/app/directory.controller.js loaded');

'use strict';

app.factory("Requests", ["FIREBASE_URL", "$firebaseArray", function RequestFactory(FIREBASE_URL, $firebaseArray) {
  return function(){
    // snapshot of our data
    var ref = new Firebase(FIREBASE_URL + 'requests');
    // returning synchronized array
    return $firebaseArray(ref);
  }
}]);

console.log('--> basestation/app/requests/requests.service.js loaded');

'use strict';

app.factory("RequestComments", ["FIREBASE_URL", "$firebaseArray", function RequestCommentsFactory(FIREBASE_URL, $firebaseArray) {
  return function(id){
    // snapshot of our data
    var ref = new Firebase(FIREBASE_URL + 'requests/' + id + '/comments');
    // returning synchronized array
    return $firebaseArray(ref);
  }
}]);

console.log('--> basestation/app/requests/comments.service.js loaded');

'use strict';

app.controller("RequestsCtrl", ["$state", "$scope", "$location", "FIREBASE_URL", "$firebaseObject", "$firebaseArray", "$stateParams", "ngTableParams", "$filter", "Requests", "RequestComments", "User", function($state, $scope, $location, FIREBASE_URL, $firebaseObject, $firebaseArray, $stateParams, ngTableParams, $filter, Requests, RequestComments, User) {

    $scope.requests = Requests();
    $scope.requestComments = RequestComments($stateParams.requestId);
    $scope.newRequestComment = {};

    var usersRef = new Firebase(FIREBASE_URL+'users');
    $scope.users = $firebaseArray(usersRef);

    // add a new request
    $scope.create = function(request) {
      request.createdBy = User.getEmail();
      request.createdById = User.getId();
      request.createdAt = Firebase.ServerValue.TIMESTAMP;
      $scope.requests.$add(request).then(function() {
        //console.log('request Created by', User.getEmail());
        //$location.path('/requests');
        $state.go('requests');

      }).catch(function(error) {
        console.log(error);
      });
    };

    // remove an request
    $scope.delete = function(request) {
      // THIS WORKS
      var requestRef = new Firebase(FIREBASE_URL + 'requests/' + request.$id);
      var confirm = window.confirm("Are you sure you want to delete request: " + request.title + "?");
      if(confirm == true) {
        requestRef.remove(onDelete);
        $state.go('requests');
      } else {
        console.log('Request was not deleted');
      }

      var onDelete = function(error) {
        if (error) {
          console.log('Request Delete Failed');
        } else {
          console.log('Request Delete Succeeded');
          $state.go('requests');
        }
      };
    };

    // getRequest on init for /requests/edit/:id route
    $scope.getRequest = function() {
      var ref = new Firebase(FIREBASE_URL + 'requests');
      $scope.request = $firebaseObject(ref.child($stateParams.requestId));
    };

    // update a request and save it
    $scope.update = function(request) {
      var timestamp = new Date().toString();
      // save firebaseObject
      $scope.request.$save().then(function(){
        console.log('request Updated');
        // redirect to /request path after update
        //$location.path('/requests');
        $location.path('/requests/view/' + $stateParams.requestId);
//        $state.go('requests/view/' + $stateParams.requestId);
      }).catch(function(error){
        console.log(error);
      });
    };

    // Since the data is asynchronous we'll need to use the $loaded promise.
    // Once data is available we'll set the data variable and init the ngTable
    $scope.requests.$loaded().then(function(requests) {
      console.log(requests.length); // data is loaded here
      var data = requests;

      $scope.tableRequests = new ngTableParams({
            page: 1,            // show first page
            count: 10,          // count per page
            sorting: { title: 'asc' }    // initial sorting
        }, {
            total: data.length, // length of data
            getData: function($defer, params) {
                // use build-in angular filter
                var orderedData = params.sorting() ? $filter('filter')(data, params.filter()) : data;
                $defer.resolve(orderedData.slice((params.page() - 1) * params.count(), params.page() * params.count()));
            }
        });

    });

    // Listening for list updates to Requests to update Table
    var ref = new Firebase(FIREBASE_URL + 'requests');
    var list = $firebaseArray(ref);
    list.$watch(function(event) {
      console.log(event);
      $scope.requests.$loaded().then(function(){
        $scope.tableRequests.reload();
      });
    });


    // Add a request comment
    $scope.addComment = function(requestComment) {
        console.log('Add Request Message Clicked');
        var timestamp = new Date().toString();
        requestComment.createdBy = User.getEmail();
        requestComment.createdById = User.getId();
        requestComment.createdAt = Firebase.ServerValue.TIMESTAMP;
        $scope.requestComments.$add(requestComment).then(function() {
          console.log('requestComment Created');
          // Remove New Message From Form
          $scope.newRequestComment = {};
        }).catch(function(error) {
          console.log(error);
        });



    };
    // Listening for Child removed
    //
    //var ref = new Firebase(FIREBASE_URL + 'environments');
    // $scope.environments.on('child_removed', function() {
    //   console.log('/environments child removed');
    //    $scope.tableEnvironments.reload();
    //  });



     // logs { event: "child_removed", key: "foo" }
    //  list.$remove({
    //    console.log('Environments List Updated... List Item Added');
    //  });

     // logs { event: "child_added", key: "<new _id>", prevId: "<prev_id>" }
    //  list.$add({
    //    console.log('Environments List Updated... List Item Removed');
    //  });

}]);

console.log('--> basestation/app/requests/requests.controller.js loaded');

'use strict';

app.factory("Environments", ["FIREBASE_URL", "$firebaseArray", function EnvironmentFactory(FIREBASE_URL, $firebaseArray) {
  return function(){
    // snapshot of our data
    var ref = new Firebase(FIREBASE_URL + 'environments');
    // returning synchronized array
    return $firebaseArray(ref);
  }
}]);

console.log('--> basestation/app/environments/environments.service.js loaded');

'use strict';

app.controller("EnvironmentsCtrl", ["$state", "$scope", "FIREBASE_URL", "$firebaseObject", "$firebaseArray", "$stateParams", "ngTableParams", "$filter", "Environments", function($state, $scope, FIREBASE_URL, $firebaseObject, $firebaseArray, $stateParams, ngTableParams, $filter, Environments) {

    $scope.environments = Environments();

    // add a new environment
    $scope.create = function() {
      $scope.environments.$add({
        title: $scope.environment.title,
        description: $scope.environment.description
      }).then(function() {
        console.log('environment Created');
        //$location.path('/environments');
        $state.go('environments');

      }).catch(function(error) {
        console.log(error);
      });
    };

    // remove an environment
    $scope.delete = function(environment) {
        $scope.environments.$remove(environment).then(function(){
            console.log('environment Deleted');
            //$scope.tableEnvironments.reload();
        }).catch(function(error){
            console.log(error);
        });
    };

    // getenvironment on init for /environment/edit/:id route
    $scope.getEnvironment = function() {
      var ref = new Firebase(FIREBASE_URL + 'environments');
      $scope.environment = $firebaseObject(ref.child($stateParams.environmentId));
    };

    // update an environment and save it
    $scope.update = function() {
      // save firebaseObject
      $scope.environment.$save().then(function(){
        console.log('environment Updated');
        // redirect to /environments path after update
        //$location.path('/environments');
        $state.go('environments');
      }).catch(function(error){
        console.log(error);
      });
    };

    // Since the data is asynchronous we'll need to use the $loaded promise.
    // Once data is available we'll set the data variable and init the ngTable
    $scope.environments.$loaded().then(function(environments) {
      console.log(environments.length); // data is loaded here
      var data = environments;

      $scope.tableEnvironments = new ngTableParams({
            page: 1,            // show first page
            count: 10,          // count per page
            sorting: { title: 'asc' }    // initial sorting
        }, {
            total: data.length, // length of data
            getData: function($defer, params) {
                // use build-in angular filter
                var orderedData = params.sorting() ? $filter('filter')(data, params.filter()) : data;
                $defer.resolve(orderedData.slice((params.page() - 1) * params.count(), params.page() * params.count()));
            }
        });

    });

    // Listening for list updates to Environments to update Table
    var ref = new Firebase(FIREBASE_URL + 'environments');
    var list = $firebaseArray(ref);
    list.$watch(function(event) {
      console.log(event);
      $scope.environments.$loaded().then(function(){
        $scope.tableEnvironments.reload();
      });
    });

    // Listening for Child removed
    //
    //var ref = new Firebase(FIREBASE_URL + 'environments');
    // $scope.environments.on('child_removed', function() {
    //   console.log('/environments child removed');
    //    $scope.tableEnvironments.reload();
    //  });



     // logs { event: "child_removed", key: "foo" }
    //  list.$remove({
    //    console.log('Environments List Updated... List Item Added');
    //  });

     // logs { event: "child_added", key: "<new _id>", prevId: "<prev_id>" }
    //  list.$add({
    //    console.log('Environments List Updated... List Item Removed');
    //  });

}]);

console.log('--> basestation/app/environments/environments.controller.js loaded');

'use strict';

app.factory("Devices", ["FIREBASE_URL", "$firebaseArray", function DeviceFactory(FIREBASE_URL, $firebaseArray) {
  return function(){
    // snapshot of our data
    var ref = new Firebase(FIREBASE_URL + 'devices');
    // returning synchronized array
    return $firebaseArray(ref);
  }
}]);

console.log('--> basestation/app/devices/devices.service.js loaded');

'use strict';

app.factory("DeviceComments", ["FIREBASE_URL", "$firebaseArray", function DeviceCommentsFactory(FIREBASE_URL, $firebaseArray) {
  return function(id){
    // snapshot of our data
    var ref = new Firebase(FIREBASE_URL + 'devices/' + id + '/comments');
    // returning synchronized array
    return $firebaseArray(ref);
  }
}]);

console.log('--> basestation/app/device/comments.service.js loaded');

'use strict';

app.controller("DevicesCtrl", ["$state", "$scope", "$location", "FIREBASE_URL", "$firebaseObject", "$firebaseArray", "$stateParams", "ngTableParams", "$filter", "Devices", "DeviceComments", "Environments", "User", function($state, $scope, $location, FIREBASE_URL, $firebaseObject, $firebaseArray, $stateParams, ngTableParams, $filter, Devices, DeviceComments, Environments, User) {

    $scope.devices = Devices();
    $scope.deviceComments = DeviceComments($stateParams.deviceId);
    $scope.newDeviceComment = {};
    $scope.environments = Environments();

    // Create a New Device and Add to firebaseArray
    $scope.create = function(device) {
      $scope.device.createdBy = User.getEmail();
      $scope.device.createdById = User.getId();
      $scope.device.createdAt = Firebase.ServerValue.TIMESTAMP;

      $scope.devices.$add(device).then(function() {
        console.log('device Created');
        //$location.path('/devices');
        $state.go('devices');

      }).catch(function(error) {
        console.log(error);
      });
    };

    // Deletes an Existing Device firebaseObject
    $scope.delete = function(device) {
        // THIS WORKS
        var deviceRef = new Firebase(FIREBASE_URL + 'devices/' + device.$id);
        var confirm = window.confirm("Are you sure you want to delete device: " + device.title + "?");
        if(confirm == true) {
          deviceRef.remove(onDelete);
          $state.go('devices');
        } else {
          console.log('Device was not deleted');
        }

        var onDelete = function(error) {
          if (error) {
            console.log('Device Delete Failed');
          } else {
            console.log('Device Delete Succeeded');
            $state.go('devices');
          }
        };

      };

    // getDevice on init for /device/edit/:id route
    $scope.getDevice = function() {
      var ref = new Firebase(FIREBASE_URL + 'devices');
      $scope.device = $firebaseObject(ref.child($stateParams.deviceId));
    };

    // Update an Existing Device and save it
    $scope.update = function() {
      // save firebaseObject
      $scope.device.$save().then(function(){
        console.log('device Updated');
        // redirect to /devices path after update
        //$location.path('/devices');
        $location.path('/devices/view/' + $stateParams.deviceId);
        //$state.go('devices');
      }).catch(function(error){
        console.log(error);
      });
    };

    // Since the data is asynchronous we'll need to use the $loaded promise.
    // Once data is available we'll set the data variable and init the ngTable
    $scope.devices.$loaded().then(function(devices) {
      console.log(devices.length); // data is loaded here
      var data = devices;

      $scope.tableDevices = new ngTableParams({
            page: 1,            // show first page
            count: 10,          // count per page
            sorting: { title: 'asc' }    // initial sorting
        }, {
            total: data.length, // length of data
            getData: function($defer, params) {
                // use build-in angular filter
                var orderedData = params.sorting() ? $filter('filter')(data, params.filter()) : data;
                $defer.resolve(orderedData.slice((params.page() - 1) * params.count(), params.page() * params.count()));
            }
        });

    });

    // Listening for list updates to Devices to update Table
    var ref = new Firebase(FIREBASE_URL + 'devices');
    var list = $firebaseArray(ref);
    list.$watch(function(event) {
      console.log(event);
      $scope.devices.$loaded().then(function(){
        $scope.tableDevices.reload();
      });
    });


    // Add a device comment
    $scope.addComment = function(deviceComment) {
        console.log('Add Device Comment Clicked');
        deviceComment.createdBy = User.getEmail();
        deviceComment.createdById = User.getId();
        deviceComment.createdAt = Firebase.ServerValue.TIMESTAMP;
        $scope.deviceComments.$add(deviceComment).then(function() {
          console.log('deviceComment Created');
          // Remove New Comment From Form
          $scope.newDeviceComment = {};
        }).catch(function(error) {
          console.log(error);
        });
      };

    // Listening for Child removed
    //
    //var ref = new Firebase(FIREBASE_URL + 'environments');
    // $scope.environments.on('child_removed', function() {
    //   console.log('/environments child removed');
    //    $scope.tableEnvironments.reload();
    //  });



     // logs { event: "child_removed", key: "foo" }
    //  list.$remove({
    //    console.log('Environments List Updated... List Item Added');
    //  });

     // logs { event: "child_added", key: "<new _id>", prevId: "<prev_id>" }
    //  list.$add({
    //    console.log('Environments List Updated... List Item Removed');
    //  });

}]);

console.log('--> basestation/app/devices/devices.controller.js loaded');

'use strict';

app.factory("KnownErrors", ["FIREBASE_URL", "$firebaseArray", function RequestFactory(FIREBASE_URL, $firebaseArray) {
  return function(){
    // snapshot of our data
    var ref = new Firebase(FIREBASE_URL + 'known-errors');
    // returning synchronized array
    return $firebaseArray(ref);
  }
}]);

console.log('--> basestation/app/known-errors/known-errors.service.js loaded');

'use strict';

app.factory("KnownErrorComments", ["FIREBASE_URL", "$firebaseArray", function KnownErrorCommentsFactory(FIREBASE_URL, $firebaseArray) {
  return function(id){
    // snapshot of our data
    var ref = new Firebase(FIREBASE_URL + 'known-errors/' + id + '/comments');
    // returning synchronized array
    return $firebaseArray(ref);
  }
}]);

console.log('--> basestation/app/known-error/comments.service.js loaded');

'use strict';

app.controller("KnownErrorsCtrl", ["$state", "$scope", "$location", "FIREBASE_URL", "$firebaseObject", "$firebaseArray", "$stateParams", "ngTableParams", "$filter", "KnownErrors", "KnownErrorComments", "User", function($state, $scope, $location, FIREBASE_URL, $firebaseObject, $firebaseArray, $stateParams, ngTableParams, $filter, KnownErrors, KnownErrorComments, User) {

    $scope.knownErrors = KnownErrors();
    $scope.knownErrorComments = KnownErrorComments($stateParams.knownErrorId);
    $scope.newKnownErrorComment = {};


    // add a new known error
    $scope.create = function(knownError) {
      var timestamp = new Date().toString();
      knownError.createdBy = User.getEmail();
      knownError.createdById = User.getId();
      knownError.createdAt = Firebase.ServerValue.TIMESTAMP;
      $scope.knownErrors.$add(knownError).then(function() {

        $state.go('known-errors');

      }).catch(function(error) {
        console.log(error);
      });
    };

    // remove a known error
    $scope.delete = function(knownError) {
      // THIS WORKS
      var knownErrorRef = new Firebase(FIREBASE_URL + 'known-errors/' + knownError.$id);
      var confirm = window.confirm("Are you sure you want to delete known-error: " + knownError.title + "?");
      if(confirm == true) {
        knownErrorRef.remove(onDelete);
        $state.go('known-errors');
      } else {
        console.log('Known Error was not deleted');
      }

      var onDelete = function(error) {
        if (error) {
          console.log('Known Error Delete Failed');
        } else {
          console.log('Known Error Delete Succeeded');
          $state.go('known-errors');
        }
      };
    };

    // getKnownError on init for /known-errors/edit/:id route
    $scope.getKnownError = function() {
      var ref = new Firebase(FIREBASE_URL + 'known-errors');
      $scope.knownError = $firebaseObject(ref.child($stateParams.knownErrorId));
    };

    // update a knownError and save it
    $scope.update = function(knownError) {
      //var timestamp = new Date().toString();
      // save firebaseObject
      $scope.knownError.$save().then(function(){
        console.log('knownError Updated');
        // redirect to /known-error path after update
        $location.path('/known-errors/view/' + $stateParams.knownErrorId);
        //$state.go('known-errors');
      }).catch(function(error){
        console.log(error);
      });
    };

    // Since the data is asynchronous we'll need to use the $loaded promise.
    // Once data is available we'll set the data variable and init the ngTable
    $scope.knownErrors.$loaded().then(function(knownErrors) {
      console.log(knownErrors.length); // data is loaded here
      var data = knownErrors;

      $scope.tableKnownErrors = new ngTableParams({
            page: 1,            // show first page
            count: 10,          // count per page
            sorting: { title: 'asc' }    // initial sorting
        }, {
            total: data.length, // length of data
            getData: function($defer, params) {
                // use build-in angular filter
                var orderedData = params.sorting() ? $filter('filter')(data, params.filter()) : data;
                $defer.resolve(orderedData.slice((params.page() - 1) * params.count(), params.page() * params.count()));
            }
        });

    });

    // Listening for list updates to knownErrors to update Table
    var ref = new Firebase(FIREBASE_URL + 'known-errors');
    var list = $firebaseArray(ref);
    list.$watch(function(event) {
      console.log(event);
      $scope.knownErrors.$loaded().then(function(){
        $scope.tableKnownErrors.reload();
      });
    });

    // Add a known error comment
    $scope.addComment = function(knownErrorComment) {
        console.log('Add Known Error Comment Clicked');
        var timestamp = new Date().toString();
        knownErrorComment.createdBy = User.getEmail();
        knownErrorComment.createdById = User.getId();
        knownErrorComment.createdAt = Firebase.ServerValue.TIMESTAMP;
        $scope.knownErrorComments.$add(knownErrorComment).then(function() {
          console.log('knownErrorComment Created');
          // Remove New Comment From Form
          $scope.newKnownErrorComment = {};
        }).catch(function(error) {
          console.log(error);
        });
      };

}]);

console.log('--> basestation/app/known-errors/known-errors.controller.js loaded');

'use strict';

app.factory("Assets", ["FIREBASE_URL", "$firebaseArray", function DeviceFactory(FIREBASE_URL, $firebaseArray) {
  return function(){
    // snapshot of our data
    var ref = new Firebase(FIREBASE_URL + 'assets');
    // returning synchronized array
    return $firebaseArray(ref);
  }
}]);

console.log('--> basestation/app/assets/assets.service.js loaded');

'use strict';

app.factory("AssetComments", ["FIREBASE_URL", "$firebaseArray", function AssetCommentsFactory(FIREBASE_URL, $firebaseArray) {
  return function(id){
    // snapshot of our data
    var ref = new Firebase(FIREBASE_URL + 'assets/' + id + '/comments');
    // returning synchronized array
    return $firebaseArray(ref);
  }
}]);

console.log('--> basestation/app/asset/comments.service.js loaded');

'use strict';

app.controller("AssetsCtrl", ["$state", "$scope", "$location", "FIREBASE_URL", "$firebaseObject", "$firebaseArray", "$stateParams", "ngTableParams", "$filter", "Assets", "AssetComments", "User", function($state, $scope, $location, FIREBASE_URL, $firebaseObject, $firebaseArray, $stateParams, ngTableParams, $filter, Assets, AssetComments, User) {

    $scope.assets = Assets();
    $scope.assetComments = AssetComments($stateParams.assetId);
    $scope.newAssetComment = {};

    var usersRef = new Firebase(FIREBASE_URL+'users');
    $scope.users = $firebaseArray(usersRef);

    // Create a New Asset and Add to firebaseArray
    $scope.create = function(asset) {
      $scope.asset.createdBy = User.getEmail();
      $scope.asset.createdById = User.getId();
      $scope.asset.createdAt = Firebase.ServerValue.TIMESTAMP;

      $scope.assets.$add(asset).then(function() {
        console.log('asset Created');
        //$location.path('/assets');
        $state.go('assets');

      }).catch(function(error) {
        console.log(error);
      });
    };

    // Deletes an Existing Asset firebaseObject
    $scope.delete = function(asset) {
        // THIS WORKS
        var assetRef = new Firebase(FIREBASE_URL + 'assets/' + asset.$id);
        var confirm = window.confirm("Are you sure you want to delete asset: " + asset.title + "?");
        if(confirm == true) {
          assetRef.remove(onDelete);
          $state.go('assets');
        } else {
          console.log('Asset was not deleted');
        }

        var onDelete = function(error) {
          if (error) {
            console.log('Asset Delete Failed');
          } else {
            console.log('Asset Delete Succeeded');
            $state.go('assets');
          }
        };

      };

    // getAsset on init for /asset/edit/:id route
    $scope.getAsset = function() {
      var ref = new Firebase(FIREBASE_URL + 'assets');
      $scope.asset = $firebaseObject(ref.child($stateParams.assetId));
    };

    // Update an Existing Asset and save it
    $scope.update = function() {
      // save firebaseObject
      $scope.asset.$save().then(function(){
        console.log('asset Updated');
        // redirect to /assets path after update
        //$location.path('/assets');
        $location.path('/assets/view/' + $stateParams.assetId);
        //$state.go('assets');
      }).catch(function(error){
        console.log(error);
      });
    };

    // Since the data is asynchronous we'll need to use the $loaded promise.
    // Once data is available we'll set the data variable and init the ngTable
    $scope.assets.$loaded().then(function(assets) {
      console.log(assets.length); // data is loaded here
      var data = assets;

      $scope.tableAssets = new ngTableParams({
            page: 1,            // show first page
            count: 10,          // count per page
            sorting: { title: 'asc' }    // initial sorting
        }, {
            total: data.length, // length of data
            getData: function($defer, params) {
                // use build-in angular filter
                var orderedData = params.sorting() ? $filter('filter')(data, params.filter()) : data;
                $defer.resolve(orderedData.slice((params.page() - 1) * params.count(), params.page() * params.count()));
            }
        });

    });

    // Listening for list updates to Assets to update Table
    var ref = new Firebase(FIREBASE_URL + 'assets');
    var list = $firebaseArray(ref);
    list.$watch(function(event) {
      console.log(event);
      $scope.assets.$loaded().then(function(){
        $scope.tableAssets.reload();
      });
    });


    // Add a asset comment
    $scope.addComment = function(assetComment) {
        console.log('Add Asset Comment Clicked');
        assetComment.createdBy = User.getEmail();
        assetComment.createdById = User.getId();
        assetComment.createdAt = Firebase.ServerValue.TIMESTAMP;
        $scope.assetComments.$add(assetComment).then(function() {
          console.log('assetComment Created');
          // Remove New Comment From Form
          $scope.newAssetComment = {};
        }).catch(function(error) {
          console.log(error);
        });
      };

    // Listening for Child removed
    //
    //var ref = new Firebase(FIREBASE_URL + 'environments');
    // $scope.environments.on('child_removed', function() {
    //   console.log('/environments child removed');
    //    $scope.tableEnvironments.reload();
    //  });



     // logs { event: "child_removed", key: "foo" }
    //  list.$remove({
    //    console.log('Environments List Updated... List Item Added');
    //  });

     // logs { event: "child_added", key: "<new _id>", prevId: "<prev_id>" }
    //  list.$add({
    //    console.log('Environments List Updated... List Item Removed');
    //  });

}]);

console.log('--> basestation/app/assets/assets.controller.js loaded');

'use strict';

app.config(["$stateProvider", "$urlRouterProvider", function ($stateProvider, $urlRouterProvider) {
  $stateProvider
  .state('chef/nodes', {
    url: '/chef/nodes',
    controller: 'Chef_NodesCtrl as chef_nodesCtrl',
    templateUrl: 'modules/chef/nodes/index.html',
    resolve: {
      chef_nodes: ["Chef_Nodes", function (Chef_Nodes){
         return Chef_Nodes();
       }],
      auth: ["$state", "Users", "Auth", function($state, Users, Auth){
        return Auth.$requireAuth().catch(function(){
          $state.go('home');
        });
      }]
    }
  })
  .state('chef/nodes/view', {
    url: '/chef/nodes/{nodeId}',
    templateUrl: 'modules/chef/nodes/view.html',
    controller: 'Chef_NodesCtrl as chef_nodesCtrl',
    resolve: {
      auth: ["$state", "Users", "Auth", function($state, Users, Auth){
        return Auth.$requireAuth().catch(function(){
          $state.go('home');
        });
      }]
    }
  });
}])




app.factory("Chef_Nodes", ["FIREBASE_URL", "$firebaseArray", function Chef_Node_Factory(FIREBASE_URL, $firebaseArray) {
  return function(){
    // snapshot of our data
    var ref = new Firebase(FIREBASE_URL + 'chef/nodes');
    // returning synchronized array
    return $firebaseArray(ref);
  }
}]);



'use strict';

app.controller("Chef_NodesCtrl", ["$state", "$scope", "$location", "FIREBASE_URL", "$firebaseObject", "$firebaseArray", "$stateParams", "ngTableParams", "$filter", "Chef_Nodes", function($state, $scope, $location, FIREBASE_URL, $firebaseObject, $firebaseArray, $stateParams, ngTableParams, $filter, Chef_Nodes) {

    $scope.chef_nodes = Chef_Nodes();
    //$scope.deviceComments = DeviceComments($stateParams.deviceId);
    //$scope.newDeviceComment = {};


    // Create a New Chef Node and Add to firebaseArray
    $scope.create = function(chef_node) {
      //$scope.chef_node.createdBy = User.getEmail();
      //$scope.chef_node.createdById = User.getId();
      $scope.chef_node.createdAt = Firebase.ServerValue.TIMESTAMP;

      $scope.chef_nodes.$add(chef_node).then(function() {
        console.log('Chef Node Created');
        //$location.path('/chef/nodes');
        $state.go('chef/nodes');

      }).catch(function(error) {
        console.log(error);
      });
    };

    // Deletes an Existing Chef Node firebaseObject
    // $scope.delete = function(device) {
    //     // THIS WORKS
    //     var deviceRef = new Firebase(FIREBASE_URL + 'devices/' + device.$id);
    //     var confirm = window.confirm("Are you sure you want to delete device: " + device.title + "?");
    //     if(confirm == true) {
    //       deviceRef.remove(onDelete);
    //       $state.go('devices');
    //     } else {
    //       console.log('Device was not deleted');
    //     }
    //
    //     var onDelete = function(error) {
    //       if (error) {
    //         console.log('Device Delete Failed');
    //       } else {
    //         console.log('Device Delete Succeeded');
    //         $state.go('devices');
    //       }
    //     };
    //
    //   };

    // getNode on init for /chef/node/:id route
    $scope.getNode = function() {
      var ref = new Firebase(FIREBASE_URL + 'chef/nodes');
      $scope.chef_node = $firebaseObject(ref.child($stateParams.nodeId));
    };

    // Update an Existing Device and save it
    // $scope.update = function() {
    //   // save firebaseObject
    //   $scope.device.$save().then(function(){
    //     console.log('device Updated');
    //     // redirect to /devices path after update
    //     //$location.path('/devices');
    //     $location.path('/devices/view/' + $stateParams.deviceId);
    //     //$state.go('devices');
    //   }).catch(function(error){
    //     console.log(error);
    //   });
    // };

    // Since the data is asynchronous we'll need to use the $loaded promise.
    // Once data is available we'll set the data variable and init the ngTable
    $scope.chef_nodes.$loaded().then(function(chef_nodes) {
      console.log(chef_nodes.length); // data is loaded here
      var data = chef_nodes;

      $scope.tableChefNodes = new ngTableParams({
            page: 1,            // show first page
            count: 10,          // count per page
            sorting: { title: 'asc' }    // initial sorting
        }, {
            total: data.length, // length of data
            getData: function($defer, params) {
                // use build-in angular filter
                var orderedData = params.sorting() ? $filter('filter')(data, params.filter()) : data;
                $defer.resolve(orderedData.slice((params.page() - 1) * params.count(), params.page() * params.count()));
            }
        });

    });

    // Listening for list updates to Chef Nodes to update Table
    var ref = new Firebase(FIREBASE_URL + 'chef/nodes');
    var list = $firebaseArray(ref);
    list.$watch(function(event) {
      console.log(event);
      $scope.chef_nodes.$loaded().then(function(){
        $scope.tableChefNodes.reload();
      });
    });


    // Add a device comment
    // $scope.addComment = function(deviceComment) {
    //     console.log('Add Device Comment Clicked');
    //     deviceComment.createdBy = User.getEmail();
    //     deviceComment.createdById = User.getId();
    //     deviceComment.createdAt = Firebase.ServerValue.TIMESTAMP;
    //     $scope.deviceComments.$add(deviceComment).then(function() {
    //       console.log('deviceComment Created');
    //       // Remove New Comment From Form
    //       $scope.newDeviceComment = {};
    //     }).catch(function(error) {
    //       console.log(error);
    //     });
    //   };

    // Listening for Child removed
    //
    //var ref = new Firebase(FIREBASE_URL + 'environments');
    // $scope.environments.on('child_removed', function() {
    //   console.log('/environments child removed');
    //    $scope.tableEnvironments.reload();
    //  });



     // logs { event: "child_removed", key: "foo" }
    //  list.$remove({
    //    console.log('Environments List Updated... List Item Added');
    //  });

     // logs { event: "child_added", key: "<new _id>", prevId: "<prev_id>" }
    //  list.$add({
    //    console.log('Environments List Updated... List Item Removed');
    //  });

}]);

console.log('--> basestation/app/modules/chef/module.js loaded');
