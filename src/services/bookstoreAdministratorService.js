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

const bookstoreAdministratorService = {
    createNewBookstoreAdmin
}

export default bookstoreAdministratorService;
