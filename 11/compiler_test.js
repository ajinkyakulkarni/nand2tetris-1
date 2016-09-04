import * as compiler from './compiler';
import SymbolTable from './symbol-table';

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
            {type: 'subroutineCall', children: [
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
                {type: 'symbol', value: ')'}
            ]},
            {type: 'symbol', value: ';'}
        ]},
        lines: [
            'push constant 5',
            'call Output.printInt 1',
            'pop temp 0'
        ]
    },
    {
        fn: node => compiler.compileTerm(node, new SymbolTable()),
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
        fn: node => compiler.compileSubroutineDec(node, new SymbolTable(), 'TestClass'),
        node: {type: 'subroutineDec', children: [
            {type: 'keyword', value: 'function'},
            {type: 'keyword', value: 'int'},
            {type: 'identifier', value: 'testFn'},
            {type: 'symbol', value: '('},
            {type: 'parameterList', children: [
                {type: 'keyword', value: 'int'},
                {type: 'identifier', value: 'testArg1'},
                {type: 'symbol', value: ','},
                {type: 'keyword', value: 'int'},
                {type: 'identifier', value: 'testArg2'}
            ]},
            {type: 'symbol', value: ')'},
            {type: 'subroutineBody', children: [
                {type: 'symbol', value: '{'},
                {type: 'varDec', children: [
                    {type: 'keyword', value: 'var'},
                    {type: 'keyword', value: 'int'},
                    {type: 'identifier', value: 'testVar1'},
                    {type: 'symbol', value: ','},
                    {type: 'identifier', value: 'testVar2'},
                    {type: 'symbol', value: ';'}
                ]},
                {type: 'varDec', children: [
                    {type: 'keyword', value: 'var'},
                    {type: 'keyword', value: 'char'},
                    {type: 'identifier', value: 'testVar3'},
                    {type: 'symbol', value: ';'}
                ]},
                {type: 'statements', children: [
                    {type: 'returnStatement', children: [
                        {type: 'keyword', value: 'return'},
                        {type: 'expression', children: [
                            {type: 'term', children: [
                                {type: 'identifier', value: 'testArg2'}
                            ]}
                        ]},
                        {type: 'symbol', value: ';'}
                    ]}
                ]},
                {type: 'symbol', value: '}'}
            ]}
        ]},
        lines: [
            'function TestClass.testFn 3',
            'push argument 1',
            'return'
        ]
    },
    {
        fn: node => compiler.compileSubroutineBody(node, new SymbolTable()),
        node: {type: 'subroutineBody', children: [
            {type: 'symbol', value: '{'},
            {type: 'varDec', children: [
                {type: 'keyword', value: 'var'},
                {type: 'keyword', value: 'int'},
                {type: 'identifier', value: 'testVar'},
                {type: 'symbol', value: ';'}
            ]},
            {type: 'statements', children: [
                {type: 'letStatement', children: [
                    {type: 'keyword', value: 'let'},
                    {type: 'identifier', value: 'testVar'},
                    {type: 'symbol', value: '='},
                    {type: 'expression', children: [
                        {type: 'term', children: [
                            {type: 'integerConstant', value: '4'}
                        ]}
                    ]},
                    {type: 'symbol', value: ';'}
                ]},
                {type: 'returnStatement', children: [
                    {type: 'keyword', value: 'return'},
                    {type: 'expression', children: [
                        {type: 'term', children: [
                            {type: 'identifier', value: 'testVar'}
                        ]}
                    ]},
                    {type: 'symbol', value: ';'}
                ]}
            ]},
            {type: 'symbol', value: '}'}
        ]},
        lines: [
            'push constant 4',
            'pop local 0',
            'push local 0',
            'return'
        ]
    },
    {
        fn: node => compiler.compileExpression(node, new SymbolTable()),
        node: {type: 'expression', children: [
            {type: 'term', children: [
                {type: 'subroutineCall', children: [
                    {type: 'identifier', value: 'Memory'},
                    {type: 'symbol', value: '.'},
                    {type: 'identifier', value: 'peek'},
                    {type: 'symbol', value: '('},
                    {type: 'expressionList', children: [
                        {type: 'expression', children: [
                            {type: 'term', children: [
                                {type: 'integerConstant', value: '8000'}
                            ]}
                        ]}
                    ]},
                    {type: 'symbol', value: ')'}
                ]}
            ]}
        ]},
        lines: [
            'push constant 8000',
            'call Memory.peek 1'
        ]
    },
    {
        fn: node => compiler.compileSubroutineBody(node, new SymbolTable()),
        node: {type: 'subroutineBody', children: [
            {type: 'symbol', value: '{'},
            {type: 'varDec', children: [
                {type: 'keyword', value: 'var'},
                {type: 'keyword', value: 'boolean'},
                {type: 'identifier', value: 'testVar'},
                {type: 'symbol', value: ';'}
            ]},
            {type: 'statements', children: [
                {type: 'letStatement', children: [
                    {type: 'keyword', value: 'let'},
                    {type: 'identifier', value: 'testVar'},
                    {type: 'symbol', value: '='},
                    {type: 'expression', children: [
                        {type: 'term', children: [
                            {type: 'keyword', value: 'true'}
                        ]}
                    ]},
                    {type: 'symbol', value: ';'}
                ]},
                {type: 'returnStatement', children: [
                    {type: 'keyword', value: 'return'},
                    {type: 'symbol', value: ';'}
                ]}
            ]},
            {type: 'symbol', value: '}'}
        ]},
        lines: [
            'push constant 0',
            'not',
            'pop local 0',
            'push constant 0',
            'return'
        ]
    },
    {
        fn: node => compiler.compileIfStatement(node, new SymbolTable()),
        node: {type: 'ifStatement', children: [
            {type: 'keyword', value: 'if'},
            {type: 'symbol', value: '('},
            {type: 'expression', children: [
                {type: 'term', children: [
                    {type: 'keyword', value: 'true'}
                ]}
            ]},
            {type: 'symbol', value: ')'},
            {type: 'symbol', value: '{'},
            {type: 'statements', children: [
                {type: 'returnStatement', children: [
                    {type: 'keyword', value: 'return'},
                    {type: 'expression', children: [
                        {type: 'term', children: [
                            {type: 'keyword', value: 'true'}
                        ]}
                    ]},
                    {type: 'symbol', value: ';'}
                ]}
            ]},
            {type: 'symbol', value: '}'}
        ]},
        lines: [
            'push constant 0',
            'not',
            'not',
            'if-goto IF_FALSE0',
            'push constant 0',
            'not',
            'return',
            'goto IF_TRUE0',
            'label IF_FALSE0',
            'label IF_TRUE0'
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
