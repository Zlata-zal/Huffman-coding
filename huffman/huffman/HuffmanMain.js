import {
    NodeTree,
    buildHuffmanTree,
    buildHuffmanTreeWithSteps,
    generateCodes,
    compress,
    decompress,
    treeToString,
    generateCodesBytes, 
    compressBytes, 
    decompressBytes,
    buildHuffmanTreeBytes
} from '../huffman/HuffmanCreate.js'; 

let tree = null;
let codesTable = {};
let encodedString = "";


document.addEventListener("DOMContentLoaded", () => {
    const fileBtn = document.getElementById("loadFileBtn");
    const fileInput = document.getElementById("fileInput");
    const textArea = document.getElementById("inputText");
    const compressBtn = document.getElementById("compressBtn");
    const decompressBtn = document.getElementById("decompressBtn");

    let fileBytes; 
    let huffmanRoot;
    let codebook;
    let compressedBytes;

    
    fileBtn.addEventListener("click", () => fileInput.click());

    fileInput.addEventListener("change", async (event) => {
        const file = event.target.files[0];
        if (!file) return;

        const allowedExtensions = [".txt", ".md", ".csv", ".json", ".xml", ".html", ".pdf"];
        const fileName = file.name.toLowerCase();
        const isAllowed = allowedExtensions.some(ext => fileName.endsWith(ext));

        if (!isAllowed) {
            alert("Недопустимый формат файла.");
            return;
        }

        const arrayBuffer = await file.arrayBuffer();
        fileBytes = new Uint8Array(arrayBuffer);

        if (!fileName.endsWith(".pdf")) {
            const text = new TextDecoder().decode(fileBytes);
            textArea.value = text; 
        } else {
            textArea.value = "[PDF-файл выбран — текст не отображается]";
        }

        console.log("Файл загружен:", file.name);
        console.log("Размер файла (байт):", fileBytes.length);
    });

    decompressBtn.addEventListener("click", () => {
        if (!compressedBytes || !huffmanRoot) {
            alert("Сначала сожмите файл!");
            return;
        }
        const decompressed = decompressBytes(compressedBytes, huffmanRoot);
        console.log("Восстановленный размер:", decompressed.length);

        try {
            const text = new TextDecoder().decode(decompressed);
            textArea.value = text;
        } catch (e) {
            textArea.value = "[PDF или бинарный файл восстановлен — текст не отображается]";
        }

        alert("Файл успешно восстановлен!");
    });
});


    compressBtn.addEventListener("click", () => {
    const text = document.getElementById("inputText").value.trim();

    if (text) {
    
        tree = buildHuffmanTree(text);
        codesTable = generateCodes(tree);
        encodedString = compress(text, codesTable);

        document.getElementById("originalSize").textContent = text.length;
        document.getElementById("encodedSize").textContent = encodedString.length;
        document.getElementById("encodedText").textContent = encodedString;
        document.getElementById("decodedText").textContent = "";
        document.getElementById("treeView").textContent = "";

        console.log(
            `Текст: ${text.length} символов (~${text.length * 8} бит) → ${encodedString.length} бит`
        );
    } else if (fileBytes) {
        huffmanRoot = buildHuffmanTreeBytes(fileBytes);
        codebook = generateCodesBytes(huffmanRoot);
        compressedBytes = compressBytes(fileBytes, codebook);
        console.log(`Файл: исходный размер ${fileBytes.length} байт`);
        console.log(`Файл: сжатый размер ${compressedBytes.length} байт`);
        alert("Файл успешно сжат!");
    } else {
        alert("Введите текст или выберите файл!");
    }
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
    function createTreeElement(node, codes = {}) {
    if (!node) return null;

    const container = document.createElement("div");
    container.className = "tree-node";

    const circleWrapper = document.createElement("div");
    circleWrapper.className = "node-circle-wrapper";

    const charEl = document.createElement("div");
    charEl.className = "node-circle";
    charEl.textContent = node.char !== null ? node.char : "*";
    circleWrapper.appendChild(charEl);

    if (node.char !== null && codes[node.char] !== undefined) {
        const codeEl = document.createElement("div");
        codeEl.className = "node-code";
        codeEl.textContent = codes[node.char];
        circleWrapper.appendChild(codeEl);
    }

    container.appendChild(circleWrapper);

    const freqEl = document.createElement("div");
    freqEl.className = "node-freq";
    freqEl.textContent = node.freq;
    container.appendChild(freqEl);

    if (node.left || node.right) {
        container.classList.add("has-children"); 
        const childrenContainer = document.createElement("div");
        childrenContainer.className = "children"; 
        const childCount = [node.left, node.right].filter(Boolean).length;
        childrenContainer.dataset.childCount = String(childCount);

        if (node.left) childrenContainer.appendChild(createTreeElement(node.left, codes));
        if (node.right) childrenContainer.appendChild(createTreeElement(node.right, codes));

        container.appendChild(childrenContainer);
    }

    return container;
}

function drawTreeConnections(container) {
    if (!container) return;

    const existing = container.querySelector(".tree-lines");
    if (existing) existing.remove();

    const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    svg.classList.add("tree-lines");

    const { scrollWidth, scrollHeight } = container;
    svg.setAttribute("width", scrollWidth);
    svg.setAttribute("height", scrollHeight);
    svg.setAttribute("viewBox", `0 0 ${scrollWidth} ${scrollHeight}`);
    svg.style.width = `${scrollWidth}px`;
    svg.style.height = `${scrollHeight}px`;

    const treeRect = container.getBoundingClientRect();
    const scrollLeft = container.scrollLeft;
    const scrollTop = container.scrollTop;

    const nodes = container.querySelectorAll(".tree-node");
    nodes.forEach(parent => {
        const parentCircle = parent.querySelector(".node-circle");
        if (!parentCircle) return;

        const children = parent.querySelectorAll(":scope > .children > .tree-node");
        children.forEach(child => {
            const childCircle = child.querySelector(".node-circle");
            if (!childCircle) return;

            const parentRect = parentCircle.getBoundingClientRect();
            const childRect = childCircle.getBoundingClientRect();

            const x1 = parentRect.left - treeRect.left + parentRect.width / 2 + scrollLeft;
            const y1 = parentRect.bottom - treeRect.top + scrollTop;
            const x2 = childRect.left - treeRect.left + childRect.width / 2 + scrollLeft;
            const y2 = childRect.top - treeRect.top + scrollTop;

            const line = document.createElementNS("http://www.w3.org/2000/svg", "line");
            line.setAttribute("x1", x1);
            line.setAttribute("y1", y1);
            line.setAttribute("x2", x2);
            line.setAttribute("y2", y2);
            line.classList.add("tree-line");
            svg.appendChild(line);
        });
    });

    container.prepend(svg);
}

function scheduleTreeConnections(container) {
    if (!container) return;
    requestAnimationFrame(() => drawTreeConnections(container));
}

window.addEventListener("resize", () => {
    const treeViewEl = document.getElementById("treeView");
    if (treeViewEl && treeViewEl.querySelector(".tree-node")) {
        drawTreeConnections(treeViewEl);
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

    showTreeBtn.addEventListener("click", () => {
        const treeViewEl = document.getElementById("treeView");
        const text = document.getElementById("inputText").value.trim();
        treeViewEl.textContent = "";

        if (!text) {
            alert("Введите текст!");
            return;
        }

        if (text.length > 100) {
            alert("Слишком длинный текст! Для визуализации введите до 100 символов.");
            return;
        }
        const { root, steps } = buildHuffmanTreeWithSteps(text);
        const displayCodes = generateCodes(root);
        treeViewEl.innerHTML = "";

        const treeElement = createTreeElement(root, displayCodes);
        treeElement.classList.add("tree-root");
        treeViewEl.appendChild(treeElement);
        scheduleTreeConnections(treeViewEl);

   
        const stepsContainer = document.getElementById("stepsView");
        if (stepsContainer) {
            stepsContainer.textContent = steps
                .map(s => `${s.description}\n${s.nodes.map(n => `${n.char ?? "*"}:${n.freq}`).join(", ")}`)
                .join("\n\n");
        }
});

