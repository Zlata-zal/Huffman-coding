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
    if (!showTreeBtn) {
        console.error("❌ Кнопка 'showTreeBtn' не найдена в HTML!");
        return;
    }
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
        const result =
            steps
                .map(s => `${s.description}\n${s.nodes.map(n => `${n.char ?? "*"}:${n.freq}`).join(", ")}`)
                .join("\n\n") +
            "\n\nИтоговое дерево:\n" +
            treeToString(root);

        treeView.textContent = result;
    });
});
