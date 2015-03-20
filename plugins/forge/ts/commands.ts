/// <reference path="../../includes.ts"/>
/// <reference path="forgePlugin.ts"/>

module Forge {

  export var CommandsController = controller("CommandsController", ["$scope", "$dialog", "$window", "$templateCache", "$routeParams", "$location", "localStorage", "$http", "$timeout", "ForgeApiURL", "ForgeModel",
    ($scope, $dialog, $window, $templateCache, $routeParams, $location:ng.ILocationService, localStorage, $http, $timeout, ForgeApiURL, ForgeModel) => {

      $scope.model = ForgeModel;
      $scope.resourcePath = $routeParams["path"] || $location.search()["path"];
      $scope.projectDescription = $scope.resourcePath || "";
      if (!$scope.projectDescription.startsWith("/") && $scope.projectDescription.length > 0) {
        $scope.projectDescription = "/" + $scope.projectDescription;
      }

      redirectToGogsLoginIfRequired($location);

      $scope.commands = getModelCommands(ForgeModel, $scope.resourcePath);
      $scope.fetched = $scope.commands.length !== 0;

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

      var url = UrlHelpers.join(ForgeApiURL, "commands", $scope.resourcePath);
      log.info("Fetching commands from: " + url);
      $http.get(url).
        success(function (data, status, headers, config) {
          if (angular.isArray(data) && status === 200) {
            var resourcePath = $scope.resourcePath;
            $scope.commands = _.sortBy(data, "name");
            angular.forEach($scope.commands, (command) => {
              var name = command.id || command.name;
              command.$link = commandLink(name, resourcePath);
            });
            setModelCommands($scope.model, $scope.resourcePath, $scope.commands);
            $scope.fetched = true;
          }
        }).
        error(function (data, status, headers, config) {
          log.warn("failed to load " + url + ". status: " + status + " data: " + data);
        });

    }]);
}
