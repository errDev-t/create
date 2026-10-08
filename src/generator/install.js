import path from 'node:path';
import { readFile } from 'node:fs/promises';
import { spawn } from 'node:child_process';
import { listFiles } from '@/utils/files.js';
export async function findPackageRoots(projectDirectory) {
    const files = (await listFiles(projectDirectory))
        .filter(file => path.posix.basename(file) === 'package.json')
        .sort();
    return Promise.all(files.map(async (file) => {
        const packageJson = JSON.parse(await readFile(path.join(projectDirectory, file), 'utf8'));
        return {
            directory: path.posix.dirname(file),
            hasBuildScript: Boolean(packageJson.scripts?.build),
        };
    }));
}
function runNpmInstall(cwd) {
    return new Promise((resolve, reject) => {
        let output = '';
        const child = spawn('npm', ['install'], {
            cwd,
            shell: process.platform === 'win32',
            stdio: ['ignore', 'pipe', 'pipe'],
        });
        const collect = (chunk) => {
            output = (output + chunk.toString()).slice(-2000);
        };
        child.stdout.on('data', collect);
        child.stderr.on('data', collect);
        child.on('error', error => reject(error));
        child.on('close', code => {
            if (code === 0)
                resolve();
            else
                reject(new Error(output.trim() || `npm exited with code ${code}`));
        });
    });
}
export async function installDependencies(projectDirectory, roots, onProgress = () => { }) {
    const failures = [];
    for (const root of roots) {
        onProgress(root);
        try {
            await runNpmInstall(path.join(projectDirectory, root.directory));
        }
        catch (error) {
            failures.push({
                directory: root.directory,
                message: error instanceof Error ? error.message : String(error),
            });
        }
    }
    return failures;
}
