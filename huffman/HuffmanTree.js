import { NodeTree, buildHuffmanTree, generateCodes, compress, decompress, treeToString } from '../huffman/HuffmanMain.js';

let tree = null;
let codesTable = {};
let encodedString = "";

document.addEventListener("DOMContentLoaded", () => {
    const compressBtn = document.getElementById("compressBtn");
    const decompressBtn = document.getElementById("decompressBtn");

    compressBtn.addEventListener("click", () => {
        const text = document.getElementById("inputText").value;
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

        if (text.length <= 100) {
            const treeText = buildHuffmanTree(text);
            document.getElementById("encodedText").textContent += "\n\nДерево:\n" + treeToString(treeText);
        } else {
            document.getElementById("encodedText").textContent += "\n\n(Текст слишком длинный для визуализации дерева)";
        }
    });

    decompressBtn.addEventListener("click", () => {
        if (!encodedString || !tree) {
            alert("Сначала сожмите текст!");
            return;
        }

        const decoded = decompress(encodedString, tree);
        document.getElementById("decodedText").textContent = decoded;
    });
});
