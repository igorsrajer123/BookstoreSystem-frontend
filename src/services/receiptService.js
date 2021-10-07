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

async function createReceipt(sellerId, items) {
    const url = "http://localhost:8080/createReceipt/" + sellerId;
    const response = await fetch(url, {
        method: "POST",
        headers: {
                    "Content-Type": 'application/json'
        },
        body: JSON.stringify(items)
    }).catch(e => console.error(e));

    return response.status;
}

async function reverseReceipt(receiptId, bookstoreId) {
    const url = "http://localhost:8080/reverseReceipt/" + receiptId + "/" + bookstoreId;
    const response = await fetch(url, {
        method: "PUT",
        headers: {
                    "Content-Type": 'application/json'
        }
    }).catch(e => console.error(e));

    return response.status;
}

const receiptService = {
    getCashRegistersReceipts,
    getReceiptItems,
    getBookFromReceiptItem,
    getOtherProductByReceiptItem,
    createReceipt,
    reverseReceipt
}

export default receiptService;