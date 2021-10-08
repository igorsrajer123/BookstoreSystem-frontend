async function getAllOtherProducts() {
    const url = "http://localhost:8080/getAllOtherProducts";
    const response = await fetch(url);

    const products = await response.json();
    return products;
}

async function getOtherProductById(id) {
    const url = "http://localhost:8080/getOtherProductById/" + id;
    const response = await fetch(url);

    const product = await response.json();
    return product;
}

async function getOtherProductsByType(type) {
    const url = "http://localhost:8080/getOtherProductsByType/" + type;
    const response = await fetch(url);

    const products = await response.json();
    return products;
}

async function createNewOtherProduct(otherProduct) {
    const url = "http://localhost:8080/createNewOtherProduct";
    const response = await fetch(url, {
        method: "POST",
        headers: {
                    "Content-Type": 'application/json'
        },
        body: JSON.stringify(otherProduct)
    }).catch(e => console.error(e));

    return response.status;
}

async function updateOtherProduct(otherProduct) {
    const url = "http://localhost:8080/updateOtherProduct";
    const response = await fetch(url, {
        method: "PUT",
        headers: {
                    "Content-Type": 'application/json'
        },
        body: JSON.stringify(otherProduct)
    }).catch(e => console.error(e));

    return response.status;
}

async function getOtherProductByShoppingCartItem(id) {
    const url = "http://localhost:8080/getOtherProductByShoppingCartItem/" + id;
    const response = await fetch(url);

    const otherProduct = await response.json();
    return otherProduct;
}
const otherProductService = {
    getAllOtherProducts,
    getOtherProductsByType,
    createNewOtherProduct,
    updateOtherProduct,
    getOtherProductById,
    getOtherProductByShoppingCartItem
}

export default otherProductService;