import parse from './parser';
import translateCommand from './translator';

export default function translate(staticPrefix, vmCode) {
    const lines = vmCode.split(/(\r|\n)/);
    const translatedLines = [];

    for (const line of lines) {
        const command = parse(line);
        if (command) {
            // For debugging purposes, copy the VM command as a comment.
            translatedLines.push('// ' + line);

            translatedLines.push(...translateCommand(staticPrefix, command));

            // Insert a blank line for readability while debugging.
            translatedLines.push('');
        }
    }

    return translatedLines.join('\n');
}
