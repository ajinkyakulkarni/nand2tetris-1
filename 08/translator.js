const symbols = {
    local: 'LCL',
    argument: 'ARG',
    this: 'THIS',
    that: 'THAT'
};

const popD = ['@SP', 'M=M-1', 'A=M', 'D=M'];

const pushD = ['@SP', 'M=M+1', 'A=M-1', 'M=D'];

const push0 = ['@SP', 'M=M+1', 'A=M-1', 'M=0'];

const ret = [
    // Copy the return address into D, then into R14
    '@LCL', 'D=M', '@5', 'A=D-A', 'D=M',
    '@R14', 'M=D',

    // Pop the return value into D, then copy into ARG 0 (which is where the calling
    // function will expect the return value to be)
    '@SP', 'M=M-1', 'A=M', 'D=M', '@ARG', 'A=M', 'M=D',

    // Restore caller SP; original address was ARG + 1
    '@ARG', 'D=M+1', '@SP', 'M=D',

    // Restore caller THAT; original address was saved at LCL - 1
    '@LCL', 'D=M', '@1', 'A=D-A', 'D=M', '@THAT', 'M=D',

    // Restore caller THIS; original address was saved at LCL - 2
    '@LCL', 'D=M', '@2', 'A=D-A', 'D=M', '@THIS', 'M=D',

    // Restore caller ARG; original address was saved at LCL - 3
    '@LCL', 'D=M', '@3', 'A=D-A', 'D=M', '@ARG', 'M=D',

    // Restore caller LCL; original address was saved at LCL - 3
    '@LCL', 'D=M', '@4', 'A=D-A', 'D=M', '@LCL', 'M=D',

    // Goto return address
    '@R14', 'A=M', '0;JMP'
];

let nextLabelIndex = 0;

function nextLabel() {
    nextLabelIndex++;
    return 'LABEL' + (nextLabelIndex - 1);
}

function translateArithmetic(operation) {
    switch (operation) {
        case 'add':
            return [...popD, 'A=A-1', 'M=M+D'];

        case 'sub':
            return [...popD, 'A=A-1', 'M=M-D'];

        case 'neg':
            return ['@SP', 'A=M-1', 'M=-M'];

        case 'eq': {
            const noReset = nextLabel();
            return [
                ...popD, 'A=A-1', 'M=M-D', 'M=!M',
                // If M == -1 then we are done, otherwise set M to 0.
                'D=M+1', '@' + noReset, 'D;JEQ',
                '@SP', 'A=M-1', 'M=0',
                '(' + noReset + ')'
            ];
        }

        case 'gt': {
            const noReset = nextLabel();
            return [
                ...popD, 'A=A-1', 'D=M-D', 'M=-1',
                // If D > 0 then we are done, otherwise set M to 0.
                '@' + noReset, 'D;JGT',
                '@SP', 'A=M-1', 'M=0',
                '(' + noReset + ')'
            ];
        }

        case 'lt': {
            const noReset = nextLabel();
            return [
                ...popD, 'A=A-1', 'D=M-D', 'M=-1',
                // If D < 0 then we are done, otherwise set M to 0.
                '@' + noReset, 'D;JLT',
                '@SP', 'A=M-1', 'M=0',
                '(' + noReset + ')'
            ];
        }

        case 'and':
            return [...popD, 'A=A-1', 'M=M&D'];

        case 'or':
            return [...popD, 'A=A-1', 'M=M|D'];

        case 'not':
            return ['@SP', 'A=M-1', 'M=!M'];
    }
}

function fixedAddress(staticPrefix, segment, index) {
    switch (segment) {
        case 'pointer':
            return `@${3 + index}`;

        case 'static':
            return `@${staticPrefix}.${index}`;

        case 'temp':
            return `@${5 + index}`;
    }
}

function translatePush(staticPrefix, segment, index) {
    switch (segment) {
        case 'constant':
            return ['@' + index, 'D=A', ...pushD];

        case 'pointer':
        case 'static':
        case 'temp': {
            const address = fixedAddress(staticPrefix, segment, index);
            return [address, 'D=M', ...pushD];
        }

        default:
            return ['@' + symbols[segment], 'D=M', '@' + index, 'A=D+A', 'D=M', ...pushD];
    }
}

function translatePop(staticPrefix, segment, index) {
    switch (segment) {
        case 'pointer':
        case 'static':
        case 'temp': {
            const address = fixedAddress(staticPrefix, segment, index);
            return [...popD, address, 'M=D'];
        }

        default:
            return [
                // Compute target address into M[R13].
                '@' + symbols[segment], 'D=M', '@' + index, 'D=D+A', '@R13', 'M=D',
                // Pop into the target address.
                ...popD, '@R13', 'A=M', 'M=D'
            ];
    }
}

function translateFunction(name, numArguments) {
    const lines = ['(' + name + ')'];
    for (let i = 0; i < numArguments; i++) {
        lines.push(...push0);
    }
    return lines;
}

export default function translate(staticPrefix, command) {
    switch (command.type) {
        case 'arithmetic':
            return translateArithmetic(command.operation);

        case 'push':
            return translatePush(staticPrefix, command.segment, command.index);

        case 'pop':
            return translatePop(staticPrefix, command.segment, command.index);

        case 'label':
            return ['(' + command.label + ')'];

        case 'goto':
            return ['@' + command.label, '0;JMP'];

        case 'if-goto':
            return [...popD, '@' + command.label, 'D;JNE'];

        case 'function':
            return translateFunction(command.name, command.numArguments);

        case 'return':
            return ret;
    }
}
