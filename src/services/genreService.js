async function getAllGenres() {
    const url = "http://localhost:8080/getAllGenres";
    const response = await fetch(url);

    const genres = await response.json();
    return genres;
}

const genreService = {
    getAllGenres
}

export default genreService;

