import * as vscode from 'vscode';

let isEnabled = true;
let statusBarItem: vscode.StatusBarItem;

function updateStatusBar()
{
    statusBarItem.text = isEnabled ? '$(check) Allman ON' : '$(x) Allman OFF';
    statusBarItem.tooltip = 'Click to toggle Allman Braces';
    statusBarItem.backgroundColor = isEnabled
        ? undefined
        : new vscode.ThemeColor('statusBarItem.warningBackground');
}

export function activate(context: vscode.ExtensionContext)
{

    statusBarItem = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Right, 100);
    statusBarItem.command = 'allman.toggle';
    statusBarItem.show();
    updateStatusBar();
    context.subscriptions.push(statusBarItem);


    context.subscriptions.push(
        vscode.commands.registerCommand('allman.toggle', () =>
        {
            isEnabled = !isEnabled;
            updateStatusBar();
            vscode.window.setStatusBarMessage(
                isEnabled ? 'Allman Braces enabled' : 'Allman Braces disabled',
                2000
            );
        })
    );

    context.subscriptions.push(
        vscode.commands.registerCommand('allman.enter', async () =>
        {
            if (!isEnabled)
            {
                 const editor = vscode.window.activeTextEditor;
                if (!editor) return;
                await editor.edit(editBuilder =>
                {
                    editBuilder.insert(editor.selection.active, '\n');
                });
                return;
            }

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

            const editor2 = vscode.window.activeTextEditor;
            if (!editor2) return;
            await editor2.edit(editBuilder =>
            {
                editBuilder.insert(editor2.selection.active, '\n');
            });
        })
    );
}

export function deactivate() {}