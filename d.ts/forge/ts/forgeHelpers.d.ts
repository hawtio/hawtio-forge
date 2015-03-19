declare module Forge {
    var context: string;
    var hash: string;
    var defaultRoute: string;
    var pluginName: string;
    var pluginPath: string;
    var templatePath: string;
    var log: Logging.Logger;
    var defaultIconUrl: string;
    function isForge(workspace: any): boolean;
    function commandLink(name: any, resourcePath: any): string;
    function commandsLink(resourcePath: any): string;
    function reposApiUrl(ForgeApiURL: any): string;
    function repoApiUrl(ForgeApiURL: any, path: any): string;
    function commandApiUrl(ForgeApiURL: any, commandId: any, resourcePath?: any): string;
    function executeCommandApiUrl(ForgeApiURL: any, commandId: any): string;
    function validateCommandApiUrl(ForgeApiURL: any, commandId: any): string;
    function commandInputApiUrl(ForgeApiURL: any, commandId: any, resourcePath: any): string;
    function setModelCommands(ForgeModel: any, resourcePath: any, commands: any): void;
    function getModelCommands(ForgeModel: any, resourcePath: any): any;
    function getModelCommandInputs(ForgeModel: any, resourcePath: any, id: any): any;
    function setModelCommandInputs(ForgeModel: any, resourcePath: any, id: any, item: any): any;
    function enrichRepo(repo: any): void;
}
