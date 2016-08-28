import parse from './parser';
import translateCommand from './translator';

export default function translate(vm) {
    const lines = vm.split(/(\r|\n)/);
    const commands = lines.map(parse).filter(command => command !== null);
    
    const translatedLines = [];
    for (const command of commands) {
        translatedLines.push(...translateCommand(command));
    }

    // Add newline at the end.
    translatedLines.push('');

    return translatedLines.join('\n');
}
