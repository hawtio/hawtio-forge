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
    function projectsApiUrl(ForgeApiURL: any): string;
    function projectApiUrl(ForgeApiURL: any, path: any): string;
}
