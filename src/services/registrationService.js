async function checkUserExists(email) {
    const url = "http://localhost:8080/getUserByEmail/" + email;
    const response = await fetch(url);

    if(response.status === 404)
        return false;

    return true;
}

async function registration(newUser) { 
    const url = "http://localhost:8080/register";  
    await fetch(url, {
        method: "POST",
        headers: {
                    "Content-Type": 'application/json'
        },
        body: JSON.stringify(newUser)
    }).catch(e => console.error(e));
}

async function sendAccountConfirmation(email) {
    const url = "http://localhost:8080/sendAccountConfirmation";  
    await fetch(url, {
        method: "POST",
        headers: {
                    "Content-Type": 'application/json',
                    "Data-Type": 'json'
        },
        body: String(email)
    }).catch(e => console.error(e));
}

const registrationService = {
    checkUserExists,
    registration,
    sendAccountConfirmation
}
export default registrationService;