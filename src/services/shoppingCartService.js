async function getShoppingCartByUserId(id) {
    const url = "http://localhost:8080/getShoppingCartByUserId/" + id;  
    const response = await fetch(url);

    const shoppingCart = await response.json();
    return shoppingCart;
}

async function getShoppingCartItems(id) {
    const url = "http://localhost:8080/getShoppingCartItems/" + id;  
    const response = await fetch(url);

    const shoppingCartItems = await response.json();
    return shoppingCartItems;
}

async function createNewShoppingCartItem(item) {
    const url = "http://localhost:8080/createNewShoppingCartItem";
    const response = await fetch(url, {
        method: "POST",
        headers: {
                    "Content-Type": 'application/json'
        },
        body: JSON.stringify(item)
    }).catch(e => console.error(e));

    return response.status;
}

async function deleteShoppingCartItem(id) {
    const url = "http://localhost:8080/deleteShoppingCartItem/" + id;
    const response = await fetch(url, {
        method: "DELETE",
        headers: {
                    "Content-Type": 'application/json'
        }
    }).catch(e => console.error(e));

    return response.status;
}

const shoppingCartService = {
    getShoppingCartByUserId,
    getShoppingCartItems,
    createNewShoppingCartItem,
    deleteShoppingCartItem
}

export default shoppingCartService;