var Firebase = require('firebase');
var ElasticSearch = require('elasticsearch');
var FIREBASE_URL = 'https://basestation.firebaseio.com/';

// initialize our ElasticSearch API
var client = new ElasticSearch.Client({ host: 'localhost:9200', log: 'trace' });


// COMMON INDEX FUNCTIONS Create, Update, Remove

// CREATE INDEX
function createIndex(dataSnapshot, indexName, typeName) {
  client.index({
    index: indexName,
    type: typeName,
    id: dataSnapshot.key(),
    body: dataSnapshot.val()
  }, function (error, response) {
     if (error) {
       console.error(error);
     } else {
       console.log('Index: ' + indexName + ' --> Type: ' + typeName + ' Created -->', dataSnapshot.key());
       console.log(response);
     }
 });
};

// UPDATE INDEX
function updateIndex(dataSnapshot, indexName, typeName) {
  client.index({
    index: indexName,
    type: typeName,
    id: dataSnapshot.key(),
    body: dataSnapshot.val()
  }, function (error, response) {
     if (error) {
       console.error(error);
     } else {
       console.log('Index: ' + indexName + ' --> Type: ' + typeName + ' Updated -->', dataSnapshot.key());
       console.log(response);
     }
  });
};

// DELETE INDEX
function removeIndex(dataSnapshot, indexName, typeName) {
  client.delete({
     index: indexName,
     type: typeName,
     id: dataSnapshot.key()
  }, function(error, data) {
     if( error ) console.error('Index: ' + indexName + ' --> Type: ' + typeName + ' Failed to Delete -->', snap.key(), error);
     else console.log('Index: ' + indexName + ' --> Type: ' + typeName + ' Deleted -->', dataSnapshot.key());
  });
};


/*
* PEOPLE
*/

// LINKS
var links = new Firebase(FIREBASE_URL + 'links');
links.on('child_added', function(snapshot) {
  createIndex(snapshot, 'basestation', 'link');
});

links.on('child_changed', function(snapshot) {
  updateIndex(snapshot, 'basestation', 'link');
});

links.on('child_removed', function(snapshot) {
  removeIndex(snapshot, 'basestation', 'link');
});


// TAGS
var tags = new Firebase(FIREBASE_URL + 'tags');
tags.on('child_added', function(snapshot) {
  createIndex(snapshot, 'basestation', 'tag');
});

tags.on('child_changed', function(snapshot) {
  updateIndex(snapshot, 'basestation', 'tag');
});

tags.on('child_removed', function(snapshot) {
  removeIndex(snapshot, 'basestation', 'tag');
});




/*
* PROCESS
*/

// REQUESTS
var requests = new Firebase(FIREBASE_URL + 'requests');
requests.on('child_added', function(snapshot) {
  createIndex(snapshot, 'basestation', 'request');
});

requests.on('child_changed', function(snapshot) {
  updateIndex(snapshot, 'basestation', 'request');
});

requests.on('child_removed', function(snapshot) {
  removeIndex(snapshot, 'basestation', 'request');
});


// EVENTS
var events = new Firebase(FIREBASE_URL + 'events');
events.on('child_added', function(snapshot) {
  createIndex(snapshot, 'basestation', 'event');
});

events.on('child_changed', function(snapshot) {
  updateIndex(snapshot, 'basestation', 'event');
});

events.on('child_removed', function(snapshot) {
  removeIndex(snapshot, 'basestation', 'event');
});


// KNOWN ERRORS
var knownErrors = new Firebase(FIREBASE_URL + 'known-errors');
knownErrors.on('child_added', function(snapshot) {
  createIndex(snapshot, 'basestation', 'known-error');
});

knownErrors.on('child_changed', function(snapshot) {
  updateIndex(snapshot, 'basestation', 'known-error');
});

knownErrors.on('child_removed', function(snapshot) {
  removeIndex(snapshot, 'basestation', 'known-error');
});


// INCIDENTS
var incidents = new Firebase(FIREBASE_URL + 'incidents');
incidents.on('child_added', function(snapshot) {
  createIndex(snapshot, 'basestation', 'incident');
});

incidents.on('child_changed', function(snapshot) {
  updateIndex(snapshot, 'basestation', 'incident');
});

incidents.on('child_removed', function(snapshot) {
  removeIndex(snapshot, 'basestation', 'incident');
});


// PROBLEMS
var problems = new Firebase(FIREBASE_URL + 'problems');
problems.on('child_added', function(snapshot) {
  createIndex(snapshot, 'basestation', 'problem');
});

problems.on('child_changed', function(snapshot) {
  updateIndex(snapshot, 'basestation', 'problem');
});

problems.on('child_removed', function(snapshot) {
  removeIndex(snapshot, 'basestation', 'problem');
});


// CHANGES
var changes = new Firebase(FIREBASE_URL + 'changes');
changes.on('child_added', function(snapshot) {
  createIndex(snapshot, 'basestation', 'change');
});

changes.on('child_changed', function(snapshot) {
  updateIndex(snapshot, 'basestation', 'change');
});

changes.on('child_removed', function(snapshot) {
  removeIndex(snapshot, 'basestation', 'change');
});


// RELEASES
var releases = new Firebase(FIREBASE_URL + 'releases');
releases.on('child_added', function(snapshot) {
  createIndex(snapshot, 'basestation', 'release');
});

releases.on('child_changed', function(snapshot) {
  updateIndex(snapshot, 'basestation', 'release');
});

releases.on('child_removed', function(snapshot) {
  removeIndex(snapshot, 'basestation', 'release');
});

/*
* TECHNOLOGY
*/

// APPLICATIONS
var applications = new Firebase(FIREBASE_URL + 'applications');
applications.on('child_added', function(snapshot) {
  createIndex(snapshot, 'basestation', 'application');
});

applications.on('child_changed', function(snapshot) {
  updateIndex(snapshot, 'basestation', 'application');
});

applications.on('child_removed', function(snapshot) {
  removeIndex(snapshot, 'basestation', 'application');
});

// ASSETS
var assets = new Firebase(FIREBASE_URL + 'assets');
assets.on('child_added', function(snapshot) {
  createIndex(snapshot, 'basestation', 'asset');
});

assets.on('child_changed', function(snapshot) {
  updateIndex(snapshot, 'basestation', 'asset');
});

assets.on('child_removed', function(snapshot) {
  removeIndex(snapshot, 'basestation', 'asset');
});


// DEVICES
var devices = new Firebase(FIREBASE_URL + 'devices');
devices.on('child_added', function(snapshot) {
  createIndex(snapshot, 'basestation', 'device');
});

devices.on('child_changed', function(snapshot) {
  updateIndex(snapshot, 'basestation', 'device');
});

devices.on('child_removed', function(snapshot) {
  removeIndex(snapshot, 'basestation', 'device');
});


// ENVIRONMENTS
var environments = new Firebase(FIREBASE_URL + 'environments');
environments.on('child_added', function(snapshot) {
  createIndex(snapshot, 'basestation', 'environment');
});

environments.on('child_changed', function(snapshot) {
  updateIndex(snapshot, 'basestation', 'environment');
});

environments.on('child_removed', function(snapshot) {
  removeIndex(snapshot, 'basestation', 'environment');
});


// NETWORKS
var networks = new Firebase(FIREBASE_URL + 'networks');
networks.on('child_added', function(snapshot) {
  createIndex(snapshot, 'basestation', 'network');
});

networks.on('child_changed', function(snapshot) {
  updateIndex(snapshot, 'basestation', 'network');
});

networks.on('child_removed', function(snapshot) {
  removeIndex(snapshot, 'basestation', 'network');
});


// SERVICES
var services = new Firebase(FIREBASE_URL + 'services');
services.on('child_added', function(snapshot) {
  createIndex(snapshot, 'basestation', 'service');
});

services.on('child_changed', function(snapshot) {
  updateIndex(snapshot, 'basestation', 'service');
});

services.on('child_removed', function(snapshot) {
  removeIndex(snapshot, 'basestation', 'service');
});
