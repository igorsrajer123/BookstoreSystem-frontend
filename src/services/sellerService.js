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

const sellerService = {
    createNewBookstoreSeller
}

export default sellerService;