import path from 'path';
import fs from 'fs/promises';
import { readScriptTag, replaceScriptTag } from './vueFileManipulation';
import { transformToCompositionAPI } from './transformToCompositionAPI';

// Function to create directory if it doesn't exist
async function ensureDirectoryExists(filePath: string) {
    const dir = path.dirname(filePath);
    try {
        await fs.access(dir);
    } catch (error) {
        await fs.mkdir(dir, { recursive: true });
    }
}

// Main function to handle CLI input
(async () => {
    const args = process.argv.slice(2);
    if (args.length === 0) {
        console.error('Please provide the path to the source file.');
        process.exit(1);
    }

    const sourceFilePath = path.resolve(args[0]);
    const destinationFilePath = args[1]
            ? path.resolve(args[1])
            : path.join(path.dirname(sourceFilePath), `${path.basename(sourceFilePath, path.extname(sourceFilePath))}-composition${path.extname(sourceFilePath)}`);

    const fileContent = await fs.readFile(sourceFilePath, 'utf-8');
    const fileExtension = path.extname(sourceFilePath);

    try {
        await ensureDirectoryExists(destinationFilePath);

        let scriptContent = fileContent;
        let newScriptContent = '';

        if (fileExtension === '.vue') {
            scriptContent = await readScriptTag(fileContent);
            newScriptContent = transformToCompositionAPI(scriptContent, 'component');
            const newFileContent = replaceScriptTag(fileContent, newScriptContent);
            await fs.writeFile(destinationFilePath, newFileContent, 'utf-8');
            console.log(`Transformed file written to ${destinationFilePath}`);
        } else if (fileExtension === '.ts' || fileExtension === '.js') {
            newScriptContent = transformToCompositionAPI(scriptContent, 'composable');
            const functionName = path.basename(destinationFilePath, fileExtension);
            const finalCode = `
${newScriptContent}
`;
            await fs.writeFile(destinationFilePath, finalCode, 'utf-8');
            console.log(`Transformed file written to ${destinationFilePath}`);
        } else {
            console.error('Unsupported file extension. Please provide a .vue, .ts, or .js file.');
            process.exit(1);
        }
    } catch (error) {
        console.error('Error transforming component:', error);
    }
})();
