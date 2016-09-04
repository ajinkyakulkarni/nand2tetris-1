import tokensToXml from './xml';
import tokenize from './tokenizer';

const fs = require('fs');

// const jackPaths = process.argv.slice(2, process.argv.length - 1);

// for (const jackPath of jackPaths) {
//     const jack = fs.readFileSync(jackPath, {encoding: 'utf8'});

//     // Tokenize.
//     const tokensXmlPath = jackPath.replace(/\.jack$/, 'T.xml');
//     console.log(`Tokenize ${jackPath} into ${tokensXmlPath}`);
//     fs.writeFileSync(tokensXmlPath, tokensToXml(tokenize(jack)), {encoding: 'utf8'});

//     // Parse.
//     // TODO
// }

const jackPath = process.argv[2];
const tokenizedPath = process.argv[3];
// const parsedPath = process.argv[4];

const jack = fs.readFileSync(jackPath, {encoding: 'utf8'});

// Tokenize.
console.log(`Tokenize ${jackPath} into ${tokenizedPath}`);
const tokens = tokenize(jack);
const tokenizedXml = tokensToXml(tokens);
fs.writeFileSync(tokenizedPath, tokensToXml(tokenize(jack)), {encoding: 'utf8'});

// Parse.
// TODO
