var app = angular.module('cdpApp', ["ngTable"]);

app.controller('CdpController', ['$http', '$scope', 'NgTableParams', function ($http, $scope, NgTableParams) {
  console.time("cdp1");
  var storage = localStorage;
  var tmp = storage.getItem('data');

  $scope.data = tmp ? JSON.parse(tmp) : {roles: []};
  console.log("data:");
  console.log($scope.data);

  // prepare param for task table.
  $scope.taskTableParam = new NgTableParams({}, { dataset: $scope.data.tasks});

  // add Role and save to localstorage.
  $scope.addRole = function () {
    $scope.data.roles.push({
      code: $scope.newRole.code,
      name: $scope.newRole.name,
      tasks: [
        {name: 'test'},
        {name: 'test2'}
      ]
    });
    storage.setItem('data', JSON.stringify($scope.data));
  };

  // select a role for edit.
  $scope.editRole = function (role) {
    $scope.editingRole = role;
  };

  // remove role.
  $scope.removeRole = function (role) {
    $scope.data.roles.some(function (v, i) {
      if (v == role) $scope.data.roles.splice(i,1);
    });
    storage.setItem('data', JSON.stringify($scope.data));
  };

  // parse CSV
  $scope.parseSV = function (str, delimiter) {
    if (!delimiter) {
      delimiter = ",";  
    }
    return str.split('\n').reduce(function (table, row) {
      if (!table) return;
      if (row.length === 0) return table;
      table.push(row.split(delimiter).map(function (d) {
          // 余白削除, " を除去
          return d.trim().replace(/\"/g ,'');
      }));
      return table;
    }, []);
  };
  
  // Clear Strage
  $scope.clearStrage = function () {
    localStorage.clear();
  };

  // get task data.
  if (!$scope.data.tasks) {
    $http({
      method: 'GET',
      url: "./tasks.csv"
    }).success(function(data, status, headers, config) {
      console.time("tasks");
      console.log("tasks status:", status);
      var tmpArray = $scope.parseSV(data);
      tmpArray.shift();
      $scope.data.tasks = tmpArray.reduce(function (a, b) {
        var obj = {
          category1Code: b[0],
          category1Name: b[1],
          category2Code: b[2],
          category2Name: b[3],
          category3Code: b[4],
          category3Name: b[5]
        };
        if (a.length === 0 || a[a.length - 1].category3Code != obj.category3Code) {
          a.push(obj);
        }
        return a;
      }, []);
      storage.setItem('data', JSON.stringify($scope.data));
      console.timeEnd("tasks");
      
    }).error(function(data, status, headers, config) {
      console.log("tasks error:");
      console.log(status);
    });
  }
  
  // get job data.
  if (!$scope.data.jobs) {
    $http({
      method: 'GET',
      url: "./jobs.csv"
    }).success(function(data, status, headers, config) {
      console.time("jobs");
      console.log("jobs status:", status);
      $scope.data.jobs = $scope.parseSV(data);
      storage.setItem('data', JSON.stringify($scope.data));
      console.timeEnd("jobs");
    }).error(function(data, status, headers, config) {
      console.log("jobs error:");
      console.log(status);
    });
  }
  console.timeEnd("cdp1");
}]);
