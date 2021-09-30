async function getAllOtherProducts() {
    const url = "http://localhost:8080/getAllOtherProducts";
    const response = await fetch(url);

    const products = await response.json();
    return products;
}

async function getOtherProductsByType(type) {
    const url = "http://localhost:8080/getOtherProductsByType/" + type;
    const response = await fetch(url);

    const products = await response.json();
    return products;
}

const otherProductService = {
    getAllOtherProducts,
    getOtherProductsByType
}

export default otherProductService;