import Cookies from 'js-cookie';

async function login(credentials) {
    const url = "http://localhost:8080/login";  
    const response = await fetch(url, {
        method: "POST",
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(credentials)
    }).catch(e => console.error(e));

    if(response.status == 200){
        const resp = await response.json();
        Cookies.set('token', resp.accessToken);
    }
    
    return response.status;
}

function logout() {
    Cookies.remove('token');
    window.location.href = "http://localhost:3000/";
}

async function getCurrentUser() {
    const url = "http://localhost:8080/getCurrentUser";  
    const response = await fetch(url, {
        method: "GET",
        headers: {
            "Authorization": "Bearer " + Cookies.get('token')
        }
    });

    if(response.status == 404) return null;

    const currentUser = await response.json();
    return currentUser;
}

export default {
    login,
    logout,
    getCurrentUser
}