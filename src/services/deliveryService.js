async function getAllDeliveries() {
    const url = "http://localhost:8080/getAllDeliveries";
    const response = await fetch(url);

    const deliveries = await response.json();
    return deliveries;
}

async function createDelivery(delivery) {
    const url = "http://localhost:8080/createDelivery";
    const response = await fetch(url, {
        method: "POST",
        headers: {
                    "Content-Type": 'application/json'
        },
        body: JSON.stringify(delivery)
    }).catch(e => console.error(e));

    return response.status;
}

async function declineDelivery(id) {
    const url = "http://localhost:8080/declineDelivery/" + id;
    const response = await fetch(url, {
        method: "PUT",
        headers: {
                    "Content-Type": 'application/json'
        }
    }).catch(e => console.error(e));

    return response.status;
}

async function acceptDelivery(id) {
    const url = "http://localhost:8080/acceptDelivery/" + id;
    const response = await fetch(url, {
        method: "PUT",
        headers: {
                    "Content-Type": 'application/json'
        }
    }).catch(e => console.error(e));

    return response.status;
}

async function getDeliveryItems(id) {
    const url = "http://localhost:8080/getDeliveryItemsByDeliveryId/" + id;
    const response = await fetch(url);

    const deliveryItems = await response.json();
    return deliveryItems;
}

async function getBookFromDeliveryItem(id) {
    const url = "http://localhost:8080/getBookFromDeliveryItem/" + id;
    const response = await fetch(url);

    const book = await response.json();
    return book;
}

async function getOtherProductFromDeliveryItem(id) {
    const url = "http://localhost:8080/getOtherProductByDeliveryItem/" + id;
    const response = await fetch(url);

    const otherProduct = await response.json();
    return otherProduct;
}

const deliveryService = {
    getAllDeliveries,
    createDelivery,
    declineDelivery,
    acceptDelivery,
    getDeliveryItems,
    getBookFromDeliveryItem,
    getOtherProductFromDeliveryItem
}

export default deliveryService;