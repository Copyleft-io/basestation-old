'use strict';

app.controller("TeamsCtrl", function($state, $scope, $location, FIREBASE_URL, $firebaseObject, $firebaseArray, $stateParams, ngTableParams, $filter, Teams, User) {

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

});

console.log('--> basestation/app/teams/teams.controller.js loaded');
