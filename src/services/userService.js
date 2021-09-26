async function updateUser(user) { 
    const url = "http://localhost:8080/updateUserInformation";  
    const response = await fetch(url, {
        method: "PUT",
        headers: {
                    'Content-Type': 'application/json'
        },
        body: JSON.stringify(user)
    }).catch(e => console.error(e));

    return response.status;
}

const userService = {
    updateUser
}

export default userService;