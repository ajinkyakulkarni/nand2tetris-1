const opSymbols = new Set(['+', '-', '*', '/', '&', '|', '<', '>', '=']);
const unaryOpSymbols = new Set(['-', '~']);
const subroutineDecKeywords = new Set(['constructor', 'function', 'method']);
const classVarDecKeywords = new Set(['static', 'field']);
const constantKeywords = new Set(['true', 'false', 'null', 'this']);

const isSymbol = (token, value) =>
    token && token.type === 'symbol' && token.value === value;

const isOpSymbol = token =>
    token && token.type === 'symbol' && opSymbols.has(token.value);

const isUnaryOpSymbol = token =>
    token && token.type === 'symbol' && unaryOpSymbols.has(token.value);

const isKeyword = (token, value = undefined) =>
    token && token.type === 'keyword' && (value === undefined || token.value === value);

const isSubroutineDecKeyword = token =>
    token && token.type === 'keyword' && subroutineDecKeywords.has(token.value);

const isClassVarDecKeyword = token =>
    token && token.type === 'keyword' && classVarDecKeywords.has(token.value);

const isConstant = token =>
    token && (token.type === 'integerConstant' || token.type === 'stringConstant' ||
        token.type === 'keyword' && constantKeywords.has(token.value));

const isIdentifier = token => token && token.type === 'identifier';

export default function parse(tokens) {
    return parseClass(tokens, 0).node;
}

export function parseClass(tokens, start) {
    const children = [];

    children.push(tokens[start++]); // keyword: class
    children.push(tokens[start++]); // identifier: className
    children.push(tokens[start++]); // symbol: {

    while (true) {
        const {node, nextTokenIndex} = parseOptionalClassVarDec(tokens, start);
        if (!node) {
            break;
        }
        children.push(node);
        start = nextTokenIndex;
    }

    while (true) {
        const {node, nextTokenIndex} = parseOptionalSubroutineDec(tokens, start);
        if (!node) {
            break;
        }
        children.push(node);
        start = nextTokenIndex;
    }

    children.push(tokens[start++]); // Symbol: }

    return {
        node: {type: 'class', children},
        nextTokenIndex: start
    };
}

export function parseOptionalClassVarDec(tokens, start) {
    if (!isClassVarDecKeyword(tokens[start])) {
        return {node: null, nextTokenIndex: start};
    }

    const children = [];

    while (!isSymbol(tokens[start], ';')) {
        children.push(tokens[start++]);
    }

    children.push(tokens[start++]); // symbol: }

    return {
        node: {type: 'classVarDec', children},
        nextTokenIndex: start
    };
}

export function parseOptionalSubroutineDec(tokens, start) {
    if (!isSubroutineDecKeyword(tokens[start])) {
        return {node: null, nextTokenIndex: start};
    }

    const children = [];

    children.push(tokens[start++]); // keyword: constructor | function | method
    children.push(tokens[start++]); // keyword | identifier: void | type
    children.push(tokens[start++]); // identifier: subroutineName
    children.push(tokens[start++]); // symbol: (

    const parameterList = parseParameterList(tokens, start);
    children.push(parameterList.node);
    start = parameterList.nextTokenIndex;

    children.push(tokens[start++]); // symbol: )

    const subroutineBody = parseSubroutineBody(tokens, start);
    children.push(subroutineBody.node);
    start = subroutineBody.nextTokenIndex;

    return {
        node: {type: 'subroutineDec', children},
        nextTokenIndex: start
    };
}

export function parseParameterList(tokens, start) {
    const children = [];

    while (!isSymbol(tokens[start], ')')) {
        children.push(tokens[start++]);
    }

    return {
        node: {type: 'parameterList', children},
        nextTokenIndex: start
    };
}

export function parseSubroutineBody(tokens, start) {
    const children = [];

    children.push(tokens[start++]); // symbol: {

    while (true) {
        const {node, nextTokenIndex} = parseOptionalVarDec(tokens, start);
        if (!node) {
            break;
        }
        children.push(node);
        start = nextTokenIndex;
    }

    const statements = parseStatements(tokens, start);
    children.push(statements.node);
    start = statements.nextTokenIndex;

    children.push(tokens[start++]); // symbol: }

    return {
        node: {type: 'subroutineBody', children},
        nextTokenIndex: start
    };
}

export function parseOptionalVarDec(tokens, start) {
    if (!isKeyword(tokens[start], 'var')) {
        return {node: null, nextTokenIndex: start};
    }

    const children = [];

    while (!isSymbol(tokens[start], ';')) {
        children.push(tokens[start++]);
    }

    children.push(tokens[start++]); // symbol: ;

    return {
        node: {type: 'varDec', children},
        nextTokenIndex: start
    };
}

export function parseStatements(tokens, start) {
    const children = [];

    while (true) {
        const {node, nextTokenIndex} = parseOptionalStatement(tokens, start);
        if (!node) {
            break;
        }
        children.push(node);
        start = nextTokenIndex;
    }

    return {
        node: {type: 'statements', children},
        nextTokenIndex: start
    };
}

export function parseOptionalStatement(tokens, start) {
    if (isKeyword(tokens[start])) {
        switch (tokens[start].value) {
            case 'let':    return parseLetStatement(tokens, start);
            case 'if':     return parseIfStatement(tokens, start);
            case 'while':  return parseWhileStatement(tokens, start);
            case 'do':     return parseDoStatement(tokens, start);
            case 'return': return parseReturnStatement(tokens, start);
        }
    }

    return {node: null, nextTokenIndex: start};
}

export function parseLetStatement(tokens, start) {
    const children = [];

    children.push(tokens[start++]); // keyword: let
    children.push(tokens[start++]); // identifier: varName

    if (isSymbol(tokens[start], '[')) {
        children.push(tokens[start++]); // symbol: [

        const expression = parseExpression(tokens, start);
        children.push(expression.node);
        start = expression.nextTokenIndex;

        children.push(tokens[start++]); // symbol: ]
    }

    children.push(tokens[start++]); // symbol: =

    const expression = parseExpression(tokens, start);
    children.push(expression.node);
    start = expression.nextTokenIndex;

    children.push(tokens[start++]); // symbol: ;

    return {
        node: {type: 'letStatement', children},
        nextTokenIndex: start
    };
}

export function parseIfStatement(tokens, start) {
    const children = [];

    children.push(tokens[start++]); // keyword: if
    children.push(tokens[start++]); // symbol: (

    const expression = parseExpression(tokens, start);
    children.push(expression.node);
    start = expression.nextTokenIndex;

    children.push(tokens[start++]); // symbol: )
    children.push(tokens[start++]); // symbol: {

    const statements = parseStatements(tokens, start);
    children.push(statements.node);
    start = statements.nextTokenIndex;

    children.push(tokens[start++]); // symbol: }

    if (isKeyword(tokens[start], 'else')) {
        children.push(tokens[start++]); // keyword: else
        children.push(tokens[start++]); // symbol: {

        const statements = parseStatements(tokens, start);
        children.push(statements.node);
        start = statements.nextTokenIndex;

        children.push(tokens[start++]); // symbol: }
    }

    return {
        node: {type: 'ifStatement', children},
        nextTokenIndex: start
    };
}

export function parseWhileStatement(tokens, start) {
    const children = [];

    children.push(tokens[start++]); // keyword: if
    children.push(tokens[start++]); // symbol: (

    const expression = parseExpression(tokens, start);
    children.push(expression.node);
    start = expression.nextTokenIndex;

    children.push(tokens[start++]); // symbol: )
    children.push(tokens[start++]); // symbol: {

    const statements = parseStatements(tokens, start);
    children.push(statements.node);
    start = statements.nextTokenIndex;

    children.push(tokens[start++]); // symbol: }

    return {
        node: {type: 'whileStatement', children},
        nextTokenIndex: start
    };
}

export function parseDoStatement(tokens, start) {
    const children = [];

    children.push(tokens[start++]); // keyword: do

    const subroutineCall = parseOptionalSubroutineCall(tokens, start);
    if (subroutineCall.node) {
        children.push(subroutineCall.node);
        start = subroutineCall.nextTokenIndex;
    }

    children.push(tokens[start++]); // symbol: ;

    return {
        node: {type: 'doStatement', children},
        nextTokenIndex: start
    };
}

export function parseReturnStatement(tokens, start) {
    const children = [];

    children.push(tokens[start++]); // keyword: return

    if (!isSymbol(tokens[start], ';')) {
        const expression = parseExpression(tokens, start);
        children.push(expression.node);
        start = expression.nextTokenIndex;
    }

    children.push(tokens[start++]); // symbol: ;

    return {
        node: {type: 'returnStatement', children},
        nextTokenIndex: start
    };
}

export function parseExpression(tokens, start) {
    const children = [];

    const term = parseTerm(tokens, start);
    children.push(term.node);
    start = term.nextTokenIndex;

    if (isOpSymbol(tokens[start])) {
        children.push(tokens[start++]); // symbol: op
        const term = parseTerm(tokens, start);
        children.push(term.node);
        start = term.nextTokenIndex;
    }

    return {
        node: {type: 'expression', children},
        nextTokenIndex: start
    };
}

export function parseTerm(tokens, start) {
    const children = [];

    if (isConstant(tokens[start])) {
        children.push(tokens[start++]);
    } else if (isUnaryOpSymbol(tokens[start])) {
        children.push(tokens[start++]); // keyword: op

        const term = parseTerm(tokens, start);
        children.push(term.node);
        start = term.nextTokenIndex;
    } else if (isSymbol(tokens[start], '(')) {
        children.push(tokens[start++]); // symbol: (

        const expression = parseExpression(tokens, start);
        children.push(expression.node);
        start = expression.nextTokenIndex;

        children.push(tokens[start++]); // symbol: )
    } else {
        const subroutineCall = parseOptionalSubroutineCall(tokens, start);

        if (subroutineCall.node) {
            children.push(subroutineCall.node);
            start = subroutineCall.nextTokenIndex;
        } else {
            children.push(tokens[start++]); // identifier: varName

            if (isSymbol(tokens[start], '[')) {
                children.push(tokens[start++]); // symbol: [

                const expression = parseExpression(tokens, start);
                children.push(expression.node);
                start = expression.nextTokenIndex;

                children.push(tokens[start++]); // symbol: ]
            }
        }
    }

    return {
        node: {type: 'term', children},
        nextTokenIndex: start
    };
}

export function parseOptionalSubroutineCall(tokens, start) {
    const pattern1 = isIdentifier(tokens[start]) && isSymbol(tokens[start + 1], '(');

    const pattern2 = isIdentifier(tokens[start]) && isSymbol(tokens[start + 1], '.') &&
        isIdentifier(tokens[start + 2]) && isSymbol(tokens[start + 3], '(');

    if (!pattern1 && !pattern2) {
        return {node: null, nextTokenIndex: start};
    }

    const children = [];

    while (!isSymbol(tokens[start], '(')) {
        children.push(tokens[start++]);
    }

    children.push(tokens[start++]); // symbol: (

    const expressionList = parseExpressionList(tokens, start);
    children.push(expressionList.node);
    start = expressionList.nextTokenIndex;

    children.push(tokens[start++]); // symbol: )

    return {
        node: {type: 'subroutineCall', children},
        nextTokenIndex: start
    };
}

export function parseExpressionList(tokens, start) {
    const children = [];

    while (!isSymbol(tokens[start], ')')) {
        const expression = parseExpression(tokens, start);
        children.push(expression.node);
        start = expression.nextTokenIndex;

        if (isSymbol(tokens[start], ',')) {
            children.push(tokens[start++]); // symbol: ,
        }
    }

    return {
        node: {type: 'expressionList', children},
        nextTokenIndex: start
    };
}











