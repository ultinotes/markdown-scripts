export const blockName = "js-exec";

export const containerOpenTagType = "container_" + blockName + "_open";
export const containerCloseTagType = "container_" + blockName + "_close";

export const scriptPlugin = {
  anyClass: true,
  validate: (name: string) => {
    // const logger = vscode.window.log
    console.log("validating");

    return name.trim() === blockName;
  },
  render: (tokens: any[], i: number) => {
    const token = tokens[i];

    console.log(token);

    var src = "";
    // ! detects if a code block has been opened
    if (token.type === containerOpenTagType) {
      // ! as long as no closing tag is discovered
      for (var j = i + 1; j < tokens.length; j++) {
        const value = tokens[j];
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
};
