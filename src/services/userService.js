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

async function checkIfEmailTaken(email) {
    const url = "http://localhost:8080/getUserByEmail/" + email;  

    if(email !== ""){
        const response = await fetch(url);
        return response.status;
    }

    return 404;
}


const userService = {
    updateUser,
    changeUserPassword,
    checkIfEmailTaken
}

export default userService;