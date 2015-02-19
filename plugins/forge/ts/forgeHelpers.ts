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

}
