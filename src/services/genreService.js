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

const genreService = {
    getAllGenres,
    getGenreById
}

export default genreService;

