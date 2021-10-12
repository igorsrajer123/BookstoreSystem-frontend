
const getSearchedBooks = async param => {
    const url = "http://localhost:8080/getBooksWhereNameContains/" + param;
    const response = await fetch(url);

    const books = await response.json();
    return books;
}

const getSearchedOtherProducts = async param => {
    const url = "http://localhost:8080/getOtherProductsByNameContaining/" + param;
    const response = await fetch(url);

    const otherProducts = await response.json();
    return otherProducts;
}

const getSearchedWriters = async param => {
    const url = "http://localhost:8080/findAllWritersByNameContaining/" + param;
    const response = await fetch(url);

    const writers = await response.json();
    return writers;
}

const getSearchedBookstores = async param => {
    const url = "http://localhost:8080/findAllBookstoresByNameContaining/" + param;
    const response = await fetch(url);

    const bookstores = await response.json();
    return bookstores;
}

const searchService = {
    getSearchedBooks,
    getSearchedOtherProducts,
    getSearchedWriters,
    getSearchedBookstores
}

export default searchService;