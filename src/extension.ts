import * as vscode from 'vscode';
import simpleGit from 'simple-git';

export function activate(context: vscode.ExtensionContext) {
	let disposable = vscode.commands.registerCommand('git-initialize.initializeProject', async () => {
		// Check for required extensions
		const requiredExtensions = ['piotrpalarz.vscode-gitignore-generator', 'evilnick2.evilnick2-readme-generator', 'ultram4rine.vscode-choosealicense'];
		const missingExtensions = requiredExtensions.filter(ext => !vscode.extensions.getExtension(ext));

		if (missingExtensions.length > 0) {
			vscode.window.showErrorMessage(`The following extensions are required: ${missingExtensions.join(', ')}`);
			return; // Stop execution if there are missing extensions
		}

		// Execute commands from other extensions
		await vscode.commands.executeCommand('extension.gitignoreGenerate');
		await vscode.commands.executeCommand('readme-generator.generateREADME');
		await vscode.commands.executeCommand('license.addDefaultLicense');

		// Initialize Git repository
		const workspaceFolders = vscode.workspace.workspaceFolders;
		if (workspaceFolders) {
			const git = simpleGit(workspaceFolders[0].uri.fsPath);
			const isRepo = await git.checkIsRepo();
			if (!isRepo) {
				await git.init();
				await git.branch(['-M', 'main']);
				vscode.window.showInformationMessage('Project initialized with .gitignore, README.md, LICENSE, and a Git repository.');
			}
		}
	});

	context.subscriptions.push(disposable);
}

export function deactivate() {}