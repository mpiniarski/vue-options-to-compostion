import path from 'path';
import fs from 'fs/promises';
import {readScriptTag, replaceScriptTag} from './vueFileManipulation';
import { transformComponent } from './transformComponent';

// Main function to handle CLI input
(async () => {
    const args = process.argv.slice(2);
    if (args.length === 0) {
        console.error('Please provide the path to the Vue component file.');
        process.exit(1);
    }

    const filePath = path.resolve(args[0]);
    const fileContent = await fs.readFile(filePath, 'utf-8');
    try {
        const scriptContent = await readScriptTag(fileContent);
        const newScriptContent = transformComponent(scriptContent);
        const newFileContent = replaceScriptTag(fileContent, newScriptContent);

        console.log(newFileContent);
    } catch (error) {
        console.error('Error transforming component:', error);
    }
})();
