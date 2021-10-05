async function getAllBooks() {
    const url = "http://localhost:8080/getAllBooks";
    const response = await fetch(url);

    const books = await response.json();
    return books;
}

async function getBooksByGenre(genre) {
    const url = "http://localhost:8080/getBooksByGenre/" + genre;
    const response = await fetch(url);

    const books = await response.json();
    return books;
}

async function createNewBook(book) {
    const url = "http://localhost:8080/createNewBook";
    const response = await fetch(url, {
        method: "POST",
        headers: {
                    "Content-Type": 'application/json'
        },
        body: JSON.stringify(book)
    }).catch(e => console.error(e));

    return response.status;
}

async function updateBook(book) {
    const url = "http://localhost:8080/updateBook";
    const response = await fetch(url, {
        method: "PUT",
        headers: {
                    "Content-Type": 'application/json'
        },
        body: JSON.stringify(book)
    }).catch(e => console.error(e));

    return response.status;
}

const bookService = {
    getAllBooks,
    getBooksByGenre,
    createNewBook,
    updateBook
}

export default bookService;