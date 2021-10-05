async function getAllCustomers() {
    const url = "http://localhost:8080/getAllCustomers";
    const response = await fetch(url);

    const customers = await response.json();
    return customers;
}

const customerService = {
    getAllCustomers
}

export default customerService;