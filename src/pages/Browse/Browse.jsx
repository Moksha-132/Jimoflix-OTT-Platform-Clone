import { useState, useEffect } from 'react';
import Modal from '../../components/Modal/Modal';
import Footer from '../../components/Footer/Footer';
import { tmdbAPI, getImageUrl, getYear, GENRE_IDS } from '../../services/tmdb';
import './Browse.css';

const Browse = ({ type = 'movie' }) => {
    const [movies, setMovies] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedGenre, setSelectedGenre] = useState(null);
    const [selectedMovie, setSelectedMovie] = useState(null);
    const [genres, setGenres] = useState([]);

    const isTV = type === 'tv';
    const title = isTV ? 'TV Shows' : 'Movies';

    useEffect(() => {
        const fetchGenres = async () => {
            try {
                const data = isTV
                    ? await tmdbAPI.getTVGenres()
                    : await tmdbAPI.getMovieGenres();
                setGenres(data.genres || []);
            } catch (error) {
                console.error('Error fetching genres:', error);
            }
        };

        fetchGenres();
    }, [isTV]);

    useEffect(() => {
        const fetchMovies = async () => {
            setLoading(true);
            try {
                let data;
                if (selectedGenre) {
                    data = isTV
                        ? await tmdbAPI.getTVByGenre(selectedGenre)
                        : await tmdbAPI.getMoviesByGenre(selectedGenre);
                } else {
                    data = isTV
                        ? await tmdbAPI.getPopularTV()
                        : await tmdbAPI.getPopularMovies();
                }
                setMovies(data.results || []);
            } catch (error) {
                console.error('Error fetching content:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchMovies();
    }, [selectedGenre, isTV]);

    const handleMovieClick = (movie) => {
        setSelectedMovie({ ...movie, media_type: type });
    };

    const handleCloseModal = () => {
        setSelectedMovie(null);
    };

    const handleGenreClick = (genreId) => {
        setSelectedGenre(selectedGenre === genreId ? null : genreId);
    };

    return (
        <div className="browse-page">
            <div className="browse-header">
                <h1 className="browse-title">{title}</h1>
                <div className="browse-filters">
                    <button
                        className={`browse-filter ${!selectedGenre ? 'active' : ''}`}
                        onClick={() => setSelectedGenre(null)}
                    >
                        All
                    </button>
                    {genres.map((genre) => (
                        <button
                            key={genre.id}
                            className={`browse-filter ${selectedGenre === genre.id ? 'active' : ''}`}
                            onClick={() => handleGenreClick(genre.id)}
                        >
                            {genre.name}
                        </button>
                    ))}
                </div>
            </div>

            <div className="browse-content">
                {loading ? (
                    <div className="browse-loading">
                        <div className="loader"></div>
                        <p>Loading {title.toLowerCase()}...</p>
                    </div>
                ) : (
                    <div className="browse-grid">
                        {movies.map((movie) => (
                            <div
                                key={movie.id}
                                className="browse-card"
                                onClick={() => handleMovieClick(movie)}
                            >
                                {movie.poster_path ? (
                                    <img
                                        src={getImageUrl(movie.poster_path, 'poster', 'medium')}
                                        alt={movie.title || movie.name}
                                        className="browse-card-poster"
                                        loading="lazy"
                                    />
                                ) : (
                                    <div className="browse-card-placeholder">
                                        {movie.title || movie.name}
                                    </div>
                                )}
                                <h3 className="browse-card-title">{movie.title || movie.name}</h3>
                                <div className="browse-card-meta">
                                    <span className="browse-card-rating">
                                        ⭐ {movie.vote_average?.toFixed(1)}
                                    </span>
                                    <span>{getYear(movie.release_date || movie.first_air_date)}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            <Footer />

            {selectedMovie && (
                <Modal movie={selectedMovie} onClose={handleCloseModal} />
            )}
        </div>
    );
};

export default Browse;
