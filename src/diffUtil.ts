import * as vscode from 'vscode';

const scheme = 'codex-diff';

class DiffContentProvider implements vscode.TextDocumentContentProvider {
  private contents = new Map<string, string>();
  setContent(uri: vscode.Uri, content: string) {
    this.contents.set(uri.toString(), content);
  }
  provideTextDocumentContent(uri: vscode.Uri): string | undefined {
    return this.contents.get(uri.toString());
  }
}

const provider = new DiffContentProvider();
vscode.workspace.registerTextDocumentContentProvider(scheme, provider);

export async function showDiffInEditor(
  original: string,
  modified: string,
  title = 'Codex Diff'
) {
  const originalUri = vscode.Uri.parse(`${scheme}://original`);
  const modifiedUri = vscode.Uri.parse(`${scheme}://modified`);

  provider.setContent(originalUri, original);
  provider.setContent(modifiedUri, modified);

  await vscode.commands.executeCommand(
    'vscode.diff',
    originalUri,
    modifiedUri,
    title
  );
}