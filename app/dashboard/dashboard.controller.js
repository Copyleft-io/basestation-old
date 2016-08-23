'use strict';

app.controller('DashboardCtrl', function($state, $scope, esClient, esFactory){
    var DashboardCtrl = this;
        $scope.totalIncidents = incidentCount;
        $scope.totalProblems = problemCount;
        $scope.totalChanges = changeCount;
        $scope.totalRequests = requestCount;


    //Elastic Search Query For Count of Type: Incident
    var incidentCount = esClient.count({
      type: 'incident'
      }, function (error, response) {
       console.log(response.count);
       $scope.totalIncidents = response.count;
       // ...
      });

    //Elastic Search Query For Count of Type: Problem
    var problemCount = esClient.count({
      type: 'problem'
      }, function (error, response) {
       console.log(response.count);
       $scope.totalProblems = response.count;
       // ...
      });

    //Elastic Search Query For Count of Type: Change
    var changeCount = esClient.count({
      type: 'change'
      }, function (error, response) {
       console.log(response.count);
       $scope.totalChanges = response.count;
       // ...
      });

    //Elastic Search Query For Count of Type: Request
    var requestCount = esClient.count({
      type: 'request'
      }, function (error, response) {
       console.log(response.count);
       $scope.totalRequests = response.count;
       // ...
      });

  });

console.log('--> basestation/app/dashboard/dashboard.controller.js loaded');
