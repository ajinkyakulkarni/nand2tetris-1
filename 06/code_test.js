import {dest, comp, jump} from './code';

const assert = require('assert');
const inspect = require('util').inspect;

const tests = [
    {
        fn: dest,
        mnemonic: '',
        code: '000'
    },
    {
        fn: dest,
        mnemonic: 'MD',
        code: '011'
    },
    {
        fn: comp,
        mnemonic: '0',
        code: '0101010'
    },
    {
        fn: comp,
        mnemonic: 'D+M',
        code: '1000010'
    },
    {
        fn: jump,
        mnemonic: '',
        code: '000'
    },
    {
        fn: jump,
        mnemonic: 'JGE',
        code: '011'
    }
];

for (const test of tests) {
    const code = test.fn(test.mnemonic);
    assert.strictEqual(code, test.code, `For test function ${inspect(test.fn)} ` +
        `and mnemonic '${test.mnemonic}', expected code to be ${test.code}, but was ${code}`);
}

console.log('Tests passed.');
