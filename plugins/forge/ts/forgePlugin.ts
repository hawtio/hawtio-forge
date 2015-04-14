/// <reference path="../../includes.ts"/>
/// <reference path="forgeHelpers.ts"/>

module Forge {

  export var _module = angular.module(pluginName, ['hawtio-core', 'hawtio-ui']);
  export var controller = PluginHelpers.createControllerFunction(_module, pluginName);
  export var route = PluginHelpers.createRoutingFunction(templatePath);

  _module.config(['$routeProvider', ($routeProvider:ng.route.IRouteProvider) => {
    $routeProvider.when(UrlHelpers.join(context, '/repos/:path*'), route('repo.html', false))
                  .when(UrlHelpers.join(context, '/repos'), route('repos.html', false))
                  .when(UrlHelpers.join(context, '/commands'), route('commands.html', false))
                  .when(UrlHelpers.join(context, '/commands/:path*'), route('commands.html', false))
                  .when(UrlHelpers.join(context, '/command/:id'), route('command.html', false))
                  .when(UrlHelpers.join(context, '/command/:id/:path*'), route('command.html', false))
                  .when(context, { redirectTo: UrlHelpers.join(context, 'repos') });
  }]);

  // set up a promise that supplies the API URL for Forge, proxied if necessary
  _module.factory('ForgeApiURL', ['jolokiaUrl', 'jolokia', '$q', '$rootScope', (jolokiaUrl:string, jolokia:Jolokia.IJolokia, $q:ng.IQService, $rootScope:ng.IRootScopeService) => {
    return "/api/forge"
  }]);

  _module.factory('ServiceRegistry', [() => {
    return {
      hasService: (serviceName: string) => "gogs-http-service" === serviceName,
      findService: (serviceName: string) => null,
      serviceLink: (serviceName: string) => {
        if (serviceName === "gogs-http-service") {
          return "http://gogs.dummy.local";
        } else {
          return null;
        }
      }
    };
  }]);

  _module.factory('ForgeModel', ['jolokiaUrl', 'jolokia', '$q', '$rootScope', (jolokiaUrl:string, jolokia:Jolokia.IJolokia, $q:ng.IQService, $rootScope:ng.IRootScopeService) => {
    return {
      rootProject: {

      },
      projects: []
    }
  }]);

  _module.run(['viewRegistry', 'workspace', 'HawtioNav', (viewRegistry, workspace:Core.Workspace, HawtioNav) => {
    log.debug("Running");
    viewRegistry['forge'] = templatePath + 'layoutForge.html';

    var builder = HawtioNav.builder();

    var repos = builder.id('forge-repos')
                      .href(() => UrlHelpers.join(context, 'repos'))
                      .title(() => 'Repositories')
                      .build();

    var mainTab = builder.id('forge')
                        .rank(110)
                         .href(() => context)
                         .title(() => 'Forge')
                         .isValid(() => isForge(workspace))
                         .tabs(repos)
                         .build();

    HawtioNav.add(mainTab);

    // disable the images page for now...
    var navItems = HawtioNav.items || [];
    var dockerRegistry = navItems.find((item) => item.id === "docker-registry");
    if (dockerRegistry) {
      dockerRegistry.isValid = () => false;
    }
  }]);

  hawtioPluginLoader.addModule(pluginName);
}
