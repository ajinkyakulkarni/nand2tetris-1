import * as compiler from './compiler';

const assert = require('assert');
const inspect = obj => require('util').inspect(obj, {depth: null});

const tests = [
    {
        fn: compiler.compileClass,
        node: {type: 'class', children: [
            {type: 'keyword', value: 'class'},
            {type: 'identifier', value: 'Main'},
            {type: 'symbol', value: '{'},
            {type: 'subroutineDec', children: [
                {type: 'keyword', value: 'function'},
                {type: 'keyword', value: 'void'},
                {type: 'identifier', value: 'main'},
                {type: 'symbol', value: '('},
                {type: 'parameterList', children: []},
                {type: 'symbol', value: ')'},
                {type: 'subroutineBody', children: [
                    {type: 'symbol', value: '{'},
                    {type: 'statements', children: [
                        {type: 'returnStatement', children: [
                            {type: 'keyword', value: 'return'},
                            {type: 'symbol', value: ';'}
                        ]}
                    ]},
                    {type: 'symbol', value: '}'}
                ]}
            ]},
            {type: 'symbol', value: '}'}
        ]},
        lines: [
            'function Main.main 0',
            'push constant 0',
            'return'
        ]
    },
    {
        fn: compiler.compileExpressionList,
        node: {type: 'expressionList', children: [
            {type: 'expression', children: [
                {type: 'term', children: [
                    {type: 'integerConstant', value: '5'}
                ]}
            ]}
        ]},
        lines: [
            'push constant 5'
        ]
    },
    {
        fn: compiler.compileDoStatement,
        node: {type: 'doStatement', children: [
            {type: 'keyword', value: 'do'},
            {type: 'identifier', value: 'Output'},
            {type: 'symbol', value: '.'},
            {type: 'identifier', value: 'printInt'},
            {type: 'symbol', value: '('},
            {type: 'expressionList', children: [
                {type: 'expression', children: [
                    {type: 'term', children: [
                        {type: 'integerConstant', value: '5'}
                    ]}
                ]}
            ]},
            {type: 'symbol', value: ')'},
            {type: 'symbol', value: ';'}
        ]},
        lines: [
            'push constant 5',
            'call Output.printInt 1',
            'pop temp 0'
        ]
    },
    {
        fn: compiler.compileTerm,
        node: {type: 'term', children: [
            {type: 'symbol', value: '('},
            {type: 'expression', children: [
                {type: 'term', children: [
                    {type: 'integerConstant', value: '2'}
                ]},
                {type: 'symbol', value: '*'},
                {type: 'term', children: [
                    {type: 'integerConstant', value: '3'}
                ]}
            ]},
            {type: 'symbol', value: ')'}
        ]},
        lines: [
            'push constant 2',
            'push constant 3',
            'call Math.multiply 2'
        ]
    },
    {
        fn: compiler.compileClass,
        node: {type: 'class', children: [
            {type: 'keyword', value: 'class'},
            {type: 'identifier', value: 'Main'},
            {type: 'symbol', value: '{'},
            {type: 'subroutineDec', children: [
                {type: 'keyword', value: 'function'},
                {type: 'keyword', value: 'void'},
                {type: 'identifier', value: 'main'},
                {type: 'symbol', value: '('},
                {type: 'parameterList', children: []},
                {type: 'symbol', value: ')'},
                {type: 'subroutineBody', children: [
                    {type: 'symbol', value: '{'},
                    {type: 'statements', children: [
                        {type: 'doStatement', children: [
                            {type: 'keyword', value: 'do'},
                            {type: 'identifier', value: 'Output'},
                            {type: 'symbol', value: '.'},
                            {type: 'identifier', value: 'printInt'},
                            {type: 'symbol', value: '('},
                            {type: 'expressionList', children: [
                                {type: 'expression', children: [
                                    {type: 'term', children: [
                                        {type: 'symbol', value: '('},
                                        {type: 'expression', children: [
                                            {type: 'term', children: [
                                                {type: 'integerConstant', value: '2'}
                                            ]},
                                            {type: 'symbol', value: '*'},
                                            {type: 'term', children: [
                                                {type: 'integerConstant', value: '3'}
                                            ]}
                                        ]},
                                        {type: 'symbol', value: ')'}
                                    ]}
                                ]}
                            ]},
                            {type: 'symbol', value: ')'},
                            {type: 'symbol', value: ';'}
                        ]},
                        {type: 'returnStatement', children: [
                            {type: 'keyword', value: 'return'},
                            {type: 'symbol', value: ';'}
                        ]}
                    ]},
                    {type: 'symbol', value: '}'}
                ]}
            ]},
            {type: 'symbol', value: '}'}
        ]},
        lines: [
            'function Main.main 0',
            'push constant 0',
            'return'
        ]
    }
];

for (const test of tests) {
    const lines = test.fn(test.node);
    assert.deepStrictEqual(lines, test.lines, `Using ${inspect(test.fn)}, ` +
        `for node:\n${inspect(test.node)}\n` +
        `expected compîled lines to be:\n${inspect(test.lines)}\n` +
        `but were:\n${inspect(lines)}`);
}

console.log('Tests passed.');
