'use strict';

app.controller("RequestsCtrl", function($state, $scope, $location, FIREBASE_URL, $firebaseObject, $firebaseArray, $stateParams, ngTableParams, $filter, Requests, RequestComments, User) {

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

});

console.log('--> basestation/app/requests/requests.controller.js loaded');
