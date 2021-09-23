
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

async function getAllToys() {
    const url = "http://localhost:8080/getProductsByType/TOY";
    const toysResponse = await fetch(url);
    const toys = await toysResponse.json();

    return toys;
}

async function getAllAccessories() {
    const url = "http://localhost:8080/getProductsByType/ACCESSORY";
    const accessoriesResponse = await fetch(url);
    const accessories = await accessoriesResponse.json();

    return accessories;
}

async function getAllGifts() {
    const url = "http://localhost:8080/getProductsByType/GIFT";
    const  giftsResponse = await fetch(url);
    const gifts = await giftsResponse.json();

    return gifts;
}

async function getEverySchoolkit() {
    const url = "http://localhost:8080/getProductsByType/SCHOOLKIT";
    const schoolkitResponse = await fetch(url);
    const schoolkit = await schoolkitResponse.json();

    return schoolkit;
}

async function getOtherProducts() {
    const toys = await getAllToys();
    const accessories = await getAllAccessories();
    const gifts = await getAllGifts();
    const schoolkit = await getEverySchoolkit();

    const myProducts = toys.concat(gifts, accessories, schoolkit);
    return myProducts;
}

export default {
    getAllProducts,
    getAllBooks,
    getAllToys,
    getAllAccessories,
    getAllGifts,
    getEverySchoolkit,
    getOtherProducts
}