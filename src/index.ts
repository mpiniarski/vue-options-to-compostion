import path from 'path';
import { readScriptTag } from './readScriptTag';
import { transformComponent } from './transformComponent';

// Main function to handle CLI input
(async () => {
    const args = process.argv.slice(2);
    if (args.length === 0) {
        console.error('Please provide the path to the Vue component file.');
        process.exit(1);
    }

    const filePath = path.resolve(args[0]);
    try {
        const scriptContent = await readScriptTag(filePath);
        const result = await transformComponent(scriptContent);
        console.log(result);
    } catch (error) {
        console.error('Error transforming component:', error);
    }
})();
