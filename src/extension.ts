import * as vscode from 'vscode';
import { gitInitialize } from "./commands/git-initialize";

let disposable: vscode.Disposable;

export function activate(context: vscode.ExtensionContext) {
	disposable = vscode.commands.registerCommand('git-initialize.initializeProject', gitInitialize);

	context.subscriptions.push(disposable);
}

export function deactivate() {
	if (disposable) {
		disposable.dispose();
	}
}