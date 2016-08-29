import translate from './translator';

const assert = require('assert');
const inspect = require('util').inspect;

const tests = [
    {
        command: {type: 'arithmetic', operation: 'add'},
        lines: ['@SP', 'M=M-1', 'A=M', 'D=M', 'A=A-1', 'M=M+D']
    },
    {
        command: {type: 'push', segment: 'constant', index: 7},
        lines: ['@7', 'D=A', '@SP', 'M=M+1', 'A=M-1', 'M=D']
    },
    {
        command: {type: 'push', segment: 'that', index: 5},
        lines: [
            '@THAT', 'D=M', '@5', 'A=D+A', 'D=M', // D now contains the value
            '@SP', 'M=M+1', 'A=M-1', 'M=D'        // Push D
        ]
    },
    {
        command: {type: 'pop', segment: 'local', index: 7},
        lines: [
            '@LCL', 'D=M', '@7', 'D=D+A', '@R13', 'M=D', // M[R13] now contains the target address
            '@SP', 'M=M-1', 'A=M', 'D=M',                // Pop into D
            '@R13', 'A=M', 'M=D'                         // Copy D into target address
        ]
    },
    {
        command: {type: 'pop', segment: 'temp', index: 3},
        lines: ['@SP', 'M=M-1', 'A=M', 'D=M', '@8', 'M=D']
    },
    {
        command: {type: 'push', segment: 'static', index: 8},
        lines: [
            '@test.8', 'D=M',              // D now contains the value
            '@SP', 'M=M+1', 'A=M-1', 'M=D' // Push D
        ]
    }
];

for (const test of tests) {
    const lines = translate('test', test.command);
    assert.deepEqual(lines, test.lines, `For test command ${inspect(test.command)}, ` +
        `expected lines to be ${inspect(test.lines)}, but were ${inspect(lines)}`);
}

console.log('Tests passed.');
