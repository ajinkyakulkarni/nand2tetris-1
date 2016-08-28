export default function parse(line) {
    const comment = line.indexOf('//');

    if (comment >= 0) {
        line = line.substring(0, comment);
    }
    
    line = line.trim();

    if (!line) {
        return null;
    }

    const elements = line.split(/\s+/);

    switch (elements[0]) {
        case 'add':
            return {type: 'arithmetic', operation: 'add'};

        case 'sub':
            return {type: 'arithmetic', operation: 'sub'};

        case 'neg':
            return {type: 'arithmetic', operation: 'neg'};

        case 'eq':
            return {type: 'arithmetic', operation: 'eq'};

        case 'gt':
            return {type: 'arithmetic', operation: 'gt'};

        case 'lt':
            return {type: 'arithmetic', operation: 'lt'};

        case 'and':
            return {type: 'arithmetic', operation: 'and'};

        case 'or':
            return {type: 'arithmetic', operation: 'or'};

        case 'not':
            return {type: 'arithmetic', operation: 'not'};

        case 'push':
            return {type: 'push', args: elements.slice(1)};
    }
}
