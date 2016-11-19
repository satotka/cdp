var app = angular.module('cdpApp', []);

app.controller('CdpController', ['$http', function($http) {
  console.time("cdp1");
  var cdp = this;
  var storage = localStorage;
  var tmp = storage.getItem('data');

  cdp.data = tmp ? JSON.parse(tmp) : {roles: []};
  console.log("data:");
  console.log(cdp.data);

  // test
  makeObject(cdp.data.tasks);

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
        //余白削除, " を除去
        row.split(delimiter).map(function (d) {return d.trim().replace(/\"/g ,'');})
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


function makeObject(array) {
  var header = array.shift();
  console.log(header);
  console.log(array.length);
  var task = [
    {code: "ST", name: "（計画・実行）戦略"},
    {code: "PL", name: "（計画・実行）企画"},
    {code: "DV", name: "（計画・実行）開発"},
    {code: "US", name: "（計画・実行）利活用"},
    {code: "EV", name: "（計画・実行）評価・改善"},
    {code: "MC", name: "管理・統制"},
    {code: "CM", name: "推進・支援"},
    {code: "SP", name: "その他業務"}
  ];
  array.forEach(function(row) {
    task = task.map(function(taskarea) {
      taskarea.cat1 = [];
      return taskarea;
    });
  });
   
  return;
}