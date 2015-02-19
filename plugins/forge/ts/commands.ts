/// <reference path="../../includes.ts"/>
/// <reference path="forgePlugin.ts"/>

module Forge {

  export var CommandsController = controller("CommandsController", ["$scope", "$dialog", "$window", "$templateCache", "$routeParams", "$location", "localStorage", "$http", "$timeout", "ForgeApiURL",
    ($scope, $dialog, $window, $templateCache, $routeParams, $location:ng.ILocationService, localStorage, $http, $timeout, ForgeApiURL) => {


      $scope.tableConfig = {
        data: 'commands',
        showSelectionCheckbox: true,
        enableRowClickSelection: false,
        multiSelect: true,
        selectedItems: [],
        filterOptions: {
          filterText: $location.search()["q"] || ''
        },
        columnDefs: [
          {
            field: 'name',
            displayName: 'Name',
            defaultSort: true,
            cellTemplate: $templateCache.get("idTemplate.html")
          },
          {
            field: 'description',
            displayName: 'Description'
          },
          {
            field: 'category',
            displayName: 'Category'
          }
        ]
      };

      var commandsUrl = ForgeApiURL + "/commands";
      $http.get(commandsUrl).
        success(function (data, status, headers, config) {
          if (angular.isArray(data) && status === 200) {
            $scope.commands = data.sort("name");
            $scope.fetched = true;
          }
        }).
        error(function (data, status, headers, config) {
          log.warn("failed to load " + commandsUrl + ". status: " + status + " data: " + data);
        });

    }]);
}
