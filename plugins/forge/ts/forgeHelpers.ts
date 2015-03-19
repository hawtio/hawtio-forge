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
        return UrlHelpers.join("/forge/command", name, resourcePath);
      } else {
        return UrlHelpers.join("/forge/command/", name);
      }
    }
    return null;
  }

  export function commandsLink(resourcePath) {
    if (resourcePath) {
      return UrlHelpers.join("/forge/commands/user", resourcePath);
    } else {
      return "/forge/commands";
    }
  }

  export function reposApiUrl(ForgeApiURL) {
    return UrlHelpers.join(ForgeApiURL, "/repos");
  }

  export function repoApiUrl(ForgeApiURL, path) {
    return UrlHelpers.join(ForgeApiURL, "/repos", path);
  }

  export function commandApiUrl(ForgeApiURL, commandId, resourcePath = null) {
    return UrlHelpers.join(ForgeApiURL, "command", commandId, resourcePath);
  }

  export function executeCommandApiUrl(ForgeApiURL, commandId) {
    return UrlHelpers.join(ForgeApiURL, "command", "execute", commandId);
  }

  export function validateCommandApiUrl(ForgeApiURL, commandId) {
    return UrlHelpers.join(ForgeApiURL, "command", "validate", commandId);
  }

  export function commandInputApiUrl(ForgeApiURL, commandId, resourcePath) {
    return UrlHelpers.join(ForgeApiURL, "commandInput", commandId, resourcePath);
  }



  /**
   * Returns the project for the given resource path
   */
  function modelProject(ForgeModel, resourcePath) {
    if (resourcePath) {
      var project = ForgeModel.projects[resourcePath];
      if (!project) {
        project = {};
        ForgeModel.projects[resourcePath] = project;
      }
      return project;
    } else {
      return ForgeModel.rootProject;
    }
  }

  export function setModelCommands(ForgeModel, resourcePath, commands) {
    var project = modelProject(ForgeModel, resourcePath);
    project.$commands = commands;
  }

  export function getModelCommands(ForgeModel, resourcePath) {
    var project = modelProject(ForgeModel, resourcePath);
    return project.$commands || [];
  }

  function modelCommandInputMap(ForgeModel, resourcePath) {
    var project = modelProject(ForgeModel, resourcePath);
    var commandInputs = project.$commandInputs;
    if (!commandInputs) {
      commandInputs = {};
      project.$commandInputs = commandInputs;
    }
    return commandInputs;
  }

  export function getModelCommandInputs(ForgeModel, resourcePath, id) {
    var commandInputs = modelCommandInputMap(ForgeModel, resourcePath);
    return commandInputs[id];
  }

  export function setModelCommandInputs(ForgeModel, resourcePath, id, item) {
    var commandInputs = modelCommandInputMap(ForgeModel, resourcePath);
    return commandInputs[id] = item;
  }

}
