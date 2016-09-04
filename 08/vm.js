import parse from './parser';
import translateCommand from './translator';

export function bootstrap() {
    // For debugging purposes, insert a bootstrap comment and end with a blank line.
    return ['// Bootstrap', ...translateCommand(null, {type: 'bootstrap'}), ''].join('\n');
}

export function translate(staticPrefix, vmCode) {
    const lines = vmCode.split(/(\r|\n)/);
    const translatedLines = [];

    for (const line of lines) {
        const command = parse(line);
        if (command) {
            // For debugging purposes, insert the VM command as a comment and end with a blank line.
            translatedLines.push('// ' + line, ...translateCommand(staticPrefix, command), '');
        }
    }

    return translatedLines.join('\n');
}
