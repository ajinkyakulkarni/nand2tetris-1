import translate from './vm';

const fs = require('fs');
const path = require('path');

const vmPath = process.argv[2];
const asmPath = vmPath.replace(/\.vm$/, '.asm');

console.log(`Translate ${vmPath} into ${asmPath}`);

const staticPrefix = path.basename(vmPath, '.vm');
const vmCode = fs.readFileSync(vmPath, {encoding: 'utf8'});
const asm = translate(staticPrefix, vmCode);

fs.writeFileSync(asmPath, asm, {encoding: 'utf8'});
