/// <reference path="../../includes.ts"/>
/// <reference path="forgePlugin.ts"/>

module Forge {

  export var ProjectsController = controller("ProjectsController", ["$scope", "$dialog", "$window", "$templateCache", "$routeParams", "$location", "localStorage", "$http", "$timeout", "ForgeApiURL",
    ($scope, $dialog, $window, $templateCache, $routeParams, $location:ng.ILocationService, localStorage, $http, $timeout, ForgeApiURL) => {

      $scope.resourcePath = $routeParams["path"];
      $scope.commandsLink = commandsLink;

      $scope.tableConfig = {
        data: 'projects',
        showSelectionCheckbox: true,
        enableRowClickSelection: false,
        multiSelect: true,
        selectedItems: [],
        filterOptions: {
          filterText: $location.search()["q"] || ''
        },
        columnDefs: [
          {
            field: 'path',
            displayName: 'Path',
            cellTemplate: $templateCache.get("projectTemplate.html")
          }
        ]
      };

      $scope.delete = (projects) => {
        UI.multiItemConfirmActionDialog(<UI.MultiItemConfirmActionOptions>{
          collection: projects,
          index: 'path',
          onClose: (result:boolean) => {
            if (result) {
              doDelete(projects);
            }
          },
          title: 'Delete projects?',
          action: 'The following projects will be removed (though the files will remain on your file system):',
          okText: 'Delete',
          okClass: 'btn-danger',
          custom: "This operation is permanent once completed!",
          customClass: "alert alert-warning"
        }).open();
      };

      function doDelete(projects) {
        angular.forEach(projects, (project) => {
          log.info("Deleting " + angular.toJson($scope.projects));
          var path = project.path;
          if (path) {
            var url = projectApiUrl(ForgeApiURL, path);
            $http.delete(url).
              success(function (data, status, headers, config) {
                updateData();
              }).
              error(function (data, status, headers, config) {
                log.warn("failed to load " + url + ". status: " + status + " data: " + data);
                var message = "Failed to POST to " + url + " got status: " + status;
                Core.notification('error', message);
              });
          }
        });
      }

      function updateData() {
        var url = projectsApiUrl(ForgeApiURL);
        $http.get(url).
          success(function (data, status, headers, config) {
            if (angular.isArray(data) && status === 200) {
              $scope.projects = _.sortBy(data, "name");
              angular.forEach($scope.projects, (project) => {
                var resourcePath = project.path;
                project.$commandsLink = commandsLink(resourcePath);
              });
              if (!$scope.projects || !$scope.projects.length) {
                $location.path("/forge/addProject");
              }
              $scope.fetched = true;
            }
          }).
          error(function (data, status, headers, config) {
            log.warn("failed to load " + url + ". status: " + status + " data: " + data);
          });
      }

      updateData();

    }]);
}
