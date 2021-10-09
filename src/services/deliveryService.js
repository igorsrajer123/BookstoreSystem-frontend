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

const deliveryService = {
    getAllDeliveries,
    createDelivery,
    declineDelivery,
    acceptDelivery
}

export default deliveryService;