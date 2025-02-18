import { workspace, window, ConfigurationTarget } from 'vscode';
import simpleGit from "simple-git";

export async function addOriginUrl() {
	const githubUsername = workspace.getConfiguration('readme.generator.settings').get<string>('github');

	if (!githubUsername) {
		window.showErrorMessage('GitHub username not found in settings');
		return;
	}

	const workspaceFolders = workspace.workspaceFolders;
	const workspaceName = workspaceFolders ? workspaceFolders[0].name : 'repository';
	const defaultOriginUrl = `https://github.com/${githubUsername}/${workspaceName}.git`;

	const originUrl = await window.showInputBox({
		prompt: 'Enter the origin URL',
		placeHolder: defaultOriginUrl,
		value: defaultOriginUrl
	});

	if (originUrl && workspaceFolders) {
		const git = simpleGit(workspaceFolders[0].uri.fsPath);
		await git.addRemote('origin', originUrl);
		window.showInformationMessage(`Origin URL set to: ${originUrl}`);
	} else {
		const turnOffAutoAddOrigin = await window.showQuickPick(['Yes', 'No'], {
			placeHolder: 'No origin URL provided. Do you want to turn off autoAddOrigin?'
		});

		if (turnOffAutoAddOrigin === 'Yes') {
			await workspace.getConfiguration('gitInitialize').update('autoAddOrigin', false, ConfigurationTarget.Global);
			window.showInformationMessage('autoAddOrigin has been turned off.');
		} else {
			window.showErrorMessage('No origin URL provided');
		}
	}
}