// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from "vscode";
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
  logger.show(true);

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
  context.subscriptions.push(loadScriptCommand);

  // register Markdown It plugin
  return {};
}

// This method is called when your extension is deactivated
export function deactivate() {}
