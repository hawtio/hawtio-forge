/// <reference path="../../includes.ts"/>
/// <reference path="forgeHelpers.ts"/>
/// <reference path="forgePlugin.ts"/>

module Forge {

  export var CommandController = controller("CommandController",
    ["$scope", "$templateCache", "$location", "$routeParams", "$http", "$timeout", "ForgeApiURL", "ForgeModel",
      ($scope, $templateCache:ng.ITemplateCacheService, $location:ng.ILocationService, $routeParams, $http, $timeout, ForgeApiURL, ForgeModel) => {

        $scope.model = ForgeModel;

        $scope.resourcePath = $routeParams["path"] || $location.search()["path"];
        $scope.id = $routeParams["id"];
        $scope.path = $routeParams["path"];

        $scope.commandsLink = commandsLink($scope.resourcePath);
        $scope.entity = {
        };

        $scope.schema = getModelCommandInputs(ForgeModel, $scope.resourcePath, $scope.id);
        onSchemaLoad();

        $scope.$on('$routeUpdate', ($event) => {
          updateData();
        });

        $scope.execute = () => {
          // TODO if valid...

          $scope.response = null;
          $scope.executing = true;
          var commandId = $scope.id;
          var resourcePath = $scope.resourcePath;
          var url = executeCommandApiUrl(ForgeApiURL, commandId);
          var request = {
            resource: resourcePath,
            inputs: $scope.entity
          };
          log.info("About to post to " + url + " payload: " + angular.toJson(request));
          $http.post(url, request).
            success(function (data, status, headers, config) {
              $scope.executing = false;
              if (data) {
                data.message = data.message || data.output;
              }
              $scope.response = data;
              var status = ((data || {}).status || "").toString().toLowerCase();
              $scope.responseClass = toBackgroundStyle(status);

              Core.$apply($scope);
            }).
            error(function (data, status, headers, config) {
              $scope.executing = false;
              log.warn("Failed to load " + url + " " + data + " " + status);
            });
        };

        updateData();

        function toBackgroundStyle(status) {
          if (!status) {
            status = "";
          }
          if (status.startsWith("suc")) {
            return "bg-success";
          }
          return "bg-warning"
        }

        function updateData() {
          $scope.item = null;
          var commandId = $scope.id;
          if (commandId) {
            var resourcePath = $scope.resourcePath;
            var url = commandInputApiUrl(ForgeApiURL, commandId, resourcePath);
            $http.get(url).
              success(function (data, status, headers, config) {
                if (data) {
                  $scope.fetched = true;
                  $scope.schema = data;
                  setModelCommandInputs(ForgeModel, $scope.resourcePath, $scope.id, $scope.schema);
                  onSchemaLoad();
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

        function onSchemaLoad() {
          // lets update the value if its blank with the default values from the properties
          var schema = $scope.schema;
          $scope.fetched = schema;
          var entity = $scope.entity;
          if (schema) {
            angular.forEach(schema.properties, (property, key) => {
              var value = property.value;
              if (value && !entity[key]) {
                entity[key] = value;
              }
            });
          }
        }
      }]);
}
