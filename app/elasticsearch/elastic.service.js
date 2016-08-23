'use strict';

app.service("esClient", function (esFactory) {
  return esFactory({
    //host: 'http://localhost:9200/'
    // Currently Points to Virtual Instance Managed via Test Kitchen and Copyleft-Basestation Cookbook in Copyleft Chef-Repo
    host: 'http://192.168.168.168:9200/'
  });
});

console.log('--> basestation/app/elasticsearch/elastic.service.js loaded');
