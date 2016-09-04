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
    },
    {
        command: {type: 'label', label: 'LOOP_START'},
        lines: ['(LOOP_START)']
    },
    {
        command: {type: 'goto', label: 'LOOP_START'},
        lines: ['@LOOP_START', '0;JMP']
    },
    {
        command: {type: 'if-goto', label: 'LOOP_START'},
        lines: [
            '@SP', 'M=M-1', 'A=M', 'D=M', // Pop into D
            '@LOOP_START', 'D;JNE'        // Jump if D != 0
        ]
    },
    {
        command: {type: 'function', name: 'SimpleFunction.test', numLocals: 2},
        lines: [
            '(SimpleFunction.test)',
            '@SP', 'M=M+1', 'A=M-1', 'M=0', // Push 0
            '@SP', 'M=M+1', 'A=M-1', 'M=0'  // Push 0 again (2 arguments)
        ]
    },
    {
        command: {type: 'return'},
        lines: [
            // Copy the return address into D, then into R14
            '@LCL', 'D=M', '@5', 'A=D-A', 'D=M',
            '@R14', 'M=D',

            // Pop the return value into D, then copy into ARG 0 (which is where the calling
            // function will expect the return value to be)
            '@SP', 'M=M-1', 'A=M', 'D=M', '@ARG', 'A=M', 'M=D',

            // Restore caller SP; original address was ARG + 1
            '@ARG', 'D=M+1', '@SP', 'M=D',

            // Restore caller THAT; original address was saved at LCL - 1
            '@LCL', 'D=M', '@1', 'A=D-A', 'D=M', '@THAT', 'M=D',

            // Restore caller THIS; original address was saved at LCL - 2
            '@LCL', 'D=M', '@2', 'A=D-A', 'D=M', '@THIS', 'M=D',

            // Restore caller ARG; original address was saved at LCL - 3
            '@LCL', 'D=M', '@3', 'A=D-A', 'D=M', '@ARG', 'M=D',

            // Restore caller LCL; original address was saved at LCL - 3
            '@LCL', 'D=M', '@4', 'A=D-A', 'D=M', '@LCL', 'M=D',

            // Goto return address
            '@R14', 'A=M', '0;JMP'
        ]
    },
    {
        command: {type: 'call', name: 'SimpleFunction.test', numArguments: 2},
        lines: [
            // Save return address.
            '@LABEL0', 'D=A', '@SP', 'M=M+1', 'A=M-1', 'M=D',
            // Save LCL, ARG, THIS and THAT.
            '@LCL', 'D=M', '@SP', 'M=M+1', 'A=M-1', 'M=D',
            '@ARG', 'D=M', '@SP', 'M=M+1', 'A=M-1', 'M=D',
            '@THIS', 'D=M', '@SP', 'M=M+1', 'A=M-1', 'M=D',
            '@THAT', 'D=M', '@SP', 'M=M+1', 'A=M-1', 'M=D',
            // Reposition ARG to SP - numArguments - 5.
            '@SP', 'D=M', '@7', 'D=D-A', '@ARG', 'M=D',
            // Reposition LCL to SP.
            '@SP', 'D=M', '@LCL', 'M=D',
            // Goto called function.
            '@SimpleFunction.test', '0;JMP',
            // Insert return label.
            '(LABEL0)'
        ]
    }
];

for (const test of tests) {
    const lines = translate('test', test.command);
    assert.deepEqual(lines, test.lines, `For test command ${inspect(test.command)}, ` +
        `expected lines to be ${inspect(test.lines)}, but were ${inspect(lines)}`);
}

console.log('Tests passed.');
