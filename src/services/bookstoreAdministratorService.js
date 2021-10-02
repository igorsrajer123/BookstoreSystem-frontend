async function createNewBookstoreAdmin(newAdmin) { 
    const url = "http://localhost:8080/createBookstoreAdmin";  
    const response = await fetch(url, {
        method: "POST",
        headers: {
                    "Content-Type": 'application/json'
        },
        body: JSON.stringify(newAdmin)
    }).catch(e => console.error(e));

    return response.status;
}

async function getBookstoreAdministratorByUserId(id) {
    const url = "http://localhost:8080/getBookstoreAdministratorByUserId/" + id;  
    const response = await fetch(url);

    const admin = await response.json();

    return admin;
}

const bookstoreAdministratorService = {
    createNewBookstoreAdmin,
    getBookstoreAdministratorByUserId
}

export default bookstoreAdministratorService;
