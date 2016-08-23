'use strict';

app.controller("KnownErrorsCtrl", function($state, $scope, $location, FIREBASE_URL, $firebaseObject, $firebaseArray, $stateParams, ngTableParams, $filter, KnownErrors, KnownErrorComments, User) {

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

});

console.log('--> basestation/app/known-errors/known-errors.controller.js loaded');
