import MarkdownIt from "markdown-it";
import * as vscode from "vscode";

export const blockName = "mdscript";

export const containerOpenTagType = "container_" + blockName + "_open";
export const containerCloseTagType = "container_" + blockName + "_close";

export const scriptPlugin = (
  md: markdownit,
  outputChannel: vscode.OutputChannel
) => {
  function customFence(
    state: any,
    startLine: number,
    endLine: number,
    silent: boolean
  ): boolean {
    const validationMode = silent;

    outputChannel.appendLine("Hello from Plugin");
    // outputChannel.appendLine(state);
    outputChannel.appendLine(startLine.toString());
    outputChannel.appendLine(endLine.toString());
    outputChannel.appendLine(silent ? "true" : "false");

    // const marker = "```";
    // let pos = state.bMarks[startLine] + state.tShift[startLine];
    // let max = state.eMarks[startLine];

    // // Check for three backticks at the start of the line
    // if (state.src.slice(pos, pos + marker.length) !== marker) {
    //   return false;
    // }

    // // Get the fence markup and the parameters
    // let markup = state.src.slice(pos, pos + 3);
    // let params = state.src.slice(pos + 3, max).trim();

    // outputChannel.appendLine(params);

    // Check if the block starts with `script`
    // if (!params.startsWith(blockName)) {
    //   outputChannel.appendLine("Not an executable script block");
    //   outputChannel.show(true);

    //   return false;
    // }

    // outputChannel.appendLine("Executable Script Block");
    // outputChannel.appendLine(state.push);
    // outputChannel.appendLine(state.getLines);

    outputChannel.show(true);

    if (validationMode) {
      outputChannel.appendLine("Validation Mode");
      outputChannel.show(true);

      return true; // Silent mode (validation mode), no token creation
    }

    let nextLine = startLine;
    let haveEndMarker = false;

    // TODO: instead of going through state.src, just traverse the token stream
    // https://github.com/valeriangalliat/markdown-it-anchor/blob/master/index.js
    // TODO add none as attr to token

    // Search for the end marker
    // while (nextLine < endLine) {
    //   nextLine++;
    //   pos = state.bMarks[nextLine] + state.tShift[nextLine];
    //   max = state.eMarks[nextLine];

    //   if (pos < max && state.sCount[nextLine] < state.blkIndent) {
    //     continue;
    //   }

    //   if (state.src.slice(pos, pos + marker.length) !== marker) {
    //     continue;
    //   }

    //   pos += marker.length;

    //   if (state.src.slice(pos, max).trim().length === 0) {
    //     outputChannel.appendLine("End marker detected");
    //     outputChannel.show(true);
    //     haveEndMarker = true;
    //     break;
    //   }
    // }

    let tokens: any[] = state.tokens;
    outputChannel.appendLine(`found ${tokens.length} tokens`);
    outputChannel.show(true);

    for (let idx = 0; idx < tokens.length; idx++) {
      const token = tokens[idx] as MarkdownIt.Token;
      const isMdScript = token.type === "fence" && token.info === blockName;

      if (isMdScript) {
        outputChannel.appendLine("Script discovered in token stream");
        outputChannel.appendLine(token);
        outputChannel.appendLine(state.env);
        outputChannel.show(true);
        const executableScript = state.push(blockName, "", 0);
        executableScript.content = token.content;

        // remove current token
        tokens = tokens.splice(idx, 1);
      } else {
        outputChannel.appendLine(`Not a script: ${token.type} ${token.info}`);
        outputChannel.show(true);
      }
    }

    if (!haveEndMarker) {
      outputChannel.appendLine("No end marker");
      outputChannel.show(true);
      return false;
    }

    // state.line = nextLine + 1;

    // const token = state.push("fence", blockName, 0);
    // token.content = state.getLines(
    //   startLine + 1,
    //   nextLine,
    //   state.tShift[startLine],
    //   true
    // );
    // token.markup = "";
    // token.map = [startLine, state.line];

    outputChannel.show(true);
    return true;
  }

  md.block.ruler.before("fence", "custom_fence", customFence);

  md.renderer.rules[blockName] = function (
    tokens: MarkdownIt.Token[],
    idx: number,
    options: any,
    env: any,
    self: any
  ): string {
    const token = tokens[idx];
    return `<div class="mdscripts-src" style="opacity: 0.25">${md.utils.escapeHtml(token.content)}</div>`;
    return `<script nonce="abcdefg">${md.utils.escapeHtml(
      'console.log('+env.nonce+');'
    )}</script>`;
    return `<script>${md.utils.escapeHtml(token.content)}</script>`;
  };
};

function isOpening(token: MarkdownIt.Token) {
  return token.nesting === 1;
}

function isClosing(token: MarkdownIt.Token) {
  return token.nesting === -1;
}
