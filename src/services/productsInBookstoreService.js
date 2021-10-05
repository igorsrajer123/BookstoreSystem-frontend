
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

const productsInBookstoreService = {
    getBooksInBookstore,
    getOtherProductsInBookstore,
    getBookByBooksInBookstoreId
}

export default productsInBookstoreService;