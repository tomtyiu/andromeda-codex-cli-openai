// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import { exec } from 'child_process';
import * as fs from 'fs/promises';
import * as os from 'os';
import * as path from 'path';
import { showDiffInEditor } from './diffUtil';

// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
    const editor = vscode.window.activeTextEditor;
    if (!editor) {
        vscode.window.showErrorMessage('No active editor found.');
        return;
    }
    console.log('Congratulations, your extension "andromeda-codex" is now active!');

    // Register the codex.prompt command
    const disposable = vscode.commands.registerCommand('codex.prompt', async () => {
        const prompt = await vscode.window.showInputBox({ prompt: 'Enter a prompt for Codex' });
        if (!prompt) {
            vscode.window.showWarningMessage('No prompt entered.');
            return;
        }
        const editor = vscode.window.activeTextEditor;
        if (!editor) {
            vscode.window.showErrorMessage('No active editor found.');
            return;
        }
        const filePath = editor.document.uri.fsPath;
        const original = editor.document.getText();

        // Write the original code to a temp file
        const tempDir = await fs.mkdtemp(path.join(os.tmpdir(), 'codex-prompt-'));
        const inputFile = path.join(tempDir, 'input.txt');
        await fs.writeFile(inputFile, original, 'utf8');

        // Run Codex CLI
        const escaped = prompt.replace(/"/g, '\\"');
        const terminal = vscode.window.createTerminal({ name: 'Codex' });
        terminal.show(true);
        terminal.sendText(`npx codex "${escaped} ${filePath}"`, true);
    });

    // Register the codex.model command
    const modelDisposable = vscode.commands.registerCommand('codex.model', async () => {
        const prompt = await vscode.window.showInputBox({ prompt: 'Enter a prompt for Codex (Model o4-mini)' });
        if (!prompt) {
            vscode.window.showWarningMessage('No prompt entered.');
            return;
        }
        const editor = vscode.window.activeTextEditor;
        if (!editor) {
            vscode.window.showErrorMessage('No active editor found.');
            return;
        }
        const filePath = editor.document.uri.fsPath;
        const terminal = vscode.window.createTerminal({ name: 'Codex Model' });
        terminal.show(true);
        const escaped = prompt.replace(/"/g, '\\"');
        // Use --model o4-mini and pass prompt and file path
        terminal.sendText(`npx codex --model o4-mini "${escaped}" "${filePath}"`, true);
    });

    // Register the codex.fixCode command (your original fix logic)
    const fixCodeDisposable = vscode.commands.registerCommand('codex.fixCode', async () => {
        const editor = vscode.window.activeTextEditor;
        if (!editor) {
            vscode.window.showErrorMessage('No active editor found.');
            return;
        }
        const selection = editor.selection;
        if (selection.isEmpty) {
            vscode.window.showWarningMessage('No code selected.');
            return;
        }
        const original = editor.document.getText(selection);

        // Get the fixed code using Codex CLI (debug step)
        let modified: string;
        try {
            modified = await getCodexFix(original);
        } catch (error: any) {
            vscode.window.showErrorMessage(`Codex CLI error: ${error.message}`);
            return;
        }

        // Show the diff between original and fixed code
        await showDiffInEditor(original, modified, 'Codex Fix Diff');

        // Write the selected code to a temp file for terminal use
        const tempDir = await fs.mkdtemp(path.join(os.tmpdir(), 'codex-term-'));
        const inputFile = path.join(tempDir, 'input.txt');
        await fs.writeFile(inputFile, original, 'utf8');

        const terminal = vscode.window.createTerminal({ name: 'Codex Fix' });
        terminal.show(true);
        // Now pass only the file path, not the code itself
        terminal.sendText(`npx codex fix "${inputFile}"`, true);
    });

    context.subscriptions.push(disposable, modelDisposable, fixCodeDisposable);

    context.subscriptions.push(
        vscode.commands.registerCommand('codex.fixCode', async () => {
            const editor = vscode.window.activeTextEditor;
            if (!editor) {
                vscode.window.showErrorMessage('No active editor');
                return;
            }

            const selection = editor.selection;
            const original = editor.document.getText(selection);

            // Call your Codex API/fix logic here:
            // Replace this with your actual Codex call
            const modified = await getCodexFix(original);

            // Show the diff
            await showDiffInEditor(original, modified, 'Codex Fix Diff');
        })
    );
}

// Dummy function for demonstration; replace with your real Codex call
async function getCodexFix(original: string): Promise<string> {
    // Write the original code to a temp file
    const tempDir = await fs.mkdtemp(path.join(os.tmpdir(), 'codex-'));
    const inputFile = path.join(tempDir, 'input.txt');
    await fs.writeFile(inputFile, original, 'utf8');

    // Run the Codex CLI and capture its output directly
    const command = `npx codex fix "${inputFile}"`;
    const fixed = await new Promise<string>((resolve, reject) => {
        exec(command, (error, stdout) => {
            if (error) {
                reject(error);
            } else {
                resolve(stdout);
            }
        });
    });
    return fixed;
}

// This method is called when your extension is deactivated
export function deactivate() {}

// Install vsce globally
// npm install -g vsce