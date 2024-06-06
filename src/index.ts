import path from 'path';
import fs from 'fs/promises';
import { readScriptTag, replaceScriptTag } from './vueFileManipulation';
import { transformComponent } from './transformComponent';

// Main function to handle CLI input
(async () => {
    const args = process.argv.slice(2);
    if (args.length === 0) {
        console.error('Please provide the path to the component file.');
        process.exit(1);
    }

    const filePath = path.resolve(args[0]);
    const fileContent = await fs.readFile(filePath, 'utf-8');
    const fileExtension = path.extname(filePath);

    try {
        let scriptContent = fileContent;
        let newScriptContent = '';

        if (fileExtension === '.vue') {
            scriptContent = await readScriptTag(fileContent);
            newScriptContent = `<script setup>\n${transformComponent(scriptContent)}\n</script>`;
            const newFileContent = replaceScriptTag(fileContent, newScriptContent);
            console.log(newFileContent);
        } else if (fileExtension === '.ts' || fileExtension === '.js') {
            newScriptContent = transformComponent(scriptContent);
            console.log(newScriptContent);
        } else {
            console.error('Unsupported file extension. Please provide a .vue, .ts, or .js file.');
            process.exit(1);
        }
    } catch (error) {
        console.error('Error transforming component:', error);
    }
})();
