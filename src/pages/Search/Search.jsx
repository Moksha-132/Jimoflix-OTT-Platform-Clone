import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { FiSearch } from 'react-icons/fi';
import Modal from '../../components/Modal/Modal';
import Footer from '../../components/Footer/Footer';
import { tmdbAPI, getImageUrl, getYear } from '../../services/tmdb';
import './Search.css';

const Search = () => {
    const [searchParams] = useSearchParams();
    const query = searchParams.get('q') || '';
    const [results, setResults] = useState([]);
    const [loading, setLoading] = useState(false);
    const [selectedMovie, setSelectedMovie] = useState(null);

    useEffect(() => {
        const fetchResults = async () => {
            if (!query.trim()) {
                setResults([]);
                return;
            }

            setLoading(true);
            try {
                const data = await tmdbAPI.search(query);
                // Filter to only movies and TV shows
                const filtered = data.results?.filter(
                    (item) => item.media_type === 'movie' || item.media_type === 'tv'
                ) || [];
                setResults(filtered);
            } catch (error) {
                console.error('Search error:', error);
                setResults([]);
            } finally {
                setLoading(false);
            }
        };

        fetchResults();
    }, [query]);

    const handleMovieClick = (movie) => {
        setSelectedMovie(movie);
    };

    const handleCloseModal = () => {
        setSelectedMovie(null);
    };

    return (
        <div className="search-page">
            <div className="search-header">
                <h1 className="search-title">
                    {query ? (
                        <>
                            Results for "<span className="search-query">{query}</span>"
                        </>
                    ) : (
                        'Search'
                    )}
                </h1>
                {results.length > 0 && (
                    <p className="search-count">{results.length} titles found</p>
                )}
            </div>

            {loading ? (
                <div className="search-loading">
                    <div className="loader"></div>
                    <p>Searching...</p>
                </div>
            ) : results.length > 0 ? (
                <div className="search-grid">
                    {results.map((item) => (
                        <div
                            key={item.id}
                            className="search-card"
                            onClick={() => handleMovieClick(item)}
                        >
                            {item.poster_path ? (
                                <img
                                    src={getImageUrl(item.poster_path, 'poster', 'medium')}
                                    alt={item.title || item.name}
                                    className="search-card-poster"
                                    loading="lazy"
                                />
                            ) : (
                                <div className="search-card-placeholder">
                                    {item.title || item.name}
                                </div>
                            )}
                            <h3 className="search-card-title">{item.title || item.name}</h3>
                            <div className="search-card-meta">
                                <span className="search-card-type">{item.media_type}</span>
                                <span>{getYear(item.release_date || item.first_air_date)}</span>
                            </div>
                        </div>
                    ))}
                </div>
            ) : query ? (
                <div className="search-empty">
                    <FiSearch className="search-empty-icon" />
                    <h2 className="search-empty-title">No results found</h2>
                    <p className="search-empty-text">
                        We couldn't find anything matching "{query}". Try different keywords.
                    </p>
                </div>
            ) : (
                <div className="search-empty">
                    <FiSearch className="search-empty-icon" />
                    <h2 className="search-empty-title">Search for movies and TV shows</h2>
                    <p className="search-empty-text">
                        Use the search bar above to find your favorite content.
                    </p>
                </div>
            )}

            <Footer />

            {selectedMovie && (
                <Modal movie={selectedMovie} onClose={handleCloseModal} />
            )}
        </div>
    );
};

export default Search;
