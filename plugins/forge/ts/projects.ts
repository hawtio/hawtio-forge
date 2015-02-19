/// <reference path="../../includes.ts"/>
/// <reference path="forgePlugin.ts"/>

module Forge {

  export var ProjectsController = controller("ProjectsController", ["$scope", "$dialog", "$window", "$templateCache", "$routeParams", "$location", "localStorage", "$http", "$timeout", "ForgeApiURL",
    ($scope, $dialog, $window, $templateCache, $routeParams, $location:ng.ILocationService, localStorage, $http, $timeout, ForgeApiURL) => {

      $scope.resourcePath = $routeParams["path"];
      $scope.commandsLink = commandsLink;
    }]);
}
