function ImproveHuffmanTree(text, pairSize = 1) {
    const freqCount = {};
    if (pairSize === 1){
        for (let char of text) {
            freqCount[char] = (freqCount[char] || 0) + 1;
        }
    }
    else{
        for (let i = 0; i < text.length; i += pairSize) {
            let pair = text.substring(i, pairSize);
            freqCount[pair] = (freqCount[pair] || 0) + 1;
        }
    }
    let heap = Object.entries(freqCount).map(([symbol, freq]) => new NodeTree(symbol, freq));
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
