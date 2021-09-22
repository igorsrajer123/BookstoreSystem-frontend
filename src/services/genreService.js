import Cookies from 'js-cookie';

async function getAllGenres() {
    const url = "http://localhost:8080/getAllGenres";
    const response = await fetch(url, {
        method: "GET",
        headers: {
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Headers": "Origin, Content-Type, Accept, X-Requested-With",
            "Authorization": "Bearer " + Cookies.get("token")
        }
    });

    const genres = await response.json();
    return genres;
}

export default {
    getAllGenres
}