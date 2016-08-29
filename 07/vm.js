import parse from './parser';
import translateCommand from './translator';

export default function translate(staticPrefix, vmCode) {
    const lines = vmCode.split(/(\r|\n)/);
    const commands = lines.map(parse).filter(command => command !== null);
    
    const translatedLines = [];
    for (const command of commands) {
        translatedLines.push(...translateCommand(staticPrefix, command));
    }

    // Add newline at the end.
    translatedLines.push('');

    return translatedLines.join('\n');
}
