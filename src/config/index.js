const config = {
  // Services
  USERS_SERVICE: 'http://localhost:3000',
  MOVIE_SERVICE: process.env.BACKEND_MOVIE_SERVICE,
  UI_URL_PREFIX: process.env.REACT_APP_UI_URL_PREFIX || '',
  getMovieService() {
    return this.MOVIE_SERVICE;
  }
};

export default config;
