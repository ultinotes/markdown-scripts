// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from "vscode";
import * as mdItContainer from "markdown-it-container";

const logger = vscode.window.createOutputChannel("test-log", { log: true });

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

  // register Markdown It plugin
  return {
    extendMarkdownIt(md: markdownit) {
      extendMarkdownItWithScripts(md, logger, {
        languageIds: () => {
          return vscode.workspace
            .getConfiguration("markdown-scripts") // ! keep in sync with name from package.json > configuration
            .get<string[]>("languages", ["js-exec"]);
        },
      });
      return md;
    },
  };
}

// This method is called when your extension is deactivated
export function deactivate() {}

const blockName = "js-exec";

function extendMarkdownItWithScripts(
  md: markdownit,
  logger: vscode.LogOutputChannel,
  config: { languageIds(): readonly string[] }
) {
  const containerOpenTagType = "container_" + blockName + "_open";
  const containerCloseTagType = "container_" + blockName + "_close";

  md.use(mdItContainer.default, blockName, {
    anyClass: true,
    validate: (name: string) => {
      // const logger = vscode.window.log
      logger.appendLine("Validating name: "+ name);
      vscode.window.showInformationMessage("Testing Debug "+logger);

      console.log("validating");

      return name.trim() === blockName;
    },
    render: (tokens: any[], i: number) => {
      const token = tokens[i];

      var src = "";
      // ! detects if a code block has been opened
      if (token.type === containerOpenTagType) {
        // ! as long as no closing tag is discovered
        for (var j = i + 1; j < tokens.length; j++) {
          const value = tokens[j];
          logger.appendLine(value);
          if (value === undefined || value.type === containerCloseTagType) {
            break;
          }
        }
      }

      if (token.nesting === 1) {
        return `<div class="${blockName}">${src}`;
      } else {
        return "</div>";
      }
    },
  });

  return md;
}