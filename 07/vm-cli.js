import translate from './vm';

const fs = require('fs');

const vmPath = process.argv[2];
const asmPath = vmPath.replace(/\.vm$/, '.asm');

console.log(`Translate ${vmPath} into ${asmPath}`);

const vm = fs.readFileSync(vmPath, {encoding: 'utf8'});
const asm = translate(vm);

fs.writeFileSync(asmPath, asm, {encoding: 'utf8'});
