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
        line: '@123',
        command: {type: 'A', symbol: '123'}
    },
    {
        line: '@abc123',
        command: {type: 'A', symbol: 'abc123'}
    },
    {
        line: ' @ a  bc 12 3  ',
        command: {type: 'A', symbol: 'abc123'}
    },
    {
        line: '@123',
        command: {type: 'A', symbol: '123'}
    },
    {
        line: 'D=D+A',
        command: {type: 'C', dest: 'D', comp: 'D+A', jump: ''}
    },
    {
        line: 'D;JGT',
        command: {type: 'C', dest: '', comp: 'D', jump: 'JGT'}
    },
    {
        line: 'D=D+A;JGT',
        command: {type: 'C', dest: 'D', comp: 'D+A', jump: 'JGT'}
    },
    {
        line: '(LOOP)',
        command: {type: 'L', symbol: 'LOOP'}
    }
];

for (const test of tests) {
    const command = parse(test.line);
    assert.deepStrictEqual(command, test.command, `For line ${inspect(test.line)}, ` +
        `expected command to be ${inspect(test.command)}, but was ${inspect(command)}`);
}

console.log('Tests passed.');
