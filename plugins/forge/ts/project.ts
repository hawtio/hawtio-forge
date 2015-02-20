/// <reference path="../../includes.ts"/>
/// <reference path="forgeHelpers.ts"/>
/// <reference path="forgePlugin.ts"/>

module Forge {

  export var ProjectController = controller("ProjectController",
    ["$scope", "$templateCache", "$location", "$routeParams", "$http", "$timeout", "ForgeApiURL",
      ($scope, $templateCache:ng.ITemplateCacheService, $location:ng.ILocationService, $routeParams, $http, $timeout, ForgeApiURL) => {

        $scope.project = {
          path: ""
          };

        $scope.save = () => {
          log.info("Saving " + angular.toJson($scope.project));
          if ($scope.project.path) {
            var url = projectsApiUrl(ForgeApiURL);
            $http.post(url, $scope.project).
              success(function (data, status, headers, config) {
                $location.path("/forge/projects");
              }).
              error(function (data, status, headers, config) {
                log.warn("failed to load " + url + ". status: " + status + " data: " + data);
                var message = "Failed to POST to " + url + " got status: " + status;
                Core.notification('error', message);
              });
          }
        };

        $scope.$on('$routeUpdate', ($event) => {
          updateData();
        });

        updateData();

        function updateData() {
        }
      }]);
}
