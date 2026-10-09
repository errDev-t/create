import path from 'node:path';
import { fileURLToPath } from 'node:url';

const currentFilePath = fileURLToPath(import.meta.url);
const currentDirPath = path.dirname(currentFilePath);

const isBuilt = currentDirPath.includes(`${path.sep}dist${path.sep}`);

export const templatesDir = path.resolve(
    currentDirPath,
    isBuilt ? '../../templates' : '../../templates',
);

console.log(`Templates directory resolved to: ${templatesDir}, isBuilt: ${isBuilt}, currentDirPath: ${currentDirPath} currentFilePath: ${currentFilePath}`);