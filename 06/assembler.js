import {translateDest, translateComp, translateJump} from './translator';
import parse from './parser';
import SymbolMap from './symbol-map';

export default function assemble(assembly) {
    const lines = assembly.split(/(\r|\n)/);
    const commands = lines.map(parse).filter(command => command !== null);
    const symbolMap = new SymbolMap();

    // First pass: add labels to the symbol map.
    let currentLineAddress = 0;
    for (const command of commands) {
        switch (command.type) {
            case 'A':
            case 'C':
                currentLineAddress++;
                break;

            case 'L':
                symbolMap.set(command.symbol, currentLineAddress);
                break;
        }
    }

    // Second pass: add variables to the symbol map and translate commands.
    let nextVariableAddress = parseInt(10000, 2);
    const translatedCommands = [];
    for (const command of commands) {
        switch (command.type) {
            case 'A': {
                let number;
                const constant = parseInt(command.symbol, 10);
                if (isNaN(constant)) {
                    if (!symbolMap.has(command.symbol)) {
                        symbolMap.set(command.symbol, nextVariableAddress);
                        nextVariableAddress++;
                    }
                    number = symbolMap.get(command.symbol);
                } else {
                    number = constant;
                }
                const binary = number.toString(2);
                const padding = '0'.repeat(16 - binary.length);
                translatedCommands.push(padding + binary);
                break;
            }

            case 'C': {
                const binary = '111' + translateComp(command.comp) + translateDest(command.dest) +
                    translateJump(command.jump);
                translatedCommands.push(binary);
                break;
            }

            case 'L':
                // Ignored.
                break;
        }
    }

    // Add newline at the end.
    translatedCommands.push('');

    return translatedCommands.join('\n');
}