import SymbolTable from './symbol-table';

const assert = require('assert');

const table = new SymbolTable();

// Test class scope.

assert.strictEqual(table.count('static'), 0);
assert.strictEqual(table.count('field'), 0);
assert.strictEqual(table.has('var0'), false);
assert.strictEqual(table.has('var1'), false);
assert.strictEqual(table.has('var2'), false);

table.set('var0', {kind: 'static', type: 'int'});
table.set('var1', {kind: 'field', type: 'boolean'});
table.set('var2', {kind: 'static', type: 'char'});

assert.strictEqual(table.count('static'), 2);
assert.strictEqual(table.count('field'), 1);
assert.strictEqual(table.has('var0'), true);
assert.strictEqual(table.has('var1'), true);
assert.strictEqual(table.has('var2'), true);
assert.deepStrictEqual(table.get('var0'), {kind: 'static', type: 'int', index: 0});
assert.deepStrictEqual(table.get('var1'), {kind: 'field', type: 'boolean', index: 0});
assert.deepStrictEqual(table.get('var2'), {kind: 'static', type: 'char', index: 1});

// Test subroutine scope.

table.startSubroutine();

assert.strictEqual(table.count('argument'), 0);
assert.strictEqual(table.count('var'), 0);
assert.strictEqual(table.has('var3'), false);
assert.strictEqual(table.has('var4'), false);
assert.strictEqual(table.has('var5'), false);

table.set('var3', {kind: 'argument', type: 'boolean'});
table.set('var4', {kind: 'argument', type: 'char'});
table.set('var5', {kind: 'var', type: 'int'});

assert.strictEqual(table.count('argument'), 2);
assert.strictEqual(table.count('var'), 1);
assert.strictEqual(table.has('var3'), true);
assert.strictEqual(table.has('var4'), true);
assert.strictEqual(table.has('var5'), true);
assert.deepStrictEqual(table.get('var3'), {kind: 'argument', type: 'boolean', index: 0});
assert.deepStrictEqual(table.get('var4'), {kind: 'argument', type: 'char', index: 1});
assert.deepStrictEqual(table.get('var5'), {kind: 'var', type: 'int', index: 0});

table.startSubroutine();

assert.strictEqual(table.count('argument'), 0);
assert.strictEqual(table.count('var'), 0);
assert.strictEqual(table.has('var3'), false);
assert.strictEqual(table.has('var4'), false);
assert.strictEqual(table.has('var5'), false);

// Test nested scopes.

table.set('var2', {kind: 'var', type: 'int'});

assert.strictEqual(table.count('var'), 1);
assert.strictEqual(table.has('var2'), true);
assert.deepStrictEqual(table.get('var2'), {kind: 'var', type: 'int', index: 0});

table.startSubroutine();

assert.strictEqual(table.count('var'), 0);
assert.strictEqual(table.has('var2'), true);
assert.deepStrictEqual(table.get('var2'), {kind: 'static', type: 'char', index: 1});

console.log('Tests passed.');
