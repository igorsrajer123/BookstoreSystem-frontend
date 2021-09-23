async function checkUserExists(email) {
    const url = "http://localhost:8080/getUserByEmail/" + email;
    const response = await fetch(url);

    if(response.status == 404)
        return false;

    return true;
}

async function registration(newUser) { 
    const url = "http://localhost:8080/register";  
    const response = await fetch(url, {
        method: "POST",
        headers: {
                    "Content-Type": 'application/json'
        },
        body: JSON.stringify(newUser)
    }).catch(e => console.error(e));
}

async function sendAccountConfirmation(email) {
    const url = "http://localhost:8080/sendAccountConfirmation";  
    const response = await fetch(url, {
        method: "POST",
        headers: {
                    "Content-Type": 'application/json',
                    "Data-Type": 'json'
        },
        body: String(email)
    }).catch(e => console.error(e));
}

export default {
    checkUserExists,
    registration,
    sendAccountConfirmation
}