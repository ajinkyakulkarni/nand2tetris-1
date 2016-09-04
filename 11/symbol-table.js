export default class SymbolTable {
    constructor() {
        console.log('constructor');
        this.classScope = new Map();
        this.startSubroutine();
    }

    startSubroutine() {
        console.log('startSubroutine');
        this.subroutineScope = new Map();
        this.nextWhileIndex = 0;
        this.nextIfIndex = 0;
    }

    has(name) {
        console.log('has', name);
        return this.subroutineScope.has(name) || this.classScope.has(name);
    }

    get(name) {
        console.log('get', name);
        return this.subroutineScope.has(name) ?
            this.subroutineScope.get(name) :
            this.classScope.get(name);
    }

    mapForKind(kind) {
        switch (kind) {
            case 'static':
            case 'field':
                return this.classScope;

            case 'argument':
            case 'var':
                return this.subroutineScope;
        }
    }

    count(kind) {
        let count = 0;

        for (const properties of this.mapForKind(kind).values()) {
            if (properties.kind === kind) {
                count++;
            }
        }

        return count;
    }

    set(name, {kind, type}) {
        console.log('set', name, kind, type);
        const properties = {kind, type, index: this.count(kind)};
        this.mapForKind(kind).set(name, properties);
    }
}
