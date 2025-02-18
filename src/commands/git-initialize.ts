import { extensions, window, commands, workspace } from "vscode";
import simpleGit from "simple-git";
import { addOriginUrl } from "../tools/gitAddOrigin";
import { waitForGitignoreFile } from "../tools/gitIgnoreAwait";

const gitInitialize = async () => {
  const requiredExtensions = [
    'piotrpalarz.vscode-gitignore-generator',
    'evilnick2.evilnick2-readme-generator',
    'ultram4rine.vscode-choosealicense'
  ];
  const missingExtensions = requiredExtensions.filter(ext => !extensions.getExtension(ext));

  if (missingExtensions.length > 0) {
    window.showErrorMessage(`The following extensions are required: ${missingExtensions.join(', ')}`);
    return;
  }

  await commands.executeCommand('extension.gitignoreGenerate');
  await commands.executeCommand('readme-generator.generateREADME');
  await commands.executeCommand('license.addDefaultLicense');

  await waitForGitignoreFile();

  const workspaceFolders = workspace.workspaceFolders;
  if (workspaceFolders) {
    const git = simpleGit(workspaceFolders[0].uri.fsPath);
    const isRepo = await git.checkIsRepo();
    if (!isRepo) {
      await git.init();
      await git.branch(['-M', 'main']);
			const autoAddOrigin = workspace.getConfiguration('gitInitialize').get<boolean>('autoAddOrigin', true);
			if (autoAddOrigin) {
				await addOriginUrl();
			}
    }
  }
};

export { gitInitialize };
