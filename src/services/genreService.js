async function getAllGenres() {
    const url = "http://localhost:8080/getAllGenres";
    const response = await fetch(url);

    const genres = await response.json();
    return genres;
}

async function getGenreById(id) {
    const url = "http://localhost:8080/getGenreById/" + id;
    const response = await fetch(url);

    const genre = await response.json();
    return genre;
}

async function createNewGenre(genre) {
    const url = "http://localhost:8080/createNewGenre";
    const response = await fetch(url, {
        method: "POST",
        headers: {
                    "Content-Type": 'application/json'
        },
        body: JSON.stringify(genre)
    }).catch(e => console.error(e));

    return response.status;
}

async function editGenre(genre) {
    const url = "http://localhost:8080/editGenre";
    const response = await fetch(url, {
        method: "PUT",
        headers: {
                    "Content-Type": 'application/json'
        },
        body: JSON.stringify(genre)
    }).catch(e => console.error(e));

    return response.status;
}

const genreService = {
    getAllGenres,
    getGenreById,
    createNewGenre,
    editGenre
}

export default genreService;

