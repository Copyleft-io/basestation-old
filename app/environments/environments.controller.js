'use strict';

app.controller("EnvironmentsCtrl", function($state, $scope, FIREBASE_URL, $firebaseObject, $firebaseArray, $stateParams, ngTableParams, $filter, Environments) {

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

});

console.log('--> basestation/app/environments/environments.controller.js loaded');
