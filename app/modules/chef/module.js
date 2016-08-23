'use strict';

app.config(function ($stateProvider, $urlRouterProvider) {
  $stateProvider
  .state('chef/nodes', {
    url: '/chef/nodes',
    controller: 'Chef_NodesCtrl as chef_nodesCtrl',
    templateUrl: 'modules/chef/nodes/index.html',
    resolve: {
      chef_nodes: function (Chef_Nodes){
         return Chef_Nodes();
       },
      auth: function($state, Users, Auth){
        return Auth.$requireAuth().catch(function(){
          $state.go('home');
        });
      }
    }
  })
  .state('chef/nodes/view', {
    url: '/chef/nodes/{nodeId}',
    templateUrl: 'modules/chef/nodes/view.html',
    controller: 'Chef_NodesCtrl as chef_nodesCtrl',
    resolve: {
      auth: function($state, Users, Auth){
        return Auth.$requireAuth().catch(function(){
          $state.go('home');
        });
      }
    }
  });
})




app.factory("Chef_Nodes", function Chef_Node_Factory(FIREBASE_URL, $firebaseArray) {
  return function(){
    // snapshot of our data
    var ref = new Firebase(FIREBASE_URL + 'chef/nodes');
    // returning synchronized array
    return $firebaseArray(ref);
  }
});



'use strict';

app.controller("Chef_NodesCtrl", function($state, $scope, $location, FIREBASE_URL, $firebaseObject, $firebaseArray, $stateParams, ngTableParams, $filter, Chef_Nodes) {

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

});

console.log('--> basestation/app/modules/chef/module.js loaded');
