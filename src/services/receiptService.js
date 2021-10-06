async function getCashRegistersReceipts(id) {
    const url = "http://localhost:8080/getCashRegistersReceipts/" + id;
    const response = await fetch(url);

    const receipts = await response.json();
    return receipts;
}

async function getReceiptItems(id) {
    const url = "http://localhost:8080/getReceiptItems/" + id;
    const response = await fetch(url);

    const items = await response.json();
    return items;
}

async function getBookFromReceiptItem(id) {
    const url = "http://localhost:8080/getBookFromReceiptItem/" + id;
    const response = await fetch(url);

    const book = await response.json();
    return book;
}

async function getOtherProductByReceiptItem(id) {
    const url = "http://localhost:8080/getOtherProductByReceiptItem/" + id;
    const response = await fetch(url);

    const otherProduct = await response.json();
    return otherProduct;
}

const receiptService = {
    getCashRegistersReceipts,
    getReceiptItems,
    getBookFromReceiptItem,
    getOtherProductByReceiptItem
}

export default receiptService;