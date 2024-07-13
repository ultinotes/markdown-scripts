# UltiNotes
Make your VSCodes's Markdown interactive by embedding JS and Web Components.

## How does it work?

Visual Studio Code doesn't allow script inclusions by default. Scripts can only be added as static contributions by an extension.
With the [April 2024 Update](https://code.visualstudio.com/updates/v1_89#_local-workspace-extensions) extensions can be installed locally into a workspace, so this extension provides a framework for users to add custom components to the Markdown Preview statically.


- clone git repo into ./.vscode/extensions


## Roadmap
- integrate with gun.js
- add a UI to the extension to link folders with compiled components
- central import script
- obsidian plugin
- maybe remark/rehype plugin
- real time data sync
- backup profiles to the cloud
- autocomplete in markdown editor
- static render to image or html --> publish static markdown to services like GitHub
- support for lit, react, svelte, solid
- official repository of components

## Development
```
nvm use
npm run watch
```

## Features

Describe specific features of your extension including screenshots of your extension in action. Image paths are relative to this README file.

For example if there is an image subfolder under your extension project workspace:

\!\[feature X\]\(images/feature-x.png\)

> Tip: Many popular extensions utilize animations. This is an excellent way to show off your extension! We recommend short, focused animations that are easy to follow.

## Requirements

If you have any requirements or dependencies, add a section describing those and how to install and configure them.

## Extension Settings

Include if your extension adds any VS Code settings through the `contributes.configuration` extension point.

For example:

This extension contributes the following settings:

* `myExtension.enable`: Enable/disable this extension.
* `myExtension.thing`: Set to `blah` to do something.

## Known Issues

Calling out known issues can help limit users opening duplicate issues against your extension.

## Release Notes

Users appreciate release notes as you update your extension.

### 1.0.0

Initial release of ...

### 1.0.1

Fixed issue #.

### 1.1.0

Added features X, Y, and Z.

---

## Following extension guidelines

Ensure that you've read through the extensions guidelines and follow the best practices for creating your extension.

* [Extension Guidelines](https://code.visualstudio.com/api/references/extension-guidelines)

## Working with Markdown

You can author your README using Visual Studio Code. Here are some useful editor keyboard shortcuts:

* Split the editor (`Cmd+\` on macOS or `Ctrl+\` on Windows and Linux).
* Toggle preview (`Shift+Cmd+V` on macOS or `Shift+Ctrl+V` on Windows and Linux).
* Press `Ctrl+Space` (Windows, Linux, macOS) to see a list of Markdown snippets.

## For more information

* [Visual Studio Code's Markdown Support](http://code.visualstudio.com/docs/languages/markdown)
* [Markdown Syntax Reference](https://help.github.com/articles/markdown-basics/)

**Enjoy!**
