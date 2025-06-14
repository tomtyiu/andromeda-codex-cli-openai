# Andromeda Codex VS Code Extension

OpenAI's Codex CLI integration for VS Code.

## Features

- **Codex: Run Prompt**  
  Run a custom prompt on the current file using Codex CLI.

- **Codex: Model o4-mini**  
  Run a custom prompt using the `o4-mini` model.

- **Codex: Fix Selected Code**  
  Select code, right-click, and choose "Fix Selected Code" to run `codex fix` on your selection in a terminal.

- **Codex: Edit Selected Code**  
  Select code, right-click, and choose "Edit Selected Code" to run `codex edit` on your selection in a terminal.

- **Codex: Generate Unit Test for Codebase**  
  Select code, right-click, and choose "Generate Unit Test for codebase" to run `codex generate unit test` on codebase.

## Usage

1. Select code in the editor.
2. Right-click and choose the desired Codex command from the context menu, or use the Command Palette (`Ctrl+Shift+P`).
3. The extension will write your selection to a temporary file and run the appropriate Codex CLI command in a new terminal.

## Requirements

- [Node.js](https://nodejs.org/)
- [Codex CLI](https://github.com/openai/openai-codex-cli) (installed via `npx`)

## Changelog

See [CHANGELOG.md](./CHANGELOG.md) for details.

---
