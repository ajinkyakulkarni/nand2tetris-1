import tokensToXml from './xml';

const assert = require('assert');
const inspect = require('util').inspect;

const tests = [
    {
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
        ],
        xml:
`<tokens>
<keyword> if </keyword>
<symbol> ( </symbol>
<identifier> x </identifier>
<symbol> &lt; </symbol>
<integerConstant> 153 </integerConstant>
<symbol> ) </symbol>
<symbol> { </symbol>
<keyword> let </keyword>
<identifier> city </identifier>
<symbol> = </symbol>
<stringConstant> Paris </stringConstant>
<symbol> ; </symbol>
<symbol> } </symbol>
</tokens>
`
    },
    {
        tokens: [
            {type: 'symbol', value: '<'},
            {type: 'symbol', value: '>'},
            {type: 'symbol', value: '&'}
        ],
        xml:
`<tokens>
<symbol> &lt; </symbol>
<symbol> &gt; </symbol>
<symbol> &amp; </symbol>
</tokens>
`
    }
];

for (const test of tests) {
    const xml = tokensToXml(test.tokens);
    assert.strictEqual(xml, test.xml, `For test tokens ${inspect(test.tokens)}, ` +
        `expected xml to be '${test.xml}', but was '${xml}'`);
}

console.log('Tests passed.');
