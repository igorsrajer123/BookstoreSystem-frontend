async function getCatalogueItemsByBook(id) {
    const url = "http://localhost:8080/getCatalogueItemsByBook/" + id;
    const response = await fetch(url);

    const items = await response.json();
    return items;
}

async function getCatalogueItemsByOtherProduct(id) {
    const url = "http://localhost:8080/getCatalogueItemsByOtherProduct/" + id;
    const response = await fetch(url);

    const items = await response.json();
    return items;
}


const catalogueItemService = {
    getCatalogueItemsByBook,
    getCatalogueItemsByOtherProduct
}

export default catalogueItemService;