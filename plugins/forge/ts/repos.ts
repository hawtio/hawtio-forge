/// <reference path="../../includes.ts"/>
/// <reference path="forgePlugin.ts"/>

module Forge {

  export var ReposController = controller("ReposController", ["$scope", "$dialog", "$window", "$templateCache", "$routeParams", "$location", "localStorage", "$http", "$timeout", "ForgeApiURL",
    ($scope, $dialog, $window, $templateCache, $routeParams, $location:ng.ILocationService, localStorage, $http, $timeout, ForgeApiURL) => {

      $scope.resourcePath = $routeParams["path"];
      $scope.commandsLink = commandsLink;

      $scope.login = {
        authHeader: localStorage["gogsAuthorization"],
        relogin: false,
        user: "",
        password: ""
      };

      $scope.doLogin = () => {
        var login = $scope.login;
        var user = login.user;
        var password = login.password;
        if (user && password) {
          var userPwd = user + ':' + password;
          login.authHeader = 'Basic ' + (userPwd.encodeBase64());
          updateData();
        }
      };

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
        var authHeader = $scope.login.authHeader;
        if (authHeader) {
          var url = reposApiUrl(ForgeApiURL);
          var config = {
            headers: {
              Authorization: authHeader
            }
          };
          $http.get(url, config).
            success(function (data, status, headers, config) {
              if (angular.isArray(data) && status === 200) {
                // lets store a successful login so that we hide the login page
                localStorage["gogsAuthorization"] = authHeader;

                $scope.projects = _.sortBy(data, "name");
                angular.forEach($scope.projects, (repo) => {
                  enrichRepo(repo);
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
      }

      updateData();

    }]);
}
