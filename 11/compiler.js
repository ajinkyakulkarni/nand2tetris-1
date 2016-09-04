import tokenize from './tokenizer';
import parse from './parser';
import SymbolTable from './symbol-table';

export default function compile(jack) {
    const tokens = tokenize(jack);
    const node = parse(tokens);
    return compileClass(node).join('\n') + '\n';
}

export function compileClass({children}) {
    const symbolTable = new SymbolTable();
    const compiledLines = [];
    let className;

    for (const child of children) {
        switch (child.type) {
            case 'identifier':
                className = child.value;
                break;

            case 'classVarDec':
                processVarDec(child, symbolTable);
                break;

            case 'subroutineDec':
                compiledLines.push(...compileSubroutineDec(child, symbolTable, className));
                break;
        }
    }

    return compiledLines;
}

export function compileSubroutineDec({children}, symbolTable, className) {
    const subroutineName = children[2].value;
    processParameterList(children[4], symbolTable);
    const subroutineBodyLines = compileSubroutineBody(children[6], symbolTable);
    const numLocals = symbolTable.count('var');
    return [`function ${className}.${subroutineName} ${numLocals}`, ...subroutineBodyLines];
}

export function compileSubroutineBody({children}, symbolTable) {
    const compiledLines = [];

    for (const child of children) {
        switch (child.type) {
            case 'varDec':
                processVarDec(child, symbolTable);
                break;

            case 'statements':
                compiledLines.push(...compileStatements(child, symbolTable));
                break;
        }
    }

    return compiledLines;
}

export function compileStatements({children}, symbolTable) {
    const compiledLines = [];

    for (const child of children) {
        switch (child.type) {
            case 'letStatement':
                compiledLines.push(...compileLetStatement(child, symbolTable));
                break;

            case 'ifStatement':
                compiledLines.push(...compileIfStatement(child, symbolTable));
                break;

            case 'whileStatement':
                compiledLines.push(...compileWhileStatement(child, symbolTable));
                break;

            case 'doStatement':
                compiledLines.push(...compileDoStatement(child, symbolTable));
                break;

            case 'returnStatement':
                compiledLines.push(...compileReturnStatement(child, symbolTable));
                break;
        }
    }

    return compiledLines;
}

export function compileLetStatement({children}, symbolTable) {
    return [
        ...compileExpression(children[children.length - 2], symbolTable),
        ...popTo(children[1], symbolTable)
    ];
}

export function compileWhileStatement({children}, symbolTable) {
    const index = symbolTable.nextWhileIndex++;

    return [
        'label WHILE_EXP' + index,
        ...compileExpression(children[2], symbolTable),
        'not',
        'if-goto WHILE_END' + index,
        ...compileStatements(children[5], symbolTable),
        'goto WHILE_EXP' + index,
        'label WHILE_END' + index
    ];
}

export function compileIfStatement({children}, symbolTable) {
    const index = symbolTable.nextIfIndex++;

    if (children.length < 8) {
        // Simple if.
        return [
            ...compileExpression(children[2], symbolTable),
            'if-goto IF_TRUE' + index,
            'goto IF_FALSE' + index,
            'label IF_TRUE' + index,
            ...compileStatements(children[5], symbolTable),
            'label IF_FALSE' + index
        ];
    }

    // If-else. It is possible to use only 2 labels instead of 3, but since the tests rely on a
    // complete match between the outputs of the built-in compiler and this compiler, we use the
    // same implementation as the built-in compiler.
    return [
        ...compileExpression(children[2], symbolTable),
        'if-goto IF_TRUE' + index,
        'goto IF_FALSE' + index,
        'label IF_TRUE' + index,
        ...compileStatements(children[5], symbolTable),
        'goto IF_END' + index,
        'label IF_FALSE' + index,
        ...compileStatements(children[9], symbolTable),
        'label IF_END' + index
    ];
}

export function compileDoStatement({children}, symbolTable) {
    return [...compileSubroutineCall(children[1], symbolTable), 'pop temp 0'];
}

export function compileReturnStatement({children}, symbolTable) {
    return children[1].type === 'expression' ?
        [...compileExpression(children[1], symbolTable), 'return'] :
        ['push constant 0', 'return'];
}

export function compileSubroutineCall({children}, symbolTable) {
    const compiledLines = [];
    let functionName, expressionList;

    if (children[1].value === '(') {
        functionName = children[0].value;
        expressionList = children[2];
    } else {
        functionName = children[0].value + children[1].value + children[2].value;
        expressionList = children[4];
    }

    const numArguments = (expressionList.children.length + 1) / 2;

    compiledLines.push(
        ...compileExpressionList(expressionList, symbolTable),
        `call ${functionName} ${numArguments}`
    );

    return compiledLines;
}

export function compileExpressionList({children}, symbolTable) {
    const compiledLines = [];

    for (const child of children) {
        if (child.type === 'expression') {
            compiledLines.push(...compileExpression(child, symbolTable));
        }
    }

    return compiledLines;
}

export function compileExpression({children}, symbolTable) {
    const compiledLines = compileTerm(children[0], symbolTable);

    if (children.length > 1) {
        compiledLines.push(...compileTerm(children[2], symbolTable), ...compileOp(children[1]));
    }

    return compiledLines;
}

export function compileTerm({children}, symbolTable) {
    switch (children[0].type) {
        case 'integerConstant':
            return [`push constant ${children[0].value}`];

        case 'stringConstant':
            // TODO
            return;

        case 'keyword':
            return compileKeywordConstant(children[0]);

        case 'identifier':
            return pushFrom(children[0], symbolTable);

        case 'subroutineCall':
            return compileSubroutineCall(children[0], symbolTable);

        case 'symbol':
            if (children[0].value === '(') {
                return compileExpression(children[1], symbolTable);
            }
            return [...compileTerm(children[1], symbolTable), ...compileUnaryOp(children[0])];
    }
}

export function compileKeywordConstant({value}) {
    switch (value) {
        case 'true':
            return ['push constant 0', 'not'];

        case 'null':
        case 'false':
            return ['push constant 0'];

        case 'this':
            return ['push this 0'];
    }
}

export function compileOp({value}) {
    switch (value) {
        case '+': return ['add'];
        case '-': return ['sub'];
        case '*': return ['call Math.multiply 2'];
        case '/': return ['call Math.divide 2'];
        case '&': return ['and'];
        case '|': return ['or'];
        case '<': return ['lt'];
        case '>': return ['gt'];
        case '=': return ['eq'];
    }
}

export function compileUnaryOp({value}) {
    switch (value) {
        case '-': return ['neg'];
        case '~': return ['not'];
    }
}


function popTo({value: varName}, symbolTable) {
    const {kind, index} = symbolTable.get(varName);

    switch (kind) {
        case 'static':
            return [`pop static ${index}`];

        case 'field':
            // TODO
            return [];

        case 'argument':
            return [`pop argument ${index}`];

        case 'var':
            return [`pop local ${index}`];
    }
}

function pushFrom({value: varName}, symbolTable) {
    const {kind, index} = symbolTable.get(varName);

    switch (kind) {
        case 'static':
            return [`push static ${index}`];

        case 'field':
            // TODO
            return [];

        case 'argument':
            return [`push argument ${index}`];

        case 'var':
            return [`push local ${index}`];
    }
}

function processVarDec({children}, symbolTable) {
    const properties = {kind: children[0].value, type: children[1].value};

    for (let i = 2; i < children.length; i += 2) {
        const varName = children[i].value;
        symbolTable.set(varName, properties);
    }
}

function processParameterList({children}, symbolTable) {
    symbolTable.startSubroutine();

    for (let i = 0; i < children.length; i += 3) {
        const type = children[i].value;
        const varName = children[i + 1].value;
        symbolTable.set(varName, {kind: 'argument', type});
    }
}
