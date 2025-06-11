# Andromeda Codex

Andromeda Codex is a Visual Studio Code extension that allows you to send prompts to the OpenAI's Codex CLI and automatically edit the currently open file based on your instructions.
This is expansion of the OpenAI's Codex CLI.

## Features

- Send a prompt to Codex directly from VS Code.
- Automatically edits the active file in the editor using Codex CLI.
- Fix selected code in the editor using Codex CLI.
- Simple command palette integration.

## Requirements

- [Node.js](https://nodejs.org/) installed.
- [Codex CLI](https://www.npmjs.com/package/codex) installed (the extension uses `npx codex`).   In terminal, please npm install -g @openai/codex
- Internet connection (if Codex CLI requires it).
- OpenAI API key (if you want to use the Codex CLI with your own API key).

## Extension Settings

This extension does not contribute any settings currently.

## Usage

1. Open a file you want to edit.
2. Open the Command Palette (`Ctrl+Shift+P` or `Cmd+Shift+P`).
3. Run `Codex: Prompt`.
4. Enter your prompt and press Enter.
5. The Codex CLI will process your prompt and edit the file.

## Fixing Selected Code

1. Select the code you want to fix in the editor.
2. Run `Codex: Fix Selected Code` from the Command Palette (`Ctrl+Shift+P`) or the editor context menu.
3. The Codex CLI will process the selected code and update it in the editor.

## Known Issues

- The extension requires an active editor with a saved file.
- Codex CLI must be installed and accessible via `npx`.

## Release Notes
0.0.4: added model in codex command in vscode
0.0.6: added fix selected code in vscode and model o4-mini mode


---

## Extension Guidelines

- [Extension Guidelines](https://code.visualstudio.com/api/references/extension-guidelines)

## For More Information

- [Visual Studio Code API](https://code.visualstudio.com/api)
- [Publishing Extensions](https://code.visualstudio.com/api/working-with-extensions/publishing-extension)
- [Markdown Syntax Reference](https://help.github.com/articles/markdown-basics/)
- [OpenAI's Codex CLI Reference Guide](https://github.com/openai/codex/tree/main)s

**Enjoy using Andromeda Codex!**
