import {translateDest, translateComp, translateJump} from './translator';

const assert = require('assert');
const inspect = require('util').inspect;

const tests = [
    {
        fn: translateDest,
        mnemonic: '',
        code: '000'
    },
    {
        fn: translateDest,
        mnemonic: 'MD',
        code: '011'
    },
    {
        fn: translateComp,
        mnemonic: '0',
        code: '0101010'
    },
    {
        fn: translateComp,
        mnemonic: 'D+M',
        code: '1000010'
    },
    {
        fn: translateJump,
        mnemonic: '',
        code: '000'
    },
    {
        fn: translateJump,
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
