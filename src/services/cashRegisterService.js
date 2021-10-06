async function getCashRegisterByBookstoreId(id) {
    const url = "http://localhost:8080/getCashRegisterByBookstoreId/" + id;
    const response = await fetch(url);

    const cashRegister = await response.json();
    return cashRegister;
}

const cashRegisterService = {
    getCashRegisterByBookstoreId
}

export default cashRegisterService;