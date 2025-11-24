class NodeTree {
    constructor(char = null, freq = 0, left = null, right = null) {
        this.char = char;
        this.freq = freq;
        this.left = left;
        this.right = right;
    }
}
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

function buildHuffmanTreeWithSteps(text) {
    const freqCount = {};
    for (let char of text){
        freqCount[char] = (freqCount[char] || 0) + 1;
    }
    let heap = Object.entries(freqCount).map(([char, freq]) => new NodeTree(char, freq));
    heap.sort((a, b) => a.freq - b.freq);
    let steps = [];
    steps.push({
    description: "Исходные частоты символов",
    nodes: heap.map(node => ({char: node.char, freq: node.freq}))
});
    
    while (heap.length > 1) {
        const left = heap.shift();
        const right = heap.shift();
        const merged = new NodeTree(null, left.freq + right.freq, left, right);
        steps.push({
            description: `Объединяем '${left.char ?? "*"}' (${left.freq}) и '${right.char ?? "*"}' (${right.freq}) → ${merged.freq}`,
            nodes: [...heap.map(n => ({ char: n.char, freq: n.freq })), { char: "*", freq: merged.freq }]
    });
        heap.push(merged);
        heap.sort((a, b) => a.freq - b.freq);
    }
    const root = heap[0];
    return { root, steps };
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

function treeToString(node, indent = "", isRight = false) {
  if (!node) return "";

  let str = "";

  if (node.right) {
    str += treeToString(node.right, indent + (isRight ? "    " : " │  "), true);
  }

  str += indent;
  str += isRight ? " ┌── " : " └── ";
  str += node.char !== null ? `'${node.char}' (${node.freq})` : `* (${node.freq})`;
  str += "\n";

  if (node.left) {
    str += treeToString(node.left, indent + (isRight ? " │  " : "    "), false);
  }

  return str;
}

function generateCodesBytes(node, prefix = "", codebook = {}) {
    if (!node) return codebook;

    if (node.char !== undefined) {
        codebook[node.char] = prefix;
    }

    generateCodesBytes(node.left, prefix + "0", codebook);
    generateCodesBytes(node.right, prefix + "1", codebook);

    return codebook;
}
function compressBytes(data, codebook) {
    let bits = "";
    for (const byte of data) bits += codebook[byte];

    const output = [];
    for (let i = 0; i < bits.length; i += 8) {
        const byteStr = bits.slice(i, i + 8).padEnd(8, "0");
        output.push(parseInt(byteStr, 2));
    }
    return new Uint8Array(output);
}
function decompressBytes(encoded, root) {
    let result = [];
    let node = root;
    const bits = Array.from(encoded).map(b => b.toString(2).padStart(8, "0")).join("");

    for (const bit of bits) {
        node = bit === "0" ? node.left : node.right;
        if (node.char !== undefined) {
            result.push(node.char);
            node = root;
        }
    }

    return new Uint8Array(result);
}
function buildHuffmanTreeBytes(data) {
    const freq = new Map();
    for (const byte of data) freq.set(byte, (freq.get(byte) || 0) + 1);

    let nodes = Array.from(freq.entries()).map(([char, count]) => ({ char, count }));

    while (nodes.length > 1) {
        nodes.sort((a, b) => a.count - b.count);
        const left = nodes.shift();
        const right = nodes.shift();
        nodes.push({ left, right, count: left.count + right.count });
    }

    return nodes[0]; // корень дерева
}






export { NodeTree, 
    buildHuffmanTree, 
    generateCodes, 
    compress, 
    decompress, 
    treeToString, 
    buildHuffmanTreeWithSteps, 
    generateCodesBytes, 
    compressBytes, 
    decompressBytes,
    buildHuffmanTreeBytes };