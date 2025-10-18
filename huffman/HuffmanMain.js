import {
    NodeTree,
    buildHuffmanTree,
    buildHuffmanTreeWithSteps,
    generateCodes,
    compress,
    decompress,
    treeToString
} from '../huffman/HuffmanCreate.js'; 

let tree = null;
let codesTable = {};
let encodedString = "";

document.addEventListener("DOMContentLoaded", () => {
    const compressBtn = document.getElementById("compressBtn");
    const decompressBtn = document.getElementById("decompressBtn");
    const showTreeBtn = document.getElementById("showTreeBtn");
    const treeView = document.getElementById("treeView");
    compressBtn.addEventListener("click", () => {
        const text = document.getElementById("inputText").value.trim();
        if (!text) {
            alert("Введите текст!");
            return;
        }

        tree = buildHuffmanTree(text);
        codesTable = generateCodes(tree);
        encodedString = compress(text, codesTable);

        document.getElementById("originalSize").textContent = text.length;
        document.getElementById("encodedSize").textContent = encodedString.length;
        document.getElementById("encodedText").textContent = encodedString;
        document.getElementById("decodedText").textContent = "";
        treeView.textContent = "";
    });
    function renderTree(node) {
        if (!node) return null;

    const nodeEl = document.createElement("div");
    nodeEl.classList.add("tree-node");

    const circle = document.createElement("span");
    circle.classList.add("node-circle");
    circle.textContent = node.char !== null ? `${node.char} (${node.freq})` : `* (${node.freq})`;

    nodeEl.appendChild(circle);

    if (node.left || node.right) {
        const childrenContainer = document.createElement("div");
        childrenContainer.classList.add("children");
        if (node.left) childrenContainer.appendChild(renderTree(node.left));
        if (node.right) childrenContainer.appendChild(renderTree(node.right));
        nodeEl.appendChild(childrenContainer);
    }

    return nodeEl;
    }  
    function createTreeElement(node) {
    if (!node) return null;

    const container = document.createElement("div");
    container.className = "tree-node";

    const charEl = document.createElement("div");
    charEl.className = "node-circle";
    charEl.textContent = node.char !== null ? node.char : "*";
    container.appendChild(charEl);

    const freqEl = document.createElement("div");
    freqEl.className = "node-freq";
    freqEl.textContent = node.freq;
    container.appendChild(freqEl);

    if (node.left || node.right) {
        container.classList.add("has-children"); 
        const childrenContainer = document.createElement("div");
        childrenContainer.className = "children"; 

        if (node.left) childrenContainer.appendChild(createTreeElement(node.left));
        if (node.right) childrenContainer.appendChild(createTreeElement(node.right));

        container.appendChild(childrenContainer);
    }

    return container;
}


    decompressBtn.addEventListener("click", () => {
        if (!encodedString || !tree) {
            alert("Сначала сожмите текст!");
            return;
        }
        const decoded = decompress(encodedString, tree);
        document.getElementById("decodedText").textContent = decoded;
    });

    showTreeBtn.addEventListener("click", () => {
        const text = document.getElementById("inputText").value.trim();
        treeView.textContent = "";

        if (!text) {
            alert("Введите текст!");
            return;
        }

        if (text.length > 100) {
            alert("Слишком длинный текст! Для визуализации введите до 100 символов.");
            return;
        }
        const { root, steps } = buildHuffmanTreeWithSteps(text);
        treeView.innerHTML = "";

        const treeElement = createTreeElement(root);
        treeView.appendChild(treeElement);

   
        const stepsContainer = document.getElementById("stepsView");
        if (stepsContainer) {
            stepsContainer.textContent = steps
                .map(s => `${s.description}\n${s.nodes.map(n => `${n.char ?? "*"}:${n.freq}`).join(", ")}`)
                .join("\n\n");
        }
});
});
