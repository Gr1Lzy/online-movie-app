import config from "config";
import axios from "axios";

export const GenreService = {
    async getAll() {
        const MOVIE_SERVICE = config.getMovieService();

        return await axios.get(`${MOVIE_SERVICE}/api/genres`);
    }
}