# UltiNotes

Make your VSCodes's Markdown interactive by embedding JS and Web Components.

Visual Studio Code doesn't allow script inclusions by default. Scripts can only be added as static contributions by an extension.

With the [April 2024 Update](https://code.visualstudio.com/updates/v1_89#_local-workspace-extensions) extensions can be installed locally into a workspace, so this extension provides a framework for users to add custom components to the Markdown Preview statically.

You can read about the journey on [my blog](https://kiesthardt.com/blog/hacking-vscode-csp/).

## Setup

To setup the extension just download the plugin or clone this repo into `./.vscode/extensions/`.

## Features

- provides the necessary loader to load web components into the markdown preview
- provides a mechanism to contribute new web components to the markdown preview
- provides a global instance of gunjs so component authors can sync data

## Extension Settings

### Requirements

Please note that VSCode's Markdown Preview doesn't support module loading. If you want to load Custom Web Components, please make sure that you bundle your components in a way that makes them loadable as a standard script tag.

For example, if you use Lit to build your components, you can set your Rollup config to output an Instantly Invoked Function Expression (IIFE):

```js
//...
export default {
  input: 'src/index.ts',
  output: {
    file: 'out/bundle.js',
    format: 'iife',
//...
```
Also export your components globally via the window object.
The extension comes with the necessary web component loader to load the components from there.

### Adding your scripts via settings

The extension already loads its own scripts, but you must specify the paths for your own.
You can provide additional scripts to the markdown preview by adding absolute paths to the JS files to your VSCode settings, like so:

```json
//...
"ultinotes-markdown-scripts.addedScripts": [
  "/home/yourUser/Documents/Notes/components/out/bundle.js"
],
//...
```


## Roadmap

- add a UI and other guard rails to the extension to link folders with compiled components
- Obsidian plugin

## Development

```
nvm use
# compile extension files to js
npm run watch
# compile built-in components
npm run watch-scripts
```

## Sponsorship

This extension comes free of charge and is truely open-source, as it is licensed under BSD License. Read more details in [the license file](./LICENSE)

It is the foundation of Ultinotes, so if you want to support my work, head over to the associated components repo and sponsor me there. Your support there will also benefit this repository.

