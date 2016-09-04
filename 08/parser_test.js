import parse from './parser';

const assert = require('assert');
const inspect = require('util').inspect;

const tests = [
    {
        line: '',
        command: null
    },
    {
        line: ' ',
        command: null
    },
    {
        line: '// This is a comment',
        command: null
    },
    {
        line: '    // This is a comment with leading whitespace',
        command: null
    },
    {
        line: 'push constant 7',
        command: {type: 'push', segment: 'constant', index: 7}
    },
    {
        line: '  push  constant    7  // This is a comment ',
        command: {type: 'push', segment: 'constant', index: 7}
    },
    {
        line: 'add',
        command: {type: 'arithmetic', operation: 'add'}
    },
    {
        line: 'label LOOP_START',
        command: {type: 'label', label: 'LOOP_START'}
    },
    {
        line: 'goto LOOP_START',
        command: {type: 'goto', label: 'LOOP_START'}
    },
    {
        line: 'if-goto LOOP_START',
        command: {type: 'if-goto', label: 'LOOP_START'}
    },
    {
        line: 'function SimpleFunction.test 2',
        command: {type: 'function', name: 'SimpleFunction.test', numLocals: 2}
    },
    {
        line: 'return',
        command: {type: 'return'}
    },
    {
        line: 'call Main.fibonacci 1',
        command: {type: 'call', name: 'Main.fibonacci', numArguments: 1}
    }
];

for (const test of tests) {
    const command = parse(test.line);
    assert.deepStrictEqual(command, test.command, `For line ${inspect(test.line)}, ` +
        `expected command to be ${inspect(test.command)}, but was ${inspect(command)}`);
}

console.log('Tests passed.');
