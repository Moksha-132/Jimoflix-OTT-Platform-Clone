// TMDB API Configuration
const API_KEY = '6cc1e81b497d70a27f1f3ded729d984f';
const BASE_URL = 'https://api.themoviedb.org/3';
const IMAGE_BASE_URL = 'https://image.tmdb.org/t/p';

// Image sizes
export const IMAGE_SIZES = {
    poster: {
        small: `${IMAGE_BASE_URL}/w185`,
        medium: `${IMAGE_BASE_URL}/w342`,
        large: `${IMAGE_BASE_URL}/w500`,
        original: `${IMAGE_BASE_URL}/original`,
    },
    backdrop: {
        small: `${IMAGE_BASE_URL}/w300`,
        medium: `${IMAGE_BASE_URL}/w780`,
        large: `${IMAGE_BASE_URL}/w1280`,
        original: `${IMAGE_BASE_URL}/original`,
    },
    profile: {
        small: `${IMAGE_BASE_URL}/w45`,
        medium: `${IMAGE_BASE_URL}/w185`,
        large: `${IMAGE_BASE_URL}/h632`,
        original: `${IMAGE_BASE_URL}/original`,
    },
};

// API endpoints
const endpoints = {
    // Trending
    trending: `/trending/all/week?api_key=${API_KEY}`,
    trendingMovies: `/trending/movie/week?api_key=${API_KEY}`,
    trendingTV: `/trending/tv/week?api_key=${API_KEY}`,

    // Movies
    popularMovies: `/movie/popular?api_key=${API_KEY}`,
    topRatedMovies: `/movie/top_rated?api_key=${API_KEY}`,
    upcomingMovies: `/movie/upcoming?api_key=${API_KEY}`,
    nowPlayingMovies: `/movie/now_playing?api_key=${API_KEY}`,

    // TV Shows
    popularTV: `/tv/popular?api_key=${API_KEY}`,
    topRatedTV: `/tv/top_rated?api_key=${API_KEY}`,
    onTheAirTV: `/tv/on_the_air?api_key=${API_KEY}`,

    // Genres
    movieGenres: `/genre/movie/list?api_key=${API_KEY}`,
    tvGenres: `/genre/tv/list?api_key=${API_KEY}`,

    // Discover by genre
    discoverMovie: (genreId) => `/discover/movie?api_key=${API_KEY}&with_genres=${genreId}&sort_by=popularity.desc`,
    discoverTV: (genreId) => `/discover/tv?api_key=${API_KEY}&with_genres=${genreId}&sort_by=popularity.desc`,

    // Details
    movieDetails: (id) => `/movie/${id}?api_key=${API_KEY}&append_to_response=credits,images,videos,similar,recommendations`,
    tvDetails: (id) => `/tv/${id}?api_key=${API_KEY}&append_to_response=credits,images,videos,similar,recommendations`,

    // Search
    search: (query) => `/search/multi?api_key=${API_KEY}&query=${encodeURIComponent(query)}`,

    // Person
    personDetails: (id) => `/person/${id}?api_key=${API_KEY}&append_to_response=combined_credits,images`,
};

// Fetch wrapper
async function fetchFromTMDB(endpoint) {
    try {
        const response = await fetch(`${BASE_URL}${endpoint}`);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('TMDB API Error:', error);
        throw error;
    }
}

// API Functions
export const tmdbAPI = {
    // Trending
    getTrending: () => fetchFromTMDB(endpoints.trending),
    getTrendingMovies: () => fetchFromTMDB(endpoints.trendingMovies),
    getTrendingTV: () => fetchFromTMDB(endpoints.trendingTV),

    // Movies
    getPopularMovies: () => fetchFromTMDB(endpoints.popularMovies),
    getTopRatedMovies: () => fetchFromTMDB(endpoints.topRatedMovies),
    getUpcomingMovies: () => fetchFromTMDB(endpoints.upcomingMovies),
    getNowPlayingMovies: () => fetchFromTMDB(endpoints.nowPlayingMovies),

    // TV Shows
    getPopularTV: () => fetchFromTMDB(endpoints.popularTV),
    getTopRatedTV: () => fetchFromTMDB(endpoints.topRatedTV),
    getOnTheAirTV: () => fetchFromTMDB(endpoints.onTheAirTV),

    // Genres
    getMovieGenres: () => fetchFromTMDB(endpoints.movieGenres),
    getTVGenres: () => fetchFromTMDB(endpoints.tvGenres),

    // Discover by genre
    getMoviesByGenre: (genreId) => fetchFromTMDB(endpoints.discoverMovie(genreId)),
    getTVByGenre: (genreId) => fetchFromTMDB(endpoints.discoverTV(genreId)),

    // Details
    getMovieDetails: (id) => fetchFromTMDB(endpoints.movieDetails(id)),
    getTVDetails: (id) => fetchFromTMDB(endpoints.tvDetails(id)),

    // Search
    search: (query) => fetchFromTMDB(endpoints.search(query)),

    // Person
    getPersonDetails: (id) => fetchFromTMDB(endpoints.personDetails(id)),
};

// Genre ID mapping for quick access
export const GENRE_IDS = {
    action: 28,
    adventure: 12,
    animation: 16,
    comedy: 35,
    crime: 80,
    documentary: 99,
    drama: 18,
    family: 10751,
    fantasy: 14,
    history: 36,
    horror: 27,
    music: 10402,
    mystery: 9648,
    romance: 10749,
    scienceFiction: 878,
    thriller: 53,
    war: 10752,
    western: 37,
};

// Helper function to get image URL
export const getImageUrl = (path, type = 'poster', size = 'medium') => {
    if (!path) return null;
    return `${IMAGE_SIZES[type][size]}${path}`;
};

// Helper to format runtime
export const formatRuntime = (minutes) => {
    if (!minutes) return '';
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return hours > 0 ? `${hours}h ${mins}m` : `${mins}m`;
};

// Helper to format date
export const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
    });
};

// Helper to get year from date
export const getYear = (dateString) => {
    if (!dateString) return '';
    return new Date(dateString).getFullYear();
};

export default tmdbAPI;
