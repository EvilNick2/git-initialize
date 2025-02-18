import { workspace, RelativePattern, Uri } from "vscode";
import * as path from "path";
import * as fs from "fs";

export function waitForGitignoreFile(): Promise<void> {
	return new Promise((resolve) => {
		if (!workspace.workspaceFolders || workspace.workspaceFolders.length === 0) {
			resolve();
			return;
		}
		
		const workspaceFolder = workspace.workspaceFolders[0];
		const gitignorePath = path.join(workspaceFolder.uri.fsPath, ".gitignore");
		
		if (fs.existsSync(gitignorePath)) {
			resolve();
			return;
		}
		
		const watcher = workspace.createFileSystemWatcher(
			new RelativePattern(workspaceFolder, ".gitignore")
		);
		
		const onFileChange = (uri: Uri) => {
			if (uri.fsPath === gitignorePath) {
				watcher.dispose();
				resolve();
			}
		};

		watcher.onDidCreate(onFileChange);
		watcher.onDidChange(onFileChange);
	});
}