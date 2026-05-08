import * as vscode from 'vscode';

export function activate(context: vscode.ExtensionContext)
{
    context.subscriptions.push(
        vscode.commands.registerCommand('allman.enter', async () =>
        {
            const editor = vscode.window.activeTextEditor;
            if (!editor) return;

            const document = editor.document;
            const position = editor.selection.active;
            const line = document.lineAt(position.line).text;

            const before = line.substring(0, position.character);
            const after = line.substring(position.character);

            if (before.endsWith('{') && after.trimStart().startsWith('}'))
            {
                const indent = line.match(/^\s*/)?.[0] ?? '';

                const openBracePos = new vscode.Position(position.line, position.character - 1);

                const spacesBeforeClose = after.length - after.trimStart().length;
                const closeBracePos = new vscode.Position(position.line, position.character + spacesBeforeClose + 1);

                await editor.edit(editBuilder =>
                {
                    editBuilder.delete(new vscode.Range(openBracePos, closeBracePos));
                    editBuilder.insert(openBracePos, `\n${indent}{\n${indent}    \n${indent}}`);
                });

                const newPos = new vscode.Position(position.line + 2, indent.length + 4);
                editor.selection = new vscode.Selection(newPos, newPos);
                return;
            }

            // Enter normal
            await vscode.commands.executeCommand('default:type', { text: '\n' });
        })
    );
}

export function deactivate() {}