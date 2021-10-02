async function getAllBookstores() {
    const url = "http://localhost:8080/getAllBookstores";
    const response = await fetch(url);

    const bookstores = await response.json();
    return bookstores;
}

async function getBookstoreById(id) {
    const url = "http://localhost:8080/getBookstoreById/" + id;
    const response = await fetch(url);

    const bookstore = await response.json();
    return bookstore;
}

async function getBookstoreByAdminId(id) {
    const url = "http://localhost:8080/getBookstoreByAdminId/" + id;
    const response = await fetch(url);

    const bookstore = await response.json();
    return bookstore;
}

const bookstoreService = {
    getAllBookstores,
    getBookstoreById,
    getBookstoreByAdminId
}

export default bookstoreService;