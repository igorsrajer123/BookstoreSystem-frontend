async function getAllCustomers() {
    const url = "http://localhost:8080/getAllCustomers";
    const response = await fetch(url);

    const customers = await response.json();
    return customers;
}

async function getCustomerByUser(id) {
    const url = "http://localhost:8080/getCustomerByUser/" + id;
    const response = await fetch(url);

    const customer = await response.json();
    return customer;
}

const customerService = {
    getAllCustomers,
    getCustomerByUser
}

export default customerService;