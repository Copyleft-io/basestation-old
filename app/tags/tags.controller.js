'use strict';

app.controller("TagsCtrl", function($state, $scope, FIREBASE_URL, $firebaseObject, $firebaseArray, $stateParams, ngTableParams, $filter, Tags, User) {

    $scope.tags = Tags();

    // add a new tag
    $scope.create = function(tag) {
      var timestamp = new Date().toString();
      tag.createdBy = User.getEmail();
      tag.createdById = User.getId();
      tag.createdAt = timestamp;
      $scope.tags.$add(tag).then(function() {

        $state.go('tags');

      }).catch(function(error) {
        console.log(error);
      });
    };

    // remove a tag
    $scope.delete = function(tag) {
        $scope.tags.$remove(tag).then(function(){
            console.log('tag Deleted');

        }).catch(function(error){
            console.log(error);
        });
    };

    // getTag on init for /tags/edit/:id route
    $scope.getTag = function() {
      var ref = new Firebase(FIREBASE_URL + 'tags');
      $scope.tag = $firebaseObject(ref.child($stateParams.tagId));
    };

    // update a tag and save it
    $scope.update = function(tag) {
      //var timestamp = new Date().toString();
      // save firebaseObject
      $scope.tag.$save().then(function(){
        console.log('tag Updated');
        // redirect to /tag path after update
        $state.go('tags');
      }).catch(function(error){
        console.log(error);
      });
    };

    // Since the data is asynchronous we'll need to use the $loaded promise.
    // Once data is available we'll set the data variable and init the ngTable
    $scope.tags.$loaded().then(function(tags) {
      console.log(tags.length); // data is loaded here
      var data = tags;

      $scope.tableTags = new ngTableParams({
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

    // Listening for list updates to tags to update Table
    var ref = new Firebase(FIREBASE_URL + 'tags');
    var list = $firebaseArray(ref);
    list.$watch(function(event) {
      console.log(event);
      $scope.tags.$loaded().then(function(){
        $scope.tableTags.reload();
      });
    });

});

console.log('--> basestation/app/tags/tags.controller.js loaded');
