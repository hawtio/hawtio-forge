/// <reference path="../../includes.ts"/>
/// <reference path="forgeHelpers.ts"/>
/// <reference path="forgePlugin.ts"/>

module Forge {

  export var CommandController = controller("CommandController",
    ["$scope", "$templateCache", "$location", "$routeParams", "$http", "$timeout", "ForgeApiURL",
      ($scope, $templateCache:ng.ITemplateCacheService, $location:ng.ILocationService, $routeParams, $http, $timeout, ForgeApiURL) => {

        $scope.resourcePath = $routeParams["path"] || $location.search()["path"];

        $scope.commandsLink = commandsLink($scope.resourcePath);
        $scope.itemConfig = {
          properties: {}
        };

        $scope.$on('$routeUpdate', ($event) => {
          updateData();
        });

        updateData();

        function updateData() {
          $scope.id = $routeParams["id"];
          $scope.path = $routeParams["path"];
          $scope.item = null;
          if ($scope.id) {
            var url = UrlHelpers.join(ForgeApiURL, "commandInput", $scope.id, $scope.resourcePath);
            $http.get(url).
              success(function (data, status, headers, config) {
                if (data) {
                  $scope.fetched = true;
                  $scope.item = data;
                }
                Core.$apply($scope);
              }).
              error(function (data, status, headers, config) {
                log.warn("Failed to load " + url + " " + data + " " + status);
              });
          } else {
            Core.$apply($scope);
          }
        }
      }]);
}
