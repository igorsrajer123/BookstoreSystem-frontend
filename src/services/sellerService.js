import Cookies from 'js-cookie';

async function createNewBookstoreSeller(newSeller) { 
    const url = "http://localhost:8080/createBookstoreSeller";  
    const response = await fetch(url, {
        method: "POST",
        headers: {
                    'Authorization': 'Bearer ' + Cookies.get('token'),
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

async function getSellerByUserId(id) {
    const url = "http://localhost:8080/getSellerByUserId/" + id;
    const response = await fetch(url);

    const seller = await response.json();

    return seller;
}

const sellerService = {
    createNewBookstoreSeller,
    getAllBookstoreSellers,
    getSellerByUserId
}

export default sellerService;