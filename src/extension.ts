// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import * as fs from 'fs/promises';
import * as path from 'path';
import * as os from 'os';

export function activate(context: vscode.ExtensionContext) {
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

    // Fix Selected Code
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

        const tempDir = await fs.mkdtemp(path.join(os.tmpdir(), 'codex-term-'));
        const inputFile = path.join(tempDir, 'input.txt');
        await fs.writeFile(inputFile, original, 'utf8');

        const terminal = vscode.window.createTerminal({ name: 'Codex Fix' });
        terminal.show(true);
        terminal.sendText(`npx codex "fix ${inputFile}"`, true);
    });

    // Edit Selected Code
    const editCodeDisposable = vscode.commands.registerCommand('codex.editCode', async () => {
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
        const filePath = editor.document.uri.fsPath;
        const tempDir = await fs.mkdtemp(path.join(os.tmpdir(), 'codex-term-'));
        const inputFile = path.join(tempDir, 'input.txt');
        await fs.writeFile(inputFile, original, 'utf8');

        const terminal = vscode.window.createTerminal({ name: 'Codex Edit' });
        terminal.show(true);
        terminal.sendText(`npx codex "edit ${inputFile} in file ${filePath}"`, true);
    });

    // Find Unit Test for Selected Code
    const findUnitTestDisposable = vscode.commands.registerCommand('codex.findUnitTest', async () => {
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

        const filePath = editor.document.uri.fsPath;

        const tempDir = await fs.mkdtemp(path.join(os.tmpdir(), 'codex-term-'));
        const inputFile = path.join(tempDir, 'input.txt');
        await fs.writeFile(inputFile, original, 'utf8');

        const terminal = vscode.window.createTerminal({ name: 'Codex Create Unit Test' });
        terminal.show(true);
        terminal.sendText(`npx codex "create unit test ${filePath}"`, true);
    });

    context.subscriptions.push(
        disposable,
        modelDisposable,
        fixCodeDisposable,
        editCodeDisposable,
        findUnitTestDisposable
    );
}

export function deactivate() {}