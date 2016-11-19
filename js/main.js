var app = angular.module('cdpApp', []);

app.controller('CdpController', ['$http', function($http) {
  console.time("cdp1");
  var cdp = this;
  var storage = localStorage;
  var tmp = storage.getItem('data');

  cdp.data = tmp ? JSON.parse(tmp) : {roles: []};
  console.log("data:");
  console.log(cdp.data);

  cdp.addRole = function () {
    cdp.data.roles.push({code: cdp.newRole.code, name: cdp.newRole.name, tasks: []});
    storage.setItem('data', JSON.stringify(cdp.data));
  };
  cdp.editRole = function (role) {
    cdp.editingRole = role;
  };
  cdp.removeRole = function (role) {
    cdp.data.roles.some(function (v, i) {
      if (v == role) cdp.data.roles.splice(i,1);
    });
    storage.setItem('data', JSON.stringify(cdp.data));
  };
  // parse CSV
  cdp.parseSV = function (str, delimiter){
    if(!delimiter) delimiter = ",";
    return str.split('\n').reduce(function (table, row) {
      if(!table) return;
      table.push(
        row.split(delimiter).map(function (d) {return d.trim();}) //余白削除
      );
      return table;
    }, []);
  };
  
  // Clear Strage
  cdp.clearStrage = function () {localStorage.clear();};

  if (!cdp.data.tasks) {
    $http({
      method: 'GET',
      url: "./tasks.csv"
    }).success(function(data, status, headers, config) {
      console.time("tasks");
      console.log("tasks status:", status);
      cdp.data.tasks = cdp.parseSV(data);
      storage.setItem('data', JSON.stringify(cdp.data));
      console.timeEnd("tasks");
    }).error(function(data, status, headers, config) {
      console.log("tasks error:");
      console.log(status);
    });
  }
  if (!cdp.data.jobs) {
    $http({
      method: 'GET',
      url: "./jobs.csv"
    }).success(function(data, status, headers, config) {
      console.time("jobs");
      console.log("jobs status:", status);
      cdp.data.jobs = cdp.parseSV(data);
      storage.setItem('data', JSON.stringify(cdp.data));
      console.timeEnd("jobs");
    }).error(function(data, status, headers, config) {
      console.log("jobs error:");
      console.log(status);
    });
  }
  console.timeEnd("cdp1");
}]);
