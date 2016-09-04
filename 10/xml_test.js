import {tokensToXml, treeToXml} from './xml';

const assert = require('assert');
const inspect = obj => require('util').inspect(obj, {depth: null});

const tokensToXmlTests = [
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

const treeToXmlTests = [
    {
        tree: {type: 'expression', children: [
            {type: 'term', children: [
                {type: 'identifier', value: 'x'}
            ]},
            {type: 'symbol', value: '<'},
            {type: 'term', children: [
                {type: 'integerConstant', value: 153}
            ]}
        ]},
        xml:
`<expression>
  <term>
    <identifier> x </identifier>
  </term>
  <symbol> &lt; </symbol>
  <term>
    <integerConstant> 153 </integerConstant>
  </term>
</expression>
`
    }
];

for (const test of tokensToXmlTests) {
    const xml = tokensToXml(test.tokens);
    assert.strictEqual(xml, test.xml, `For test tokens ${inspect(test.tokens)}, ` +
        `expected xml to be '${test.xml}', but was '${xml}'`);
}

for (const test of treeToXmlTests) {
    const xml = treeToXml(test.tree);
    assert.strictEqual(xml, test.xml, `For test tree ${inspect(test.tree)}, ` +
        `expected xml to be '${test.xml}', but was '${xml}'`);
}

console.log('Tests passed.');
