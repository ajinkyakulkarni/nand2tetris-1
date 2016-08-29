export default function parse(line) {
    const comment = line.indexOf('//');

    if (comment >= 0) {
        line = line.substring(0, comment);
    }

    line = line.replace(/\s/g, '');

    if (!line) {
        return null;
    }

    switch (line[0]) {
        case '@':
            return {
                type: 'A',
                symbol: line.substring(1)
            };

        case '(':
            return {
                type: 'L',
                symbol: line.substring(1, line.length - 1)
            };

        default: {
            const equal = line.indexOf('=');
            const semicolon = line.indexOf(';');
            return {
                type: 'C',
                dest: equal < 0 ? '' : line.substring(0, equal),
                comp: line.substring(equal + 1, semicolon < 0 ? undefined : semicolon),
                jump: semicolon < 0 ? '' : line.substring(semicolon + 1)
            };
        }
    }
}
