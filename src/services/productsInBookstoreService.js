
async function getBooksInBookstore(id) {
    const url = "http://localhost:8080/getBooksInBookstore/" + id;
    const response = await fetch(url);

    const books = await response.json();
    return books;
}

async function getOtherProductsInBookstore(id) {
    const url = "http://localhost:8080/getOtherProductsInBookstore/" + id;
    const response = await fetch(url);

    const otherProducts = await response.json();
    return otherProducts;
}

async function getBookByBooksInBookstoreId(id) {
    const url = "http://localhost:8080/getBookByBooksInBookstoreId/" + id;
    const response = await fetch(url);

    const book = await response.json();
    return book;
}

async function getOtherProductByOtherProductsBookstoresId(id) {
    const url = "http://localhost:8080/getOtherProductByOtherProductsBookstoresId/" + id;
    const response = await fetch(url);

    const otherProduct = await response.json();
    return otherProduct;
}

async function updateBooksBookstoresAmount(booksBookstores) {
    const url = "http://localhost:8080/updateBooksBookstoresAmount";
    const response = await fetch(url, {
        method: "PUT",
        headers: {
                    "Content-Type": 'application/json'
        },
        body: JSON.stringify(booksBookstores)
    }).catch(e => console.error(e));

    return response.status;
}

async function updateOtherProductsBookstoresAmount(otherProductsBookstores) {
    const url = "http://localhost:8080/updateOtherProductsBookstoresAmount";
    const response = await fetch(url, {
        method: "PUT",
        headers: {
                    "Content-Type": 'application/json'
        },
        body: JSON.stringify(otherProductsBookstores)
    }).catch(e => console.error(e));

    return response.status;
}

const productsInBookstoreService = {
    getBooksInBookstore,
    getOtherProductsInBookstore,
    getBookByBooksInBookstoreId,
    getOtherProductByOtherProductsBookstoresId,
    updateBooksBookstoresAmount,
    updateOtherProductsBookstoresAmount
}

export default productsInBookstoreService;