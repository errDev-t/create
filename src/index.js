#!/usr/bin/env node
import path from 'node:path';
import { cancel, confirm, intro, isCancel, log, note, outro, spinner } from '@clack/prompts';
import { promptProject } from './prompts/projects.js';
import { generateProject } from './generator/index.js';
import { findPackageRoots, installDependencies, } from './generator/install.js';
const labels = {
    lua: 'Lua',
    javascript: 'JavaScript',
    typescript: 'TypeScript',
    standalone: 'Standalone',
    qbcore: 'QBCore',
    qbox: 'Qbox',
    esx: 'ESX',
    vrp: 'vRP',
    vanilla: 'Vanilla',
    react: 'React',
    vue: 'Vue',
    svelte: 'Svelte',
    solid: 'Solid',
    css: 'CSS',
    tailwind: 'Tailwind',
    zustand: 'Zustand',
    redux: 'Redux',
};
const label = (value) => labels[value] ?? value;
function summary(config, projectDirectory) {
    const lines = [
        `Project:   ${config.projectName}`,
        `Location:  ${projectDirectory}`,
        '',
        `Backend:   ${label(config.backendLanguage)}`,
        `Framework: ${label(config.framework)}`,
    ];
    if (config.hasUi && config.uiFramework) {
        lines.push(`UI:        ${label(config.uiFramework)}`, `Styling:   ${label(config.styling ?? 'css')}${config.useShadcn ? ' + shadcn/ui' : ''}`, `State:     ${config.stateManager ? label(config.stateManager) : 'None'}`);
    }
    return lines.join('\n');
}
const cd = (directory) => directory === '.' ? '' : `cd ${directory} && `;
intro('Hello, ERR Create is here to help you create a new FiveM resource!');
const config = await promptProject();
let projectDirectory;
try {
    projectDirectory = await generateProject(config);
}
catch (error) {
    cancel(error instanceof Error ? error.message : String(error));
    process.exit(1);
}
note(summary(config, projectDirectory), 'Project created successfully');
let roots = [];
let failures = [];
let installed = false;
try {
    roots = await findPackageRoots(projectDirectory);
}
catch (error) {
    log.warn(`Could not inspect the generated packages: ${error instanceof Error ? error.message : error}`);
}
// The last interactive step, after everything has been generated.
if (roots.length) {
    const answer = await confirm({
        message: 'Would you like to install dependencies?',
        initialValue: true,
    });
    if (answer === true) {
        const progress = spinner();
        failures = await installDependencies(projectDirectory, roots, root => {
            progress.start(`Installing dependencies in ${root.directory === '.' ? 'project root' : root.directory + '/'}...`);
        });
        progress.stop(failures.length ? 'Dependency installation finished with errors' : 'Dependencies installed successfully');
        installed = failures.length === 0;
    }
    else if (!isCancel(answer)) {
        log.info('Skipped dependency installation.');
    }
}
if (failures.length) {
    process.exitCode = 1;
    for (const failure of failures) {
        log.error(`Dependency installation failed in ${failure.directory === '.' ? 'the project root' : failure.directory + '/'}\n` +
            `${failure.message}\n\n` +
            `You can run:\n  ${cd(failure.directory)}npm install`);
    }
}
const nextSteps = roots
    .filter(root => root.hasBuildScript)
    .map(root => `${cd(root.directory)}npm run build`);
if (nextSteps.length) {
    const prefix = path.relative(process.cwd(), projectDirectory) || '.';
    note([
        `cd ${prefix}`,
        ...(!installed && roots.length ? roots.map(root => cd(root.directory) + 'npm install') : []),
        ...nextSteps,
    ].join('\n'), 'Next steps');
}
outro(failures.length ? 'Done, with errors above.' : 'Happy scripting!');
