const escapes = {
    '<': '&lt;',
    '>': '&gt;',
    '&': '&amp;'
};

const escapeValue = value => escapes.hasOwnProperty(value) ? escapes[value] : value;

const tokenToXml = token => `<${token.type}> ${escapeValue(token.value)} </${token.type}>`;

const tokensToXml = tokens =>
`<tokens>
${tokens.map(tokenToXml).join('\n')}
</tokens>
`;

export default tokensToXml;
