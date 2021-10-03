async function createNewBookstoreSeller(newSeller) { 
    const url = "http://localhost:8080/createBookstoreSeller";  
    const response = await fetch(url, {
        method: "POST",
        headers: {
                    "Content-Type": 'application/json'
        },
        body: JSON.stringify(newSeller)
    }).catch(e => console.error(e));

    return response.status;
}

async function getAllBookstoreSellers(id) {
    const url = "http://localhost:8080/getAllBookstoreSellers/" + id;
    const response = await fetch(url);

    const sellers = await response.json();

    return sellers;
}

const sellerService = {
    createNewBookstoreSeller,
    getAllBookstoreSellers
}

export default sellerService;