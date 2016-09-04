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
        fn: node => compiler.compileExpressionList(node, new SymbolTable()),
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
        fn: node => compiler.compileDoStatement(node, new SymbolTable()),
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
        fn: node => {
            const symbolTable = new SymbolTable();
            symbolTable.className = 'TestClass';
            return compiler.compileSubroutineDec(node, symbolTable);
        },
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
            'if-goto IF_TRUE0',
            'goto IF_FALSE0',
            'label IF_TRUE0',
            'push constant 0',
            'not',
            'return',
            'label IF_FALSE0'
        ]
    },
    {
        fn: node => {
            const symbolTable = new SymbolTable();
            symbolTable.className = 'TestClass';
            return compiler.compileSubroutineDec(node, symbolTable);
        },
        node: {type: 'subroutineDec', children: [
            {type: 'keyword', value: 'function'},
            {type: 'keyword', value: 'int'},
            {type: 'identifier', value: 'testFn'},
            {type: 'symbol', value: '('},
            {type: 'parameterList', children: [
                {type: 'keyword', value: 'SomeClass'},
                {type: 'identifier', value: 'testArg1'}
            ]},
            {type: 'symbol', value: ')'},
            {type: 'subroutineBody', children: [
                {type: 'symbol', value: '{'},
                {type: 'statements', children: [
                    {type: 'returnStatement', children: [
                        {type: 'keyword', value: 'return'},
                        {type: 'expression', children: [
                            {type: 'term', children: [
                                {type: 'subroutineCall', children: [
                                    {type: 'identifier', value: 'testArg1'},
                                    {type: 'symbol', value: '.'},
                                    {type: 'identifier', value: 'getSomething'},
                                    {type: 'symbol', value: '('},
                                    {type: 'expressionList', children: []},
                                    {type: 'symbol', value: ')'}
                                ]}
                            ]}
                        ]},
                        {type: 'symbol', value: ';'}
                    ]}
                ]},
                {type: 'symbol', value: '}'}
            ]}
        ]},
        lines: [
            'function TestClass.testFn 0',
            'push argument 0',
            'call SomeClass.getSomething 1',
            'return'
        ]
    },
    {
        fn: compiler.compileClass,
        node: {type: 'class', children: [
            {type: 'keyword', value: 'class'},
            {type: 'identifier', value: 'TestClass'},
            {type: 'symbol', value: '{'},
            {type: 'classVarDec', children: [
                {type: 'keyword', value: 'field'},
                {type: 'keyword', value: 'int'},
                {type: 'identifier', value: 'fieldValue'},
                {type: 'symbol', value: ';'}
            ]},
            {type: 'subroutineDec', children: [
                {type: 'keyword', value: 'constructor'},
                {type: 'identifier', value: 'TestClass'},
                {type: 'identifier', value: 'new'},
                {type: 'symbol', value: '('},
                {type: 'parameterList', children: [
                    {type: 'keyword', value: 'int'},
                    {type: 'identifier', value: 'argValue'}
                ]},
                {type: 'symbol', value: ')'},
                {type: 'subroutineBody', children: [
                    {type: 'symbol', value: '{'},
                    {type: 'statements', children: [
                        {type: 'letStatement', children: [
                            {type: 'keyword', value: 'let'},
                            {type: 'identifier', value: 'fieldValue'},
                            {type: 'symbol', value: '='},
                            {type: 'expression', children: [
                                {type: 'term', children: [
                                    {type: 'identifier', value: 'argValue'}
                                ]}
                            ]},
                            {type: 'symbol', value: ';'}
                        ]},
                        {type: 'returnStatement', children: [
                            {type: 'keyword', value: 'return'},
                            {type: 'expression', children: [
                                {type: 'term', children: [
                                    {type: 'keyword', value: 'this'}
                                ]}
                            ]},
                            {type: 'symbol', value: ';'}
                        ]}
                    ]},
                    {type: 'symbol', value: '}'}
                ]}
            ]},
            {type: 'symbol', value: '}'}
        ]},
        lines: [
            'function TestClass.new 0',
            'push constant 1',     // Allocate one word
            'call Memory.alloc 1', // Push the instance address on the stack
            'pop pointer 0',       // Pop the instance address into pointer[0]
            'push argument 0',     // Push argValue on the stack
            'pop this 0',          // Pop argValue into fieldValue,
            'push pointer 0',      // Push the instance address on the stack, as return value
            'return'
        ]
    },
    {
        fn: compiler.compileClass,
        node: {type: 'class', children: [
            {type: 'keyword', value: 'class'},
            {type: 'identifier', value: 'TestClass'},
            {type: 'symbol', value: '{'},
            {type: 'classVarDec', children: [
                {type: 'keyword', value: 'field'},
                {type: 'keyword', value: 'int'},
                {type: 'identifier', value: 'fieldValue'},
                {type: 'symbol', value: ';'}
            ]},
            {type: 'subroutineDec', children: [
                {type: 'keyword', value: 'method'},
                {type: 'identifier', value: 'void'},
                {type: 'identifier', value: 'setFieldValue'},
                {type: 'symbol', value: '('},
                {type: 'parameterList', children: [
                    {type: 'keyword', value: 'int'},
                    {type: 'identifier', value: 'argValue'}
                ]},
                {type: 'symbol', value: ')'},
                {type: 'subroutineBody', children: [
                    {type: 'symbol', value: '{'},
                    {type: 'statements', children: [
                        {type: 'letStatement', children: [
                            {type: 'keyword', value: 'let'},
                            {type: 'identifier', value: 'fieldValue'},
                            {type: 'symbol', value: '='},
                            {type: 'expression', children: [
                                {type: 'term', children: [
                                    {type: 'identifier', value: 'argValue'}
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
                ]}
            ]},
            {type: 'symbol', value: '}'}
        ]},
        lines: [
            'function TestClass.setFieldValue 0',
            'push argument 0',
            'pop pointer 0',
            'push argument 1',
            'pop this 0',
            'push constant 0',
            'return'
        ]
    },
    {
        fn: node => {
            const symbolTable = new SymbolTable();
            symbolTable.className = 'TestClass';
            return compiler.compileSubroutineDec(node, symbolTable);
        },
        node: {type: 'subroutineDec', children: [
            {type: 'keyword', value: 'function'},
            {type: 'keyword', value: 'void'},
            {type: 'identifier', value: 'testFn'},
            {type: 'symbol', value: '('},
            {type: 'parameterList', children: [
                {type: 'keyword', value: 'Array'},
                {type: 'identifier', value: 'testArg'}
            ]},
            {type: 'symbol', value: ')'},
            {type: 'subroutineBody', children: [
                {type: 'symbol', value: '{'},
                {type: 'statements', children: [
                    {type: 'letStatement', children: [
                        {type: 'keyword', value: 'let'},
                        {type: 'identifier', value: 'testArg'},
                        {type: 'symbol', value: '['},
                        {type: 'expression', children: [
                            {type: 'term', children: [
                                {type: 'integerConstant', value: 10}
                            ]}
                        ]},
                        {type: 'symbol', value: ']'},
                        {type: 'symbol', value: '='},
                        {type: 'expression', children: [
                            {type: 'term', children: [
                                {type: 'identifier', value: 'testArg'},
                                {type: 'symbol', value: '['},
                                {type: 'expression', children: [
                                    {type: 'term', children: [
                                        {type: 'integerConstant', value: 20}
                                    ]}
                                ]},
                                {type: 'symbol', value: ']'}
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
            ]}
        ]},
        lines: [
            'function TestClass.testFn 0',
            'push argument 0',
            'push constant 20',
            'add',
            'pop pointer 1',
            'push that 0',
            'push argument 0',
            'push constant 10',
            'add',
            'pop pointer 1',
            'pop that 0',
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
