import * as vscode from "vscode";

export function getSettings() {
  // adjust namespace according to settings contribution in package.json
  const config = vscode.workspace.getConfiguration(
    "ultinotes-markdown-scripts"
  );
  return {
    addedScripts: config.get<string[]>("addedScripts") ?? [],
  };
}
