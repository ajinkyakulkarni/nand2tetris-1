import tokenize from './tokenizer';
import parse from './parser';

export default function compile(jack) {
    const tokens = tokenize(jack);
    const node = parse(tokens);
    return compileClass(node).join('\n') + '\n';
}

export function compileClass({children}) {
    const compiledLines = [];
    let className;

    for (const child of children) {
        switch (child.type) {
            case 'identifier':
                className = child.value;
                break;

            case 'subroutineDec':
                compiledLines.push(...compileSubroutineDec(child, className));
                break;
        }
    }

    return compiledLines;
}

export function compileSubroutineDec({children}, className) {
    const compiledLines = [];

    const functionType = children[0].value;
    const functionName = children[2].value;
    const numArguments = children[4].children.length;

    switch (functionType) {
        case 'function':
            compiledLines.push(`function ${className}.${functionName} ${numArguments}`);
            break;
    }

    const subroutineBody = children[6];
    compiledLines.push(...compileSubroutineBody(subroutineBody));

    return compiledLines;
}

export function compileSubroutineBody({children}) {
    const compiledLines = [];

    for (const child of children) {
        switch (child.type) {
            case 'varDec':
                // TODO
                break;

            case 'statements':
                compiledLines.push(...compileStatements(child));
                break;
        }
    }

    return compiledLines;
}

export function compileStatements({children}) {
    const compiledLines = [];

    for (const child of children) {
        switch (child.type) {
            case 'letStatement':
                // TODO
                break;

            case 'ifStatement':
                // TODO
                break;

            case 'whileStatement':
                // TODO
                break;

            case 'doStatement':
                compiledLines.push(...compileDoStatement(child));
                break;

            case 'returnStatement':
                compiledLines.push(...compileReturnStatement(child));
                break;
        }
    }

    return compiledLines;
}

export function compileDoStatement({children}) {
    const subroutineCallNodes = children.slice(1, children.length - 1);
    return [...compileSubroutineCall(subroutineCallNodes), 'pop temp 0'];
}

export function compileSubroutineCall(nodes) {
    const compiledLines = [];
    let functionName, expressionList;

    if (nodes[1].value === '(') {
        functionName = nodes[0].value;
        expressionList = nodes[2];
    } else {
        functionName = nodes[0].value + nodes[1].value + nodes[2].value;
        expressionList = nodes[4];
    }

    compiledLines.push(
        ...compileExpressionList(expressionList),
        `call ${functionName} ${expressionList.children.length}`
    );

    return compiledLines;
}

export function compileExpressionList({children}) {
    const compiledLines = [];

    for (const child of children) {
        if (child.type === 'expression') {
            compiledLines.push(...compileExpression(child));
        }
    }

    return compiledLines;
}

export function compileExpression({children}) {
    const compiledLines = compileTerm(children[0]);

    if (children.length > 1) {
        compiledLines.push(...compileTerm(children[2]), ...compileOp(children[1]));
    }

    return compiledLines;
}

export function compileTerm({children}) {
    switch (children[0].type) {
        case 'integerConstant':
            return [`push constant ${children[0].value}`];

        case 'symbol':
            if (children[0].value === '(') {
                return compileExpression(children[1]);
            }
            return [...compileTerm(children[1]), ...compileOp(children[0])];
    }
}

export function compileOp({value}) {
    switch (value) {
        case '*': return ['call Math.multiply 2'];
        case '+': return ['add'];
    }
}

export function compileReturnStatement({children}) {
    const compiledLines = [];

    if (children[1].type === 'expression') {
        // TODO
    } else {
        compiledLines.push('push constant 0');
    }

    compiledLines.push('return');

    return compiledLines;
}
