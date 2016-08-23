'use strict';

app.controller("DevicesCtrl", function($state, $scope, $location, FIREBASE_URL, $firebaseObject, $firebaseArray, $stateParams, ngTableParams, $filter, Devices, DeviceComments, Environments, User) {

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

});

console.log('--> basestation/app/devices/devices.controller.js loaded');
