var app = angular.module('cdpApp', []);

app.controller('CdpController', ['$http', function($http) {
  console.time("cdp1");
  var cdp = this;
  var storage = localStorage;
  cdp.jobs = JSON.parse(storage.getItem('jobs'));
  cdp.tasks = JSON.parse(storage.getItem('tasks'));


  if (!cdp.tasks) {
    $http({method: 'GET', url: "./tasks.csv"})
    .then(function(response) {
      console.log('tasks:' & response.status);
      cdp.tasks = parseSV(response.data);
      storage.setItem('tasks',JSON.stringify(cdp.tasks));
    }, function(response) {
      console.log(response.status);
    });
  }
  if(!cdp.jobs) {
    $http({method: 'GET', url: "./jobs.csv"})
    .then(function(response) {
      console.log('jobs:' & response.status);
      cdp.jobs = parseSV(response.data);
      storage.setItem('jobs',JSON.stringify(cdp.jobs));
    }, function(response) {
      console.log(response.status);
    });
  }
  console.timeEnd("cdp1");
}]);


function parseSV(str, delimiter){
  if(!delimiter) delimiter = ",";
  return str.split('\n').reduce(function(table,row){
    if(!table) return;
    table.push(
      row.split(delimiter).map(function(d){ return d.trim();}) //余白削除
    );
    return table;
  }, []);
}