import MarkdownIt from "markdown-it";
import * as vscode from "vscode";

export const blockName = "un";

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
    let pos = state.bMarks[startLine] + state.tShift[startLine];
    const max = state.eMarks[startLine];

    // Check if it's a fence (i.e., a code block)
    if (state.src.charCodeAt(pos) !== 0x60 /* ` */) {
      return false;
    }

    // Get the fence's marker length and validate it's a valid fence
    let marker = state.src.charCodeAt(pos);
    let mem = pos;
    let len = 0;

    while (pos < max && state.src.charCodeAt(pos) === marker) {
      pos++;
      len++;
    }

    if (len < 3) {
      // A fence must be at least 3 backticks/markers long
      return false;
    }

    const markup = state.src.slice(mem, pos);
    const params = state.src.slice(pos, max).trim();

    // Check if the language is "un"
    if (params !== "un") {
      return false;
    }

    // If silent, we are only verifying the rule, not rendering
    if (silent) {
      return true;
    }

    // Find where the fence block ends
    let nextLine = startLine;
    while (nextLine < endLine) {
      nextLine++;
      let posNext = state.bMarks[nextLine] + state.tShift[nextLine];
      const maxNext = state.eMarks[nextLine];

      if (state.src.charCodeAt(posNext) === marker) {
        let memNext = posNext;
        let lenNext = 0;

        while (posNext < maxNext && state.src.charCodeAt(posNext) === marker) {
          posNext++;
          lenNext++;
        }

        if (lenNext >= len && posNext === maxNext) {
          nextLine++;
          break;
        }
      }
    }

    // Create a new "un_block" token to replace the fence
    const token = state.push(blockName, "", 0);
    token.block = true;
    token.info = params; // Save the language info (which should be 'un')
    token.content = state.getLines(
      startLine + 1,
      nextLine - 1,
      state.tShift[startLine],
      true
    );
    token.map = [startLine, nextLine];
    token.markup = markup;

    // Update state to skip the lines we've already processed
    state.line = nextLine;

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
    return token.content;
  };
};

function isOpening(token: MarkdownIt.Token) {
  return token.nesting === 1;
}

function isClosing(token: MarkdownIt.Token) {
  return token.nesting === -1;
}
