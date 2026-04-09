import * as vscode from 'vscode';
import * as fs from 'fs';
import { scriptParser } from './script-parser.js';

export function activate(context) {
    // Comando para exportar manualmente
    let disposable = vscode.commands.registerCommand('sakura-script.exportJSON', async () => {
        // Obtener el texto 
        const editor = vscode.window.activeTextEditor;
        if (!editor) {
            vscode.window.showErrorMessage('❌ No hay ningún archivo abierto');
            return;
        }

        try{
            // Obtener texto
            const get_text = editor.document.getText();
            
            const result_json = scriptParser(get_text);
            console.log(result_json);

            /// Opciones del diálogo Guardar como
            const defaultUri = editor.document.uri.fsPath.endsWith('.sksy')
                ? vscode.Uri.file(editor.document.uri.fsPath.replace('.sksy', '.json'))
                : vscode.Uri.file(editor.document.uri.fsPath + '.json');

            // Abrir la pantalla de guardado
            const fileUri = await vscode.window.showSaveDialog({
                defaultUri,
                saveLabel: 'Export JSON',
                filters: {
                    'Archivos JSON': ['json']
                }
            });

            if (!fileUri) return; // Se cancelo

            // Guardar el archivo en donde el usuario escogio
            fs.writeFileSync(fileUri.fsPath, result_json, 'utf8');
            vscode.window.showInformationMessage(`✅ JSON saved: ${fileUri.fsPath}`);
        }
        catch(error) {
            console.error(error);
            vscode.window.showErrorMessage(`❌ Export error: ${error.message}`);
        }
    });

    context.subscriptions.push(disposable);
}

export function deactivate() {}