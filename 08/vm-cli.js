import {bootstrap, translate} from './vm';

const fs = require('fs');
const path = require('path');

const vmPaths = process.argv.slice(2, process.argv.length - 1);
const asmPath = process.argv[process.argv.length - 1];

console.log(`Translate ${vmPaths.join(', ')} into ${asmPath}`);

let hasSysInit = false;
const asms = [];

for (const vmPath of vmPaths) {
    const staticPrefix = path.basename(vmPath, '.vm');
    const vmCode = fs.readFileSync(vmPath, {encoding: 'utf8'});

    hasSysInit = hasSysInit || /^\s*function\s+Sys\.init\s+0\s*$/m.test(vmCode);

    // For debugging purposes, insert the VM source path as a comment.
    const asm = translate(staticPrefix, vmCode);
    asms.push('//\n// Translated from ' + vmPath + '\n//\n', asm);
}

// Only insert the bootstrap code if the VM code exposes a Sys.init function. Required to pass both
// the tests that expect the bootstrap code to be implemented, and the tests that expect it to not
// be implemented.
if (hasSysInit) {
    console.log('Sys.init found, add bootstrap code');
    asms.splice(0, 0, bootstrap());
} else {
    console.log('Sys.init not found, skip bootstrap code');
}

const asm = asms.join('\n');

fs.writeFileSync(asmPath, asm, {encoding: 'utf8'});
