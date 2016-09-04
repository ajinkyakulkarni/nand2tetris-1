import compile from './compiler';

const fs = require('fs');

const jackPath = process.argv[2];
const vmPath = process.argv[3];

const jack = fs.readFileSync(jackPath, {encoding: 'utf8'});

console.log(`Compile ${jackPath} into ${vmPath}`);

const vm = compile(jack);

fs.writeFileSync(vmPath, vm, {encoding: 'utf8'});
