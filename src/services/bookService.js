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

const bookService = {
    getAllBooks,
    getBooksByGenre
}

export default bookService;