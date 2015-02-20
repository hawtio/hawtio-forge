// <reference path="../../includes.ts"/>
module Forge {

  export var context = '/forge';
  export var hash = '#' + context;
  export var defaultRoute = hash + '/projects';
  export var pluginName = 'Forge';
  export var pluginPath = 'plugins/forge/';
  export var templatePath = pluginPath + 'html/';
  export var log:Logging.Logger = Logger.get(pluginName);

  export var defaultIconUrl = Core.url("/img/forge.svg");



  export function isForge(workspace) {
    return true;
  }

  export function commandLink(name, resourcePath) {
    if (name) {
      if (resourcePath) {
        //return UrlHelpers.join("/forge/command", name, resourcePath);
        return UrlHelpers.join("/forge/command/", name) + "?path=" + resourcePath;
      } else {
        return UrlHelpers.join("/forge/command/", name);
      }
    }
    return null;
  }

  export function commandsLink(resourcePath) {
    if (resourcePath) {
      //return UrlHelpers.join("/forge/commands", resourcePath);
      return "/forge/commands?path=" + resourcePath;
    } else {
      return "/forge/commands";
    }
  }

}
