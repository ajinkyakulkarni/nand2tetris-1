import SymbolMap from './symbol';

const assert = require('assert');

const map = new SymbolMap();

assert.strictEqual(map.get('SCREEN'), 16384);

assert.strictEqual(map.has('LOOP'), false);

map.set('LOOP', 16384);

assert.strictEqual(map.has('LOOP'), true);
assert.strictEqual(map.get('LOOP'), 16384);

console.log('Tests passed.');
