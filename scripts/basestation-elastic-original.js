var Firebase = require('firebase');
var ElasticSearch = require('elasticsearch');
var FIREBASE_URL = 'https://basestation.firebaseio.com/';

// initialize our ElasticSearch API
var client = new ElasticSearch.Client({ host: 'localhost:9200', log: 'trace' });

// listen for changes to Basestation Devices
var devices = new Firebase(FIREBASE_URL + 'devices');
devices.on('child_added',   createOrUpdateDevicesIndex);
devices.on('child_changed', createOrUpdateDevicesIndex);
devices.on('child_removed', removeDevicesIndex);

function createOrUpdateDevicesIndex(snap) {
   client.index({
     index: 'devices',
     type: 'device',
     id: snap.key(),
     body: snap.val()
   }, function (error, response) {
      if (error) {
        console.error(error);
      } else {
        console.log('indexed');
        console.log(response);
      }
  });
};

function removeDevicesIndex(snap) {
   client.deleteDocument(this.index, this.type, snap.key(), function(error, data) {
      if( error ) console.error('failed to delete', snap.key(), error);
      else console.log('deleted', snap.key());
   });
};
