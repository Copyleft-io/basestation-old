'use strict';

app.controller("AssetsCtrl", function($state, $scope, $location, FIREBASE_URL, $firebaseObject, $firebaseArray, $stateParams, ngTableParams, $filter, Assets, AssetComments, User) {

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

});

console.log('--> basestation/app/assets/assets.controller.js loaded');
