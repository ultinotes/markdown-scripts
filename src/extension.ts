// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from "vscode";
import * as mdItContainer from "markdown-it-container";
import { blockName, scriptPlugin } from "./markdown-it/scriptPlugin";

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

  // vscode.workspace.onDidChangeTextDocument((event) => {
  //   if (event.document.languageId === "markdown") {
  //     logger.appendLine("markdown editor found");
  //     logger.appendLine("=====================");
  //     logger.show(true);
  //     const webviewPanel = getMarkdownPreviewWebview(event.document.uri);
  //     logger.appendLine(webviewPanel);
  //     logger.show(true);
  //     if (webviewPanel) {
  //       nonce = webviewPanel.webview.cspSource;
  //     }
  //   }
  // });

  // // Function to check if the active editor is a Markdown preview
  // function checkForMarkdownPreview() {
  //   const activeEditor = vscode.window.activeTextEditor;
  //   const visibleEditors = vscode.window.visibleTextEditors;

  //   visibleEditors.forEach((editor) => {
  //     outputChannel.appendLine("Checking Editor");
  //     outputChannel.appendLine(editor.document.uri.scheme);
  //     if (editor.document.uri.scheme === "vscode-webview") {
  //       const webviewPanel = vscode.window.createWebviewPanel(
  //         "markdownPreview",
  //         "Markdown Preview",
  //         vscode.ViewColumn.Beside,
  //         {
  //           enableScripts: true,
  //         }
  //       );
  //       if (webviewPanel) {
  //         const nonce = webviewPanel.webview.cspSource;
  //         outputChannel.appendLine(
  //           `Markdown preview opened with nonce: ${nonce}`
  //         );
  //       }
  //     }
  //   });
  // }

  // // Listen to changes in the active text editor
  // vscode.window.onDidChangeActiveTextEditor(
  //   checkForMarkdownPreview,
  //   null,
  //   context.subscriptions
  // );

  // // Listen to visible text editors changing
  // vscode.window.onDidChangeVisibleTextEditors(
  //   checkForMarkdownPreview,
  //   null,
  //   context.subscriptions
  // );

  // // Initial check for when the extension activates
  // checkForMarkdownPreview();

  outputChannel.appendLine("Markdown Preview Detector activated");

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
