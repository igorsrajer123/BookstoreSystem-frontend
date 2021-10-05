import Cookies from 'js-cookie';

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

async function getBookstoreBySellerId(id) {
    const url = "http://localhost:8080/getBookstoreBySellerId/" + id;
    const response = await fetch(url);

    const bookstore = await response.json();
    return bookstore;
}

async function updateBookstore(bookstore) {
    const url = "http://localhost:8080/updateBookstore";
    const response = await fetch(url, {
        method: "PUT",
        headers: {
                    'Authorization': 'Bearer ' + Cookies.get('token'),
                    'Content-Type': 'application/json'
        },
        body: JSON.stringify(bookstore)
    }).catch(e => console.error(e));

    return response.status;
}

async function createNewBookstore(bookstore) {
    const url = "http://localhost:8080/createNewBookstore";
    const response = await fetch(url, {
        method: "POST",
        headers: {
            'Authorization': 'Bearer ' + Cookies.get('token'),
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(bookstore)
    }).catch(e => console.error(e));

    return response.status;
}

const bookstoreService = {
    getAllBookstores,
    getBookstoreById,
    getBookstoreByAdminId,
    updateBookstore,
    createNewBookstore,
    getBookstoreBySellerId
}

export default bookstoreService;