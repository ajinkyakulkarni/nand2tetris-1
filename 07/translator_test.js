import translate from './translator';

const assert = require('assert');
const inspect = require('util').inspect;

const tests = [
    {
        command: {type: 'push', args: ['constant', '7']},
        lines: [
            '@7', 'D=A',         // Set D to 7
            '@SP', 'A=M', 'M=D', // Set stack top value to D
            '@SP', 'M=M+1'       // Increment stack top index
        ]
    },
    {
        command: {type: 'arithmetic', operation: 'add'},
        lines: [
            '@SP', 'A=M-1', 'D=M', // Set D to last stack value 
            '@SP', 'M=M-1',        // Decrement stack top index
            'A=M', 'M=M+D'         // Add D to last stack value
        ]
    }
];

for (const test of tests) {
    const lines = translate(test.command);
    assert.deepEqual(lines, test.lines, `For test command ${inspect(test.command)}, ` +
        `expected lines to be ${inspect(test.lines)}, but were ${inspect(lines)}`);
}

console.log('Tests passed.');
