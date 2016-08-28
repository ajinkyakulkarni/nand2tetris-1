const popD = ['@SP', 'A=M-1', 'D=M', '@SP', 'M=M-1'];
const pushD = ['@SP', 'A=M', 'M=D', '@SP', 'M=M+1'];

export default function translate(command) {
    switch (command.type) {
        case 'arithmetic':
            return translateArithmetic(command.operation);
        case 'push':
            return translatePush(command.args);
    }
}

function translateArithmetic(operation) {
    switch (operation) {
        case 'add':
            return [...popD, 'A=M-1', 'M=M+D'];
    }
}

function translatePush(args) {
    if (args[0] === 'constant') {
        const value = parseInt(args[1], 10);
        return ['@' + value, 'D=A', ...pushD];
    }
}
