// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from "vscode";
import * as mdItContainer from "markdown-it-container";
// import { blockName, scriptPlugin } from "./markdown-it/scriptPlugin";
import path from "path";
import * as fs from "fs/promises";
import { getSettings } from "./vscode-adapter";

let nonce = "";
const logger = vscode.window.createOutputChannel("test-log", { log: true });

const standardScriptPaths = [
  "./externalScripts/webcomponents/webcomponentsjs/webcomponents-loader.js",
  "./externalScripts/gunjs/gun.js",
  "./externalScripts/gunjs/sea.js",
  "./out/preview/word-count.js",
];

const loadScriptsCommandName = "ultinotes-markdown-scripts.reloadScripts";
// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
  // Use the console to output diagnostic information (console.log) and errors (console.error)
  // This line of code will only be executed once when your extension is activated
  console.log(
    'Congratulations, your extension "ultinotes-markdown-scripts" is now active!'
  );

  logger.clear();
  logger.appendLine("Congrats");
  logger.show(true);
  logger.appendLine("Hello World");

  const absoluteExtensionPath = context.extensionPath;

  // TODO:
  // - read the registered paths from settings file
  // - write script files to package.json
  // - prompt user to reload (can we do it programmatically?)
  const loadScriptCommand = vscode.commands.registerCommand(
    loadScriptsCommandName,
    async () => {
      logger.appendLine("Reloading Scripts");
      const workspaceFolders = vscode.workspace.workspaceFolders;
      if (!workspaceFolders) {
        vscode.window.showErrorMessage("No workspace folder is open.");
        return;
      }

      vscode.window.showInformationMessage("Adding Scripts to VSCode");

      const workspacePath = workspaceFolders[0].uri.fsPath;

      // TODO: change into async read
      const contentString = await fs.readFile(
        path.join(absoluteExtensionPath, "package.json"),
        {
          encoding: "utf-8",
        }
      );
      const contentJson = JSON.parse(contentString) as {
        contributes: { "markdown.previewScripts": string[] };
      };

      logger.appendLine(
        contentJson.contributes["markdown.previewScripts"].join(",")
      );

      contentJson.contributes["markdown.previewScripts"] =
        standardScriptPaths.map((p) => {
          return p;
        });

      logger.appendLine("Rewriting setting paths");
      // add all scripts from settings
      contentJson.contributes["markdown.previewScripts"].push(
        ...getSettings().addedScripts.map((p) => {
          // paths must relate to extension root inside the extension
          // but relate to workspace root inside settings
          const relativePath = path.relative(
            absoluteExtensionPath,
            path.join(workspacePath, p)
          );
          logger.appendLine("Rewriting " + p + " to " + relativePath);
          return relativePath;
        })
      );

      await fs.writeFile(
        path.join(absoluteExtensionPath, "package.json"),
        JSON.stringify(contentJson, undefined, 2)
      );

      // TODO: check if path is file or folder --> compile list of files
      // TODO: add file list to package.json as absolute path
      // TODO: reload vscode
      // TODO: check if all files exist on every reload and remove files that are missing

      // // Read the configured folder name
      // const config = vscode.workspace.getConfiguration(
      //   "ultinotes-markdown-scripts"
      // );
      // // TODO: add sane default
      // const scriptsFolder = config.get<string[]>("scriptsFolder", ["scripts"]);
      // scriptsFolder.forEach((scriptFolder) => {
      //   const scriptsPath = path.join(workspacePath, scriptFolder);

      //   fs.readdir(scriptsPath, (err , files) => {
      //     if (err) {
      //       vscode.window.showErrorMessage(
      //         `Failed to read scripts directory: ${err.message}`
      //       );
      //       return;
      //     }

      //     const scriptUris = files
      //       .filter((file) => file.endsWith(".js"))
      //       .map((file) =>
      //         vscode.Uri.file(path.join(scriptsPath, file)).toString()
      //       );

      //     if (scriptUris.length > 0) {
      //       scriptUris.forEach(logger.appendLine);
      //       logger.show(true);

      //       vscode.window.showInformationMessage(
      //         `Added ${scriptUris.length} scripts from the "scripts" folder.`
      //       );
      //     } else {
      //       vscode.window.showInformationMessage(
      //         `No JavaScript files found in the "scripts" folder.`
      //       );
      //     }
      //   });
      // });
    }
  );

  // Execute the command once when the extension is activated
  vscode.commands.executeCommand(loadScriptsCommandName);

  context.subscriptions.push(loadScriptCommand);
}

// This method is called when your extension is deactivated
export function deactivate() {}
