
async function getAllProducts() {
    const url = "http://localhost:8080/getAllProducts";
    const response = await fetch(url);

    const products = await response.json();
    return products;
}

async function getAllBooks() {
    const url = "http://localhost:8080/getProductsByType/BOOK";
    const response = await fetch(url);

    const books = await response.json();
    return books;
}

async function getOtherProducts() {
    const url1 = "http://localhost:8080/getProductsByType/TOY";
    const toysResponse = await fetch(url1);
    const toys = await toysResponse.json();

    const url2 = "http://localhost:8080/getProductsByType/GIFT";
    const  giftsResponse = await fetch(url2);
    const gifts = await giftsResponse.json();

    const url3 = "http://localhost:8080/getProductsByType/ACCESSORY";
    const accessoriesResponse = await fetch(url3);
    const accessories = await accessoriesResponse.json();

    const url4 = "http://localhost:8080/getProductsByType/SCHOOLKIT";
    const schoolkitResponse = await fetch(url4);
    const schoolkit = await schoolkitResponse.json();

    const myProducts = toys.concat(gifts, accessories, schoolkit);
    return myProducts;
}

export default {
    getAllProducts,
    getAllBooks,
    getOtherProducts
}