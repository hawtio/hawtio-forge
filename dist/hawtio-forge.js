/// <reference path="../libs/hawtio-forms/defs.d.ts"/>
/// <reference path="../libs/hawtio-ui/defs.d.ts"/>
/// <reference path="../libs/hawtio-utilities/defs.d.ts"/>
/// <reference path="../libs/hawtio-wiki/defs.d.ts"/>

// <reference path="../../includes.ts"/>
var Forge;
(function (Forge) {
    Forge.context = '/forge';
    Forge.hash = '#' + Forge.context;
    Forge.defaultRoute = Forge.hash + '/projects';
    Forge.pluginName = 'Forge';
    Forge.pluginPath = 'plugins/forge/';
    Forge.templatePath = Forge.pluginPath + 'html/';
    Forge.log = Logger.get(Forge.pluginName);
    Forge.defaultIconUrl = Core.url("/img/forge.svg");
    function isForge(workspace) {
        return true;
    }
    Forge.isForge = isForge;
    function commandLink(name, resourcePath) {
        if (name && resourcePath) {
            //return UrlHelpers.join("/forge/command", name, resourcePath);
            return UrlHelpers.join("/forge/command/", name) + "?path=" + resourcePath;
        }
        return null;
    }
    Forge.commandLink = commandLink;
    function commandsLink(resourcePath) {
        if (resourcePath) {
            //return UrlHelpers.join("/forge/commands", resourcePath);
            return "/forge/commands?path=" + resourcePath;
        }
        return null;
    }
    Forge.commandsLink = commandsLink;
})(Forge || (Forge = {}));

/// <reference path="../../includes.ts"/>
/// <reference path="forgeHelpers.ts"/>
var Forge;
(function (Forge) {
    Forge._module = angular.module(Forge.pluginName, ['hawtio-core', 'hawtio-ui', 'wiki']);
    Forge.controller = PluginHelpers.createControllerFunction(Forge._module, Forge.pluginName);
    Forge.route = PluginHelpers.createRoutingFunction(Forge.templatePath);
    Forge._module.config(['$routeProvider', function ($routeProvider) {
        $routeProvider.when(UrlHelpers.join(Forge.context, '/projects/*path'), Forge.route('projects.html', false)).when(UrlHelpers.join(Forge.context, '/projects'), Forge.route('projects.html', false)).when(UrlHelpers.join(Forge.context, '/commands'), Forge.route('commands.html', false)).when(UrlHelpers.join(Forge.context, '/commands/*path'), Forge.route('commands.html', false)).when(UrlHelpers.join(Forge.context, '/command/:id'), Forge.route('command.html', false)).when(UrlHelpers.join(Forge.context, '/command/:id/*path'), Forge.route('command.html', false)).when(Forge.context, { redirectTo: UrlHelpers.join(Forge.context, 'projects') });
    }]);
    // set up a promise that supplies the API URL for Forge, proxied if necessary
    Forge._module.factory('ForgeApiURL', ['jolokiaUrl', 'jolokia', '$q', '$rootScope', function (jolokiaUrl, jolokia, $q, $rootScope) {
        return "/api/forge";
    }]);
    Forge._module.run(['viewRegistry', 'workspace', 'HawtioNav', function (viewRegistry, workspace, HawtioNav) {
        Forge.log.debug("Running");
        viewRegistry['forge'] = Forge.templatePath + 'layoutForge.html';
        var builder = HawtioNav.builder();
        var projects = builder.id('forge-projects').href(function () { return UrlHelpers.join(Forge.context, 'projects'); }).title(function () { return 'Projects'; }).build();
        var commands = builder.id('forge-commands').href(function () { return UrlHelpers.join(Forge.context, 'commands'); }).title(function () { return 'Command'; }).build();
        var mainTab = builder.id('forge').rank(100).defaultPage({
            rank: 100,
            isValid: function (yes, no) {
                yes();
            }
        }).href(function () { return Forge.context; }).title(function () { return 'Forge'; }).isValid(function () { return Forge.isForge(workspace); }).tabs(projects, commands).build();
        HawtioNav.add(mainTab);
        // disable the images page for now...
        var navItems = HawtioNav.items || [];
        var dockerRegistry = navItems.find(function (item) { return item.id === "docker-registry"; });
        if (dockerRegistry) {
            dockerRegistry.isValid = function () { return false; };
        }
    }]);
    hawtioPluginLoader.addModule(Forge.pluginName);
})(Forge || (Forge = {}));

/// <reference path="../../includes.ts"/>
/// <reference path="forgeHelpers.ts"/>
/// <reference path="forgePlugin.ts"/>
var Forge;
(function (Forge) {
    Forge.CommandController = Forge.controller("CommandController", ["$scope", "$templateCache", "$location", "$routeParams", "$http", "$timeout", "ForgeApiURL", function ($scope, $templateCache, $location, $routeParams, $http, $timeout, ForgeApiURL) {
        $scope.resourcePath = $routeParams["path"] || $location.search()["path"];
        $scope.commandsLink = Forge.commandsLink($scope.resourcePath);
        $scope.itemConfig = {
            properties: {}
        };
        $scope.$on('$routeUpdate', function ($event) {
            updateData();
        });
        updateData();
        function updateData() {
            $scope.id = $routeParams["id"];
            $scope.path = $routeParams["path"];
            $scope.item = null;
            if ($scope.id) {
                var url = UrlHelpers.join(ForgeApiURL, "commandInput", $scope.id, $scope.resourcePath);
                $http.get(url).success(function (data, status, headers, config) {
                    if (data) {
                        $scope.fetched = true;
                        $scope.item = data;
                    }
                    Core.$apply($scope);
                }).error(function (data, status, headers, config) {
                    Forge.log.warn("Failed to load " + url + " " + data + " " + status);
                });
            }
            else {
                Core.$apply($scope);
            }
        }
    }]);
})(Forge || (Forge = {}));

/// <reference path="../../includes.ts"/>
/// <reference path="forgePlugin.ts"/>
var Forge;
(function (Forge) {
    Forge.CommandsController = Forge.controller("CommandsController", ["$scope", "$dialog", "$window", "$templateCache", "$routeParams", "$location", "localStorage", "$http", "$timeout", "ForgeApiURL", function ($scope, $dialog, $window, $templateCache, $routeParams, $location, localStorage, $http, $timeout, ForgeApiURL) {
        $scope.resourcePath = $routeParams["path"] || $location.search()["path"];
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
        $http.get(commandsUrl).success(function (data, status, headers, config) {
            if (angular.isArray(data) && status === 200) {
                var resourcePath = $scope.resourcePath;
                $scope.commands = data.sort("name");
                angular.forEach($scope.commands, function (command) {
                    var name = command.name;
                    command.$link = Forge.commandLink(name, resourcePath);
                });
                $scope.fetched = true;
            }
        }).error(function (data, status, headers, config) {
            Forge.log.warn("failed to load " + commandsUrl + ". status: " + status + " data: " + data);
        });
    }]);
})(Forge || (Forge = {}));

/// <reference path="../../includes.ts"/>
/// <reference path="forgePlugin.ts"/>
var Forge;
(function (Forge) {
    Forge.ProjectsController = Forge.controller("ProjectsController", ["$scope", "$dialog", "$window", "$templateCache", "$routeParams", "$location", "localStorage", "$http", "$timeout", "ForgeApiURL", function ($scope, $dialog, $window, $templateCache, $routeParams, $location, localStorage, $http, $timeout, ForgeApiURL) {
        $scope.resourcePath = $routeParams["path"];
        $scope.commandsLink = Forge.commandsLink;
    }]);
})(Forge || (Forge = {}));

angular.module("hawtio-forge-templates", []).run(["$templateCache", function($templateCache) {$templateCache.put("plugins/forge/html/command.html","<div ng-controller=\"Forge.CommandController\">\n  <div class=\"row\">\n    <div class=\"col-md-12\">\n      <span class=\"pull-right\">&nbsp;</span>\n      <a class=\"btn btn-default pull-right\"\n              href=\"{{commandsLink}}\"><i class=\"fa fa-list\"></i></a>\n      <button class=\"btn btn-primary pull-right\"\n              title=\"Perform this command\"\n              ng-click=\"execute()\">\n        Execute\n      </button>\n    </div>\n  </div>\n  <div class=\"row\">\n    <div class=\"col-md-12\">\n      <div ng-hide=\"fetched\">\n        <div class=\"align-center\">\n          <i class=\"fa fa-spinner fa-spin\"></i>\n        </div>\n      </div>\n      <div ng-show=\"fetched\">\n        <div hawtio-object=\"item\" config=\"itemConfig\"></div>\n      </div>\n    </div>\n  </div>\n</div>\n");
$templateCache.put("plugins/forge/html/commands.html","<div class=\"row\" ng-controller=\"Forge.CommandsController\">\n  <div class=\"row\">\n    <div class=\"col-md-12\">\n      <form name=\"myForm\">\n        Project resource: <input type=\"text\" name=\"input\" ng-model=\"resourcePath\" required>\n\n        <span class=\"error\" ng-show=\"myForm.input.$error.required\">\n          Required!</span>\n      </form>\n    </div>\n  </div>\n  <div class=\"row\">\n    <hr/>\n  </div>\n  <div class=\"row\">\n    <div class=\"col-md-12\" ng-show=\"commands.length\">\n      <span ng-show=\"!id\">\n        Command: <hawtio-filter ng-model=\"tableConfig.filterOptions.filterText\"\n                       css-class=\"input-xxlarge\"\n                       placeholder=\"Filter commands...\"></hawtio-filter>\n      </span>\n    </div>\n  </div>\n  <div class=\"row\">\n    <div class=\"col-md-12\">\n      <div ng-hide=\"fetched\">\n        <div class=\"align\">\n          <i class=\"fa fa-spinner fa-spin\"></i>\n        </div>\n      </div>\n      <div ng-show=\"fetched\">\n        <div ng-hide=\"commands.length\" class=\"align-center\">\n          <p class=\"alert alert-info\">There are no commands available!</p>\n        </div>\n        <div ng-show=\"commands.length\">\n          <table class=\"table table-condensed table-striped\" hawtio-simple-table=\"tableConfig\"></table>\n        </div>\n      </div>\n    </div>\n  </div>\n</div>\n");
$templateCache.put("plugins/forge/html/layoutForge.html","<script type=\"text/ng-template\" id=\"idTemplate.html\">\n  <div class=\"ngCellText\">\n    <a href=\"\"\n       title=\"Execute command {{row.entity.name}}\"\n       ng-href=\"{{row.entity.$link}}\">\n      {{row.entity.name}}</a>\n  </div>\n</script>\n<script type=\"text/ng-template\" id=\"categoryTemplate.html\">\n  <div class=\"ngCellText\">\n    <span class=\"pod-label badge\"\n          class=\"background-light-grey mouse-pointer\">{{row.entity.category}}</span>\n  </div>\n</script>\n\n<div class=\"row\">\n  <div class=\"wiki-icon-view\">\n    <div class=\"row forge-view\" ng-view></div>\n  </div>\n</div>\n");
$templateCache.put("plugins/forge/html/projects.html","<div class=\"row\" ng-controller=\"Forge.ProjectsController\">\n  <div class=\"row\">\n    <div class=\"col-md-12\">\n      <form name=\"myForm\">\n        Project resource: <input type=\"text\" name=\"input\" ng-model=\"resourcePath\" required>\n\n        <a class=\"btn btn-primary\" ng-href=\"{{commandsLink(resourcePath)}}\">Commands</a>\n      </form>\n    </div>\n  </div>\n  <div class=\"row\">\n    <div class=\"col-md-12\">\n      <p>You need to enter a path on your local file system to execute a Forge command</p>\n    </div>\n  </div>\n</div>\n");}]); hawtioPluginLoader.addModule("hawtio-forge-templates");