import Cookies from 'js-cookie';

async function updateUser(user) { 
    const url = "http://localhost:8080/updateUserInformation";  
    const response = await fetch(url, {
        method: "PUT",
        headers: {
                    'Authorization': 'Bearer ' + Cookies.get('token'),
                    'Content-Type': 'application/json'
        },
        body: JSON.stringify(user)
    }).catch(e => console.error(e));

    return response.status;
}

async function getUserById(id) {
    const url = "http://localhost:8080/getUserById/" + id;  
    const response = await fetch(url);

    const user = await response.json();
    return user;
}

async function changeUserPassword(user) {
    const url = "http://localhost:8080/changePassword";  
    const response = await fetch(url, {
        method: "PUT",
        headers: {
                    'Authorization': 'Bearer ' + Cookies.get('token'),
                    'Content-Type': 'application/json'
        },
        body: JSON.stringify(user)
    }).catch(e => console.error(e));

    return response.status;
}

async function checkIfEmailTaken(email) {
    const url = "http://localhost:8080/getUserByEmail/" + email;  

    if(email !== ""){
        const response = await fetch(url);
        return response.status;
    }

    return 404;
}

async function disableAccount(id) {
    const url = "http://localhost:8080/disableAccount/" + id;  
    await fetch(url, {
        method: "PUT",
        headers: {
                    'Content-Type': 'application/json'
        }
    }).catch(e => console.error(e));
}

async function enableAccount(id) {
    const url = "http://localhost:8080/enableAccount/" + id;  
    await fetch(url, {
        method: "PUT",
        headers: {
                    'Content-Type': 'application/json'
        }
    }).catch(e => console.error(e));
}



const userService = {
    updateUser,
    changeUserPassword,
    checkIfEmailTaken,
    disableAccount,
    enableAccount,
    getUserById
}

export default userService;