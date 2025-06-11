import * as vscode from 'vscode';
import * as fs from 'fs';
import * as path from 'path';

function getCommands(extensionPath: string): string[] {
  try {
    const pkgJsonPath = path.join(extensionPath, 'package.json');
    const pkg = JSON.parse(fs.readFileSync(pkgJsonPath, 'utf8'));
    return Array.isArray(pkg.codexCommands) ? pkg.codexCommands : [];
  } catch {
    return [];
  }
}

export function activate(context: vscode.ExtensionContext) {
  // Use context.extensionPath for compatibility
  const extensionPath = context.extensionPath;
  const commands = getCommands(extensionPath);
  console.log('Loaded codexCommands:', commands);
  const disposable = vscode.commands.registerCommand('codex.prompt', async () => {
    const items: vscode.QuickPickItem[] = commands.map((c) => ({ label: c }));
    items.push({ label: 'Custom prompt...' });

    const selection = await vscode.window.showQuickPick(items, {
      placeHolder: 'Select a command or enter a custom prompt',
    });

    if (!selection) {
      return;
    }

    let prompt: string | undefined;
    if (selection.label === 'Custom prompt...') {
      prompt = await vscode.window.showInputBox({
        prompt: 'Enter a prompt for Codex',
      });
    } else {
      prompt = selection.label;
    }

    if (!prompt) {
      return;
    }

    // Run the Codex CLI in the integrated terminal with the selected or entered prompt
    const terminal = vscode.window.createTerminal({ name: 'Codex' });
    terminal.show(true);
    const escaped = prompt.replace(/"/g, '\\"');
    terminal.sendText(`npx codex prompt "${escaped}"`);
  });

  context.subscriptions.push(disposable);
}

export function deactivate() {}
