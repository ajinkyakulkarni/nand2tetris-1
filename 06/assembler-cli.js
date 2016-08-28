import assemble from './assembler';

const fs = require('fs');

const asmPath = process.argv[2];
const hackPath = asmPath.replace(/\.asm$/, '.hack');

console.log(`Assemble ${asmPath} into ${hackPath}`);

const assembly = fs.readFileSync(asmPath, {encoding: 'utf8'});
const binary = assemble(assembly);

fs.writeFileSync(hackPath, binary, {encoding: 'utf8'});
