export async function readScriptTag(fileContent: string): Promise<string> {
    // Extract the <script> content from the .vue file
    const scriptContentMatch = fileContent.match(/<script[^>]*>([\s\S]*)<\/script>/);
    if (!scriptContentMatch) {
        throw new Error('No <script> content found in the Vue component file.');
    }
    return scriptContentMatch[1].trim();
}

export function replaceScriptTag(fileContent: string, newScriptContent: string): string {
    // Define the new script content including the <script> and </script> tags
    const newScriptTag = `${newScriptContent.trim()}`;

    // Replace the existing <script> tag with the new script content
    return fileContent.replace(
            /<script[^>]*>[\s\S]*?<\/script>/,
            newScriptTag
    );
}
