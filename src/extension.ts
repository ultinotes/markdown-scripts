// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from "vscode";
import * as mdItContainer from "markdown-it-container";
import { blockName, scriptPlugin } from "./markdown-it/scriptPlugin";
import path from "path";
import * as fs from "fs";

let nonce = "";
const logger = vscode.window.createOutputChannel("test-log", { log: true });
const outputChannel = vscode.window.createOutputChannel("detector", {
  log: true,
});

// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
  // Use the console to output diagnostic information (console.log) and errors (console.error)
  // This line of code will only be executed once when your extension is activated
  console.log(
    'Congratulations, your extension "markdown-scripts" is now active!'
  );

  logger.clear();
  logger.appendLine("Congrats");
  logger.show(true);
  logger.appendLine("Hello World");

  const loadScriptCommand = vscode.commands.registerCommand(
    "markdown-scripts.reloadScripts",
    () => {
      const workspaceFolders = vscode.workspace.workspaceFolders;
      if (!workspaceFolders) {
        vscode.window.showErrorMessage("No workspace folder is open.");
        return;
      }

      const workspacePath = workspaceFolders[0].uri.fsPath;

      // Read the configured folder name
      const config = vscode.workspace.getConfiguration("extension");
      const scriptsFolder = config.get<string>("scriptsFolder", "scripts");
      const scriptsPath = path.join(workspacePath, scriptsFolder);

      fs.readdir(scriptsPath, (err, files) => {
        if (err) {
          vscode.window.showErrorMessage(
            `Failed to read scripts directory: ${err.message}`
          );
          return;
        }

        const scriptUris = files
          .filter((file) => file.endsWith(".js"))
          .map((file) =>
            vscode.Uri.file(path.join(scriptsPath, file)).toString()
          );

        if (scriptUris.length > 0) {
          const previewScriptsConfig =
            vscode.workspace.getConfiguration("markdown");
          const currentScripts =
            previewScriptsConfig.get<string[]>("previewScripts") || [];
          const newScripts = [...currentScripts, ...scriptUris];
          previewScriptsConfig.update(
            "previewScripts",
            newScripts,
            vscode.ConfigurationTarget.Global
          );
          vscode.window.showInformationMessage(
            `Added ${scriptUris.length} scripts from the "scripts" folder.`
          );
        } else {
          vscode.window.showInformationMessage(
            `No JavaScript files found in the "scripts" folder.`
          );
        }
      });
    }
  );

  // Execute the command once when the extension is activated
  // vscode.commands.executeCommand("markdown-scripts.reloadScripts");

  context.subscriptions.push(loadScriptCommand);

  // register Markdown It plugin
  return {
    extendMarkdownIt(md: markdownit) {
      extendMarkdownItWithScripts(md, logger, {
        languageIds: () => {
          return [];
          // return vscode.workspace
          //   .getConfiguration("markdown-scripts") // ! keep in sync with name from package.json > configuration
          //   .get<string[]>("languages", ["js-exec"]);
        },
      });
      return md;
    },
  };
}

// // Function to get the existing markdown preview webview
// function getMarkdownPreviewWebview(
//   uri: vscode.Uri
// ): vscode.WebviewPanel | undefined {
//   // VS Code's API to retrieve the existing markdown preview panel might need to be adapted
//   const panels = vscode.window.visibleTextEditors.filter(
//     (editor) => editor.document.uri.toString() === uri.toString()
//   );
//   if (panels.length > 0) {
//     const webviewPanel = panels[0] as vscode.WebviewPanel;
//     return webviewPanel;
//   }
//   return undefined;
// }

// This method is called when your extension is deactivated
export function deactivate() {}

function extendMarkdownItWithScripts(
  md: markdownit,
  logger: vscode.LogOutputChannel,
  config?: { languageIds(): readonly string[] }
) {
  // TODO: extract markdown-it parser into own project for separate testing
  // TODO: create test runner script for markdown-it plugin
  // TODO: because test runner wants to download VSCode
  // TODO: --> create docker-image for testing
  md.use(scriptPlugin, logger);

  return md;
}
