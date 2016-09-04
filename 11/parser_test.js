import * as parser from './parser';

const assert = require('assert');
const inspect = obj => require('util').inspect(obj, {depth: null});

const tests = [
    {
        fn: parser.parseClass,
        tokens: [
            {type: 'keyword', value: 'class'},
            {type: 'identifier', value: 'Main'},
            {type: 'symbol', value: '{'},
            {type: 'keyword', value: 'function'},
            {type: 'keyword', value: 'void'},
            {type: 'identifier', value: 'Main'},
            {type: 'symbol', value: '('},
            {type: 'symbol', value: ')'},
            {type: 'symbol', value: '{'},
            {type: 'symbol', value: '}'},
            {type: 'symbol', value: '}'}
        ],
        tree: {type: 'class', children: [
            {type: 'keyword', value: 'class'},
            {type: 'identifier', value: 'Main'},
            {type: 'symbol', value: '{'},
            {type: 'subroutineDec', children: [
                {type: 'keyword', value: 'function'},
                {type: 'keyword', value: 'void'},
                {type: 'identifier', value: 'Main'},
                {type: 'symbol', value: '('},
                {type: 'parameterList', children: []},
                {type: 'symbol', value: ')'},
                {type: 'subroutineBody', children: [
                    {type: 'symbol', value: '{'},
                    {type: 'statements', children: []},
                    {type: 'symbol', value: '}'}
                ]}
            ]},
            {type: 'symbol', value: '}'}
        ]}
    },
    {
        fn: parser.parseExpression,
        tokens: [
            {type: 'identifier', value: 'x'},
            {type: 'symbol', value: '<'},
            {type: 'integerConstant', value: 153}
        ],
        tree: {type: 'expression', children: [
            {type: 'term', children: [
                {type: 'identifier', value: 'x'}
            ]},
            {type: 'symbol', value: '<'},
            {type: 'term', children: [
                {type: 'integerConstant', value: 153}
            ]}
        ]}
    },
    {
        fn: parser.parseOptionalStatement,
        tokens: [
            {type: 'keyword', value: 'if'},
            {type: 'symbol', value: '('},
            {type: 'identifier', value: 'x'},
            {type: 'symbol', value: ')'},
            {type: 'symbol', value: '{'},
            {type: 'symbol', value: '}'}
        ],
        tree: {type: 'ifStatement', children: [
            {type: 'keyword', value: 'if'},
            {type: 'symbol', value: '('},
            {type: 'expression', children: [
                {type: 'term', children: [
                    {type: 'identifier', value: 'x'}
                ]}
            ]},
            {type: 'symbol', value: ')'},
            {type: 'symbol', value: '{'},
            {type: 'statements', children: []},
            {type: 'symbol', value: '}'}
        ]}
    },
    {
        fn: parser.parseOptionalStatement,
        tokens: [
            {type: 'keyword', value: 'if'},
            {type: 'symbol', value: '('},
            {type: 'identifier', value: 'x'},
            {type: 'symbol', value: ')'},
            {type: 'symbol', value: '{'},
            {type: 'symbol', value: '}'},
            {type: 'keyword', value: 'else'},
            {type: 'symbol', value: '{'},
            {type: 'symbol', value: '}'}
        ],
        tree: {type: 'ifStatement', children: [
            {type: 'keyword', value: 'if'},
            {type: 'symbol', value: '('},
            {type: 'expression', children: [
                {type: 'term', children: [
                    {type: 'identifier', value: 'x'}
                ]}
            ]},
            {type: 'symbol', value: ')'},
            {type: 'symbol', value: '{'},
            {type: 'statements', children: []},
            {type: 'symbol', value: '}'},
            {type: 'keyword', value: 'else'},
            {type: 'symbol', value: '{'},
            {type: 'statements', children: []},
            {type: 'symbol', value: '}'}
        ]}
    },
    {
        fn: parser.parseStatements,
        tokens: [
            {type: 'keyword', value: 'let'},
            {type: 'identifier', value: 'city'},
            {type: 'symbol', value: '='},
            {type: 'stringConstant', value: 'Paris'},
            {type: 'symbol', value: ';'}
        ],
        tree: {type: 'statements', children: [
            {type: 'letStatement', children: [
                {type: 'keyword', value: 'let'},
                {type: 'identifier', value: 'city'},
                {type: 'symbol', value: '='},
                {type: 'expression', children: [
                    {type: 'term', children: [
                        {type: 'stringConstant', value: 'Paris'}
                    ]}
                ]},
                {type: 'symbol', value: ';'}
            ]}
        ]}
    },
    {
        fn: parser.parseStatements,
        tokens: [
            {type: 'keyword', value: 'return'},
            {type: 'keyword', value: 'this'},
            {type: 'symbol', value: ';'}
        ],
        tree: {type: 'statements', children: [
            {type: 'returnStatement', children: [
                {type: 'keyword', value: 'return'},
                {type: 'expression', children: [
                    {type: 'term', children: [
                        {type: 'keyword', value: 'this'}
                    ]}
                ]},
                {type: 'symbol', value: ';'}
            ]}
        ]}
    },
    {
        fn: parser.parseOptionalVarDec,
        tokens: [
            {type: 'keyword', value: 'var'},
            {type: 'identifier', value: 'Array'},
            {type: 'identifier', value: 'a'},
            {type: 'symbol', value: ';'}
        ],
        tree: {type: 'varDec', children: [
            {type: 'keyword', value: 'var'},
            {type: 'identifier', value: 'Array'},
            {type: 'identifier', value: 'a'},
            {type: 'symbol', value: ';'}
        ]}
    },
    {
        fn: parser.parseOptionalStatement,
        tokens: [
            {type: 'keyword', value: 'do'},
            {type: 'identifier', value: 'Memory'},
            {type: 'symbol', value: '.'},
            {type: 'identifier', value: 'deAlloc'},
            {type: 'symbol', value: '('},
            {type: 'identifier', value: 'square'},
            {type: 'symbol', value: ')'},
            {type: 'symbol', value: ';'}
        ],
        tree: {type: 'doStatement', children: [
            {type: 'keyword', value: 'do'},
            {type: 'subroutineCall', children: [
                {type: 'identifier', value: 'Memory'},
                {type: 'symbol', value: '.'},
                {type: 'identifier', value: 'deAlloc'},
                {type: 'symbol', value: '('},
                {type: 'expressionList', children: [
                    {type: 'expression', children: [
                        {type: 'term', children: [
                            {type: 'identifier', value: 'square'}
                        ]}
                    ]}
                ]},
                {type: 'symbol', value: ')'}
            ]},
            {type: 'symbol', value: ';'}
        ]}
    },
    {
        fn: parser.parseClass,
        tokens: [
            {type: 'keyword', value: 'class'},
            {type: 'identifier', value: 'Main'},
            {type: 'symbol', value: '{'},
            {type: 'keyword', value: 'field'},
            {type: 'keyword', value: 'int'},
            {type: 'identifier', value: 'x'},
            {type: 'symbol', value: ';'},
            {type: 'keyword', value: 'field'},
            {type: 'keyword', value: 'int'},
            {type: 'identifier', value: 'y'},
            {type: 'symbol', value: ';'},
            {type: 'symbol', value: '}'}
        ],
        tree: {type: 'class', children: [
            {type: 'keyword', value: 'class'},
            {type: 'identifier', value: 'Main'},
            {type: 'symbol', value: '{'},
            {type: 'classVarDec', children: [
                {type: 'keyword', value: 'field'},
                {type: 'keyword', value: 'int'},
                {type: 'identifier', value: 'x'},
                {type: 'symbol', value: ';'}
            ]},
            {type: 'classVarDec', children: [
                {type: 'keyword', value: 'field'},
                {type: 'keyword', value: 'int'},
                {type: 'identifier', value: 'y'},
                {type: 'symbol', value: ';'}
            ]},
            {type: 'symbol', value: '}'}
        ]}
    }
];

for (const test of tests) {
    const tree = test.fn(test.tokens, 0).node;
    assert.deepStrictEqual(tree, test.tree, `Using ${inspect(test.fn)}, ` +
        `for tokens ${inspect(test.tokens)}, expected tree to be ${inspect(test.tree)}, ` +
        `but was ${inspect(tree)}`);
}

console.log('Tests passed.');
