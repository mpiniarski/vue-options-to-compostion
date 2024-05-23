import fs from 'fs/promises';

export async function readScriptTag(filePath: string): Promise<string> {
    // Read the Vue component file
    const fileContent = await fs.readFile(filePath, 'utf-8');

    // Extract the <script> content from the .vue file
    const scriptContentMatch = fileContent.match(/<script[^>]*>([\s\S]*)<\/script>/);
    if (!scriptContentMatch) {
        throw new Error('No <script> content found in the Vue component file.');
    }
    return scriptContentMatch[1].trim();
}
