import * as vscode from "vscode";
import path from "path";
import * as fs from "fs/promises";
import { getSettings } from "./vscode-adapter";

import * as mdItContainer from "markdown-it-container";
import { blockName, scriptPlugin } from "./markdown-it/scriptPlugin";

const logger = vscode.window.createOutputChannel("test-log", { log: true });

const standardScriptPaths = [
  "./node_modules/@webcomponents/webcomponentsjs/webcomponents-loader.js",
  "./node_modules/gun/gun.js",
  // "./node_modules/gun/sea.js",
  "./out/preview/word-count.js",
];

const loadScriptsCommandName = "ultinotes-markdown-scripts.reloadScripts";
// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed.
// In our case the extension is activated the first time you open a
// markdown preview.
export function activate(context: vscode.ExtensionContext) {
  logger.clear();
  logger.show(true);

  const absoluteExtensionPath = context.extensionPath;

  const docChangeDisposable = vscode.workspace.onDidChangeTextDocument(
    (event) => {
      const document = event.document;
      const changes = event.contentChanges;

      if (document.fileName.includes("ultinotes-markdown-scripts.test-log")) {
        // omit changes in the test-log
        return;
      }

      // Process the changes (e.g., send to the server)
      // logger.appendLine(document.fileName);
      changes.forEach((c) => {
        // logger.appendLine("Range:  " + c.range.start.line);
        // logger.appendLine("Range:  " + c.range.start.character);
        // logger.appendLine("Range:  " + c.range.end.line);
        // logger.appendLine("Range:  " + c.range.end.character);
        // logger.appendLine("Length: " + c.rangeLength);
        // logger.appendLine("Offset: " + c.rangeOffset);
        // logger.appendLine("Text:   " + c.text);
      });
    }
  );

  context.subscriptions.push(docChangeDisposable);

  // TODO: unpack components inside 'un' code-fence
  // TODO:
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
        "current preview scripts: " +
          contentJson.contributes["markdown.previewScripts"].join(",")
      );

      contentJson.contributes["markdown.previewScripts"] = standardScriptPaths;

      logger.appendLine("Rewriting setting paths");
      // add all scripts from settings
      contentJson.contributes["markdown.previewScripts"] = [
        ...standardScriptPaths,
        ...getSettings().addedScripts.map((p) => {
          // paths must relate to extension root inside the extension
          // but relate to workspace root inside settings
          const relativePath = path.relative(
            absoluteExtensionPath,
            path.isAbsolute(p) ? p : path.join(workspacePath, p)
          );
          logger.appendLine("Rewriting " + p + " to " + relativePath);
          return relativePath;
        }),
      ];

      await fs.writeFile(
        path.join(absoluteExtensionPath, "package.json"),
        JSON.stringify(contentJson, undefined, 2)
      );

      // TODO: advice user to reload the window multiple times?
      vscode.window.showInformationMessage("Scripts successfully updated");
    }
  );

  vscode.commands.executeCommand(loadScriptsCommandName);
  context.subscriptions.push(loadScriptCommand);

  return {
    extendMarkdownIt(md: markdownit) {
      extendMarkdownItWithScripts(md, logger, {
        languageIds: () => {
          return [];
        },
      });
      return md;
    },
  };
}

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
