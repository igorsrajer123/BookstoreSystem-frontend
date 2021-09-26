async function getAllWriters() {
    const url = "http://localhost:8080/getAllWriters";
    const response = await fetch(url);

    const writers = await response.json();
    return writers;
}

async function getBookWriters(bookName) {
    const url = "http://localhost:8080/getBookWriters/" + bookName;
    const response = await fetch(url);

    const writers = await response.json();
    return writers;
}

const writerService = {
    getAllWriters,
    getBookWriters
}

export default writerService;