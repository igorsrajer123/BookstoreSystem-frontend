async function getAllPublishers() {
    const url = "http://localhost:8080/getAllPublishers";
    const response = await fetch(url);

    const publishers = await response.json();
    return publishers;
}

async function createNewPublisher(publisher) {
    const url = "http://localhost:8080/createNewPublisher";
    const response = await fetch(url, {
        method: "POST",
        headers: {
                    "Content-Type": 'application/json'
        },
        body: JSON.stringify(publisher)
    }).catch(e => console.error(e));

    return response.status;
}

async function editPublisher(publisher) {
    const url = "http://localhost:8080/editPublisher";
    const response = await fetch(url, {
        method: "PUT",
        headers: {
                    "Content-Type": 'application/json'
        },
        body: JSON.stringify(publisher)
    }).catch(e => console.error(e));

    return response.status;
}

const publisherService = {
    getAllPublishers,
    createNewPublisher,
    editPublisher
}

export default publisherService;