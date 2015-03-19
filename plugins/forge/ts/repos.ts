/// <reference path="../../includes.ts"/>
/// <reference path="forgePlugin.ts"/>

module Forge {

  export var ReposController = controller("ReposController", ["$scope", "$dialog", "$window", "$templateCache", "$routeParams", "$location", "localStorage", "$http", "$timeout", "ForgeApiURL",
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
            field: 'name',
            displayName: 'Repository Name',
            cellTemplate: $templateCache.get("repoTemplate.html")
          },
          {
            field: 'actions',
            displayName: 'Actions',
            cellTemplate: $templateCache.get("repoActionsTemplate.html")
          }
        ]
      };

      $scope.openCommands = () => {
        var resourcePath = null;
        var selected = $scope.tableConfig.selectedItems;
        if (_.isArray(selected) && selected.length) {
          resourcePath = selected[0].path;
        }
        var link = commandsLink(resourcePath);
        log.info("moving to commands link: " + link);
        $location.path(link);
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
            var url = repoApiUrl(ForgeApiURL, path);
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
        var url = reposApiUrl(ForgeApiURL);
        $http.get(url).
          success(function (data, status, headers, config) {
            if (angular.isArray(data) && status === 200) {
              $scope.projects = _.sortBy(data, "name");
              angular.forEach($scope.projects, (project) => {
                var owner = project.owner || {};
                var user = owner.username || project.user;
                var name = project.name;
                var fullName = project.fullName;
                if (user && name) {
                  var resourcePath = user + "/" + name;
                  project.$commandsLink = commandsLink(resourcePath);

                  if (!fullName) {
                    fullName = resourcePath;
                  }
                }
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
