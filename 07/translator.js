const popD = ['@SP', 'A=M-1', 'D=M', '@SP', 'M=M-1'];
const pushD = ['@SP', 'A=M', 'M=D', '@SP', 'M=M+1'];

let nextLabelIndex = 0;

function nextLabel() {
    nextLabelIndex++;
    return 'LABEL' + (nextLabelIndex - 1);
}

function translateArithmetic(operation) {
    switch (operation) {
        case 'add':
            return [...popD, 'A=M-1', 'M=M+D'];

        case 'sub':
            return [...popD, 'A=M-1', 'M=M-D'];

        case 'neg':
            return ['@SP', 'A=M-1', 'M=-M'];

        case 'eq': {
            const noReset = nextLabel();
            return [
                ...popD, 'A=M-1', 'M=M-D', 'M=!M',
                // If M == -1 then we are done, otherwise set M to 0.
                'D=M+1', '@' + noReset, 'D;JEQ',
                '@SP', 'A=M-1', 'M=0',
                '(' + noReset + ')'
            ];
        }

        case 'gt': {
            const noReset = nextLabel();
            return [
                ...popD, 'A=M-1', 'D=M-D', 'M=-1',
                // If D > 0 then we are done, otherwise set M to 0.
                '@' + noReset, 'D;JGT',
                '@SP', 'A=M-1', 'M=0',
                '(' + noReset + ')'
            ];
        }

        case 'lt': {
            const noReset = nextLabel();
            return [
                ...popD, 'A=M-1', 'D=M-D', 'M=-1',
                // If D < 0 then we are done, otherwise set M to 0.
                '@' + noReset, 'D;JLT',
                '@SP', 'A=M-1', 'M=0',
                '(' + noReset + ')'
            ];
        }

        case 'and':
            return [...popD, 'A=M-1', 'M=M&D'];

        case 'or':
            return [...popD, 'A=M-1', 'M=M|D'];

        case 'not':
            return ['@SP', 'A=M-1', 'M=!M'];
    }
}

function translatePush(args) {
    if (args[0] === 'constant') {
        const value = parseInt(args[1], 10);
        return ['@' + value, 'D=A', ...pushD];
    }
}

export default function translate(command) {
    switch (command.type) {
        case 'arithmetic':
            return translateArithmetic(command.operation);
        case 'push':
            return translatePush(command.args);
    }
}