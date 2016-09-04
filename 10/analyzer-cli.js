import tokenize from './tokenizer';
import parse from './parser';
import {tokensToXml, treeToXml} from './xml';

const fs = require('fs');

const jackPath = process.argv[2];
const tokenizedPath = process.argv[3];
const parsedPath = process.argv[4];

const jack = fs.readFileSync(jackPath, {encoding: 'utf8'});

// Tokenize.
console.log(`Tokenize ${jackPath} into ${tokenizedPath}`);
const tokens = tokenize(jack);
const tokenizedXml = tokensToXml(tokens);
fs.writeFileSync(tokenizedPath, tokenizedXml, {encoding: 'utf8'});

// Parse.
console.log(`Parse into ${parsedPath}`);
const tree = parse(tokens);
const parsedXml = treeToXml(tree);
fs.writeFileSync(parsedPath, parsedXml, {encoding: 'utf8'});
