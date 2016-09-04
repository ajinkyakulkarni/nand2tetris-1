import tokenize from './tokenizer';

const assert = require('assert');
const inspect = require('util').inspect;

const tests = [
    {
        jacks: [
            'if (x < 153) { let city = "Paris"; }',
            'if (x<153) // comment\n{ let city = "Paris"; }',
            'if (x < 153) { /* comment */ let city = "Paris"; }',
            'if (x < 153) { /* comment */ let city /* other comment */ = "Paris"; }',
            'if (x < 153) { /* comment \n comment continues */ let city = "Paris"; }',
            '/** doc */ if (x < 153) { let city = "Paris"; }',
            'if (   x\n< 153 \r) { let \r\ncity    = "Paris" ; \n  } \r'
        ],
        tokens: [
            {type: 'keyword', value: 'if'},
            {type: 'symbol', value: '('},
            {type: 'identifier', value: 'x'},
            {type: 'symbol', value: '<'},
            {type: 'integerConstant', value: 153},
            {type: 'symbol', value: ')'},
            {type: 'symbol', value: '{'},
            {type: 'keyword', value: 'let'},
            {type: 'identifier', value: 'city'},
            {type: 'symbol', value: '='},
            {type: 'stringConstant', value: 'Paris'},
            {type: 'symbol', value: ';'},
            {type: 'symbol', value: '}'}
        ]
    }
];

for (const test of tests) {
    for (const jack of test.jacks) {
        const tokens = tokenize(jack);
        assert.deepStrictEqual(tokens, test.tokens, `For jack:\n${jack}\n` +
            `Expected tokens to be:\n${inspect(test.tokens)}\n` +
            `But were:\n${inspect(tokens)}`);
    }
}

console.log('Tests passed.');
