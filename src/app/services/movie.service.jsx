import config from "config";
import axios from "axios";

export const MovieService = {
    async getAll() {
        const MOVIE_SERVICE = config.getMovieService();

        return await axios.get(`${MOVIE_SERVICE}/api/movies`);
    },

    async getById(id) {
        const MOVIE_SERVICE = config.getMovieService();

        return await axios.get(`${MOVIE_SERVICE}/api/movies/${id}`);
    },

    async deleteById(id) {
        const MOVIE_SERVICE = config.getMovieService();

        return await axios.delete(`${MOVIE_SERVICE}/api/movies/${id}`);
    },

    async save(movie) {
        const MOVIE_SERVICE = config.getMovieService();

        return await axios.post(`${MOVIE_SERVICE}/api/movies`, movie);
    },

    async update(id, movie) {
        const MOVIE_SERVICE = config.getMovieService();

        return await axios.post(`${MOVIE_SERVICE}/api/movies/${id}`, movie);
    }
}