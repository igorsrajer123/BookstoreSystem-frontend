async function getAllPublishers() {
    const url = "http://localhost:8080/getAllPublishers";
    const response = await fetch(url);

    const publishers = await response.json();
    return publishers;
}

const publisherService = {
    getAllPublishers
}

export default publisherService;