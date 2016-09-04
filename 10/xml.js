const escapes = {
    '<': '&lt;',
    '>': '&gt;',
    '&': '&amp;'
};

const escapeValue = value => escapes.hasOwnProperty(value) ? escapes[value] : value;

const tokenToXml = token => `<${token.type}> ${escapeValue(token.value)} </${token.type}>`;

export const tokensToXml = tokens =>
`<tokens>
${tokens.map(tokenToXml).join('\n')}
</tokens>
`;

const pad = depth => '  '.repeat(depth);

const leafNodeToXml = (node, depth) => pad(depth) + tokenToXml(node);

const nonLeafNodeToXml = (node, depth) => {
    const padding = pad(depth);
    let xml = `${padding}<${node.type}>`;
    if (node.children.length) {
        xml += '\n' + node.children.map(child => nodeToXml(child, depth + 1)).join('\n');
    }
    xml += `\n${padding}</${node.type}>`;
    return xml;
};

const nodeToXml = (node, depth) =>
    node.hasOwnProperty('value') ? leafNodeToXml(node, depth) : nonLeafNodeToXml(node, depth);

export const treeToXml = tree => nodeToXml(tree, 0) + '\n';
