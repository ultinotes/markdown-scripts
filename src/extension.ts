// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from "vscode";
import * as mdItContainer from "markdown-it-container";
import { blockName, scriptPlugin } from "./markdown-it/scriptPlugin";

// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
  // Use the console to output diagnostic information (console.log) and errors (console.error)
  // This line of code will only be executed once when your extension is activated
  console.log(
    'Congratulations, your extension "markdown-scripts" is now active!'
  );

  const logger = vscode.window.createOutputChannel("test-log", { log: true });

  logger.clear();
  logger.appendLine("Congrats");
  logger.show(true);
  logger.appendLine("Hello World");

  // The command has been defined in the package.json file
  // Now provide the implementation of the command with registerCommand
  // The commandId parameter must match the command field in package.json
  let disposable = vscode.commands.registerCommand(
    "markdown-scripts.helloWorld",
    () => {
      vscode.window.showInformationMessage(
        "Hello World from Markdown Scripts!"
      );
    }
  );

  context.subscriptions.push(disposable);

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
