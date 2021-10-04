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

async function createNewWriter(writer) {
    const url = "http://localhost:8080/createNewWriter";
    const response = await fetch(url, {
        method: "POST",
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(writer)
    }).catch(e => console.error(e));

    return response.status;
}

async function updateWriter(writer) {
    const url = "http://localhost:8080/updateWriter";
    const response = await fetch(url, {
        method: "PUT",
        headers: {
                    'Content-Type': 'application/json'
        },
        body: JSON.stringify(writer)
    }).catch(e => console.error(e));

    return response.status;
}

async function getOneWriterById(id) {
    const url = "http://localhost:8080/getOneWriterById/" + id;
    const response = await fetch(url);

    const writer = await response.json();
    return writer;
}

async function addWriterNewBook(bookCode, writers) {
    const url = "http://localhost:8080/addWriterNewBook/" + bookCode;
    const response = await fetch(url, {
        method: "PUT",
        headers: {
                    'Content-Type': 'application/json'
        },
        body: JSON.stringify(writers)
    }).catch(e => console.error(e));

    return response.status;
}

const writerService = {
    getAllWriters,
    getBookWriters,
    createNewWriter,
    updateWriter,
    getOneWriterById,
    addWriterNewBook
}

export default writerService;