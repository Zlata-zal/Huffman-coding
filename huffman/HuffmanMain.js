class NodeTree {
    constructor(char = null, freq = 0, left = null, right = null) {
        this.char = char;
        this.freq = freq;
        this.left = left;
        this.right = right;
    }
}
let tree = null;
let codesTable = {};
let encodedString = "";

function buildHuffmanTree(text) {
    const freqCount = {};
    for (let char of text) {
        freqCount[char] = (freqCount[char] || 0) + 1;
    }

    let heap = Object.entries(freqCount).map(([char, freq]) => new NodeTree(char, freq));
    heap.sort((a, b) => a.freq - b.freq);

    while (heap.length > 1) {
        const left = heap.shift();
        const right = heap.shift();

        const merged = new NodeTree(null, left.freq + right.freq);
        merged.left = left;
        merged.right = right;

        heap.push(merged);
        heap.sort((a, b) => a.freq - b.freq);
    }

    return heap[0];
}

function generateCodes(node, prefix = "", codebook = {}) {
    if (!node) return codebook;

    if (node.char !== null) {
        codebook[node.char] = prefix;
    }
    generateCodes(node.left, prefix + "0", codebook);
    generateCodes(node.right, prefix + "1", codebook);
    return codebook;
}


function compress(text, codebook) {
    return text.split("").map(char => codebook[char]).join("");
}


function decompress(encodedStr, root) {
    let result = "";
    let currentNode = root;

    for (let bit of encodedStr) {
        let node = bit === "0" ? currentNode.left : currentNode.right;
        if (node.char !== null) {
            result += node.char;
            currentNode = root;
        } else {
            currentNode = node;
        }
    }
    return result;
}

function treeToString(node, prefix = "") {
    if (!node) return "";
    let str = node.char !== null
        ? `${prefix}'${node.char}' (${node.freq})\n`
        : `${prefix}* (${node.freq})\n`;
    str += treeToString(node.left, prefix + "  ");
    str += treeToString(node.right, prefix + "  ");
    return str;
}

export { NodeTree, buildHuffmanTree, generateCodes, compress, decompress, treeToString };