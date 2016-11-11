var app = angular.module('cdpApp', []);

app.controller('CdpController', ['$http', function($http) {
  var cdp = this;

  cdp.jobs = [['now loading...']];
  cdp.roles = [['now loading...']];

  $http({method: 'GET', url: "./tasks.csv"})
  .then(function(response) {
    console.log(response.status);
    cdp.tasks = parseSV(response.data);
  }, function(response) {
    console.log(response.status);
  });
  $http({method: 'GET', url: "./jobs.csv"})
  .then(function(response) {
    console.log(response.status);
    cdp.jobs = parseSV(response.data);
  }, function(response) {
    console.log(response.status);
  });
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