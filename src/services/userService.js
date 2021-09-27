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

const userService = {
    updateUser,
    changeUserPassword
}

export default userService;