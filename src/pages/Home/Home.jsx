import { useState, useEffect } from 'react';
import { FiFilm, FiTv, FiHeart, FiZap, FiSmile, FiTarget, FiBook, FiCoffee } from 'react-icons/fi';
import Hero from '../../components/Hero/Hero';
import MovieRow from '../../components/MovieRow/MovieRow';
import Modal from '../../components/Modal/Modal';
import Footer from '../../components/Footer/Footer';
import { tmdbAPI, GENRE_IDS } from '../../services/tmdb';
import './Home.css';

const Home = () => {
    const [loading, setLoading] = useState(true);
    const [heroMovie, setHeroMovie] = useState(null);
    const [trending, setTrending] = useState([]);
    const [popularMovies, setPopularMovies] = useState([]);
    const [topRatedMovies, setTopRatedMovies] = useState([]);
    const [popularTV, setPopularTV] = useState([]);
    const [actionMovies, setActionMovies] = useState([]);
    const [comedyMovies, setComedyMovies] = useState([]);
    const [horrorMovies, setHorrorMovies] = useState([]);
    const [romanceMovies, setRomanceMovies] = useState([]);
    const [dramaMovies, setDramaMovies] = useState([]);
    const [sciFiMovies, setSciFiMovies] = useState([]);
    const [selectedMovie, setSelectedMovie] = useState(null);

    useEffect(() => {
        const fetchAllData = async () => {
            setLoading(true);
            try {
                // Fetch all data in parallel
                const [
                    trendingData,
                    popularMoviesData,
                    topRatedData,
                    popularTVData,
                    actionData,
                    comedyData,
                    horrorData,
                    romanceData,
                    dramaData,
                    sciFiData,
                ] = await Promise.all([
                    tmdbAPI.getTrending(),
                    tmdbAPI.getPopularMovies(),
                    tmdbAPI.getTopRatedMovies(),
                    tmdbAPI.getPopularTV(),
                    tmdbAPI.getMoviesByGenre(GENRE_IDS.action),
                    tmdbAPI.getMoviesByGenre(GENRE_IDS.comedy),
                    tmdbAPI.getMoviesByGenre(GENRE_IDS.horror),
                    tmdbAPI.getMoviesByGenre(GENRE_IDS.romance),
                    tmdbAPI.getMoviesByGenre(GENRE_IDS.drama),
                    tmdbAPI.getMoviesByGenre(GENRE_IDS.scienceFiction),
                ]);

                // Set hero movie from trending
                if (trendingData.results && trendingData.results.length > 0) {
                    // Get a random movie from top 5 trending for variety
                    const randomIndex = Math.floor(Math.random() * Math.min(5, trendingData.results.length));
                    const heroCandidate = trendingData.results[randomIndex];

                    // Fetch detailed info for hero
                    const mediaType = heroCandidate.media_type || 'movie';
                    const details = mediaType === 'tv'
                        ? await tmdbAPI.getTVDetails(heroCandidate.id)
                        : await tmdbAPI.getMovieDetails(heroCandidate.id);

                    setHeroMovie({ ...heroCandidate, ...details });
                }

                setTrending(trendingData.results?.slice(0, 10) || []);
                setPopularMovies(popularMoviesData.results || []);
                setTopRatedMovies(topRatedData.results || []);
                setPopularTV(popularTVData.results || []);
                setActionMovies(actionData.results || []);
                setComedyMovies(comedyData.results || []);
                setHorrorMovies(horrorData.results || []);
                setRomanceMovies(romanceData.results || []);
                setDramaMovies(dramaData.results || []);
                setSciFiMovies(sciFiData.results || []);
            } catch (error) {
                console.error('Error fetching data:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchAllData();
    }, []);

    const handleMovieClick = (movie) => {
        setSelectedMovie(movie);
    };

    const handleCloseModal = () => {
        setSelectedMovie(null);
    };

    return (
        <div className="home-page">
            <Hero
                movie={heroMovie}
                loading={loading}
                onMoreInfo={handleMovieClick}
            />

            <div className="content-sections">
                {/* Top 10 Trending */}
                <MovieRow
                    title="Top 10 Trending Today"
                    movies={trending}
                    loading={loading}
                    showTrendingNumbers={true}
                    onMovieClick={handleMovieClick}
                />

                {/* Popular Movies */}
                <MovieRow
                    title="Popular Movies"
                    movies={popularMovies}
                    loading={loading}
                    icon={<FiFilm className="movie-row-title-icon" />}
                    onMovieClick={handleMovieClick}
                />

                {/* Popular TV Shows */}
                <MovieRow
                    title="Popular TV Shows"
                    movies={popularTV}
                    loading={loading}
                    icon={<FiTv className="movie-row-title-icon" />}
                    onMovieClick={handleMovieClick}
                />

                {/* Top Rated */}
                <MovieRow
                    title="Top Rated Movies"
                    movies={topRatedMovies}
                    loading={loading}
                    onMovieClick={handleMovieClick}
                />

                {/* Action Movies */}
                <div className="genre-section">
                    <MovieRow
                        title="Action & Adventure"
                        movies={actionMovies}
                        loading={loading}
                        icon={<FiZap className="movie-row-title-icon" />}
                        variant="backdrop"
                        onMovieClick={handleMovieClick}
                    />
                </div>

                {/* Comedy Movies */}
                <MovieRow
                    title="Comedy"
                    movies={comedyMovies}
                    loading={loading}
                    icon={<FiSmile className="movie-row-title-icon" />}
                    onMovieClick={handleMovieClick}
                />

                {/* Horror Movies */}
                <MovieRow
                    title="Horror"
                    movies={horrorMovies}
                    loading={loading}
                    icon={<FiTarget className="movie-row-title-icon" />}
                    onMovieClick={handleMovieClick}
                />

                {/* Romance Movies */}
                <MovieRow
                    title="Romance"
                    movies={romanceMovies}
                    loading={loading}
                    icon={<FiHeart className="movie-row-title-icon" />}
                    onMovieClick={handleMovieClick}
                />

                {/* Drama Movies */}
                <MovieRow
                    title="Drama"
                    movies={dramaMovies}
                    loading={loading}
                    icon={<FiBook className="movie-row-title-icon" />}
                    onMovieClick={handleMovieClick}
                />

                {/* Sci-Fi Movies */}
                <div className="genre-section">
                    <MovieRow
                        title="Sci-Fi & Fantasy"
                        movies={sciFiMovies}
                        loading={loading}
                        icon={<FiCoffee className="movie-row-title-icon" />}
                        variant="backdrop"
                        onMovieClick={handleMovieClick}
                    />
                </div>
            </div>

            <Footer />

            {/* Movie Details Modal */}
            {selectedMovie && (
                <Modal movie={selectedMovie} onClose={handleCloseModal} />
            )}
        </div>
    );
};

export default Home;
