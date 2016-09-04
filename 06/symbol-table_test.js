import SymbolTable from './symbol-table';

const assert = require('assert');

const table = new SymbolTable();

assert.strictEqual(table.get('SCREEN'), 16384);

assert.strictEqual(table.has('LOOP'), false);

table.set('LOOP', 16384);

assert.strictEqual(table.has('LOOP'), true);
assert.strictEqual(table.get('LOOP'), 16384);

console.log('Tests passed.');
