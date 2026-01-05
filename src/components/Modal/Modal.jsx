import { useState, useEffect } from 'react';
import { FiX, FiPlay, FiPlus, FiThumbsUp, FiUsers, FiImage } from 'react-icons/fi';
import { tmdbAPI, getImageUrl, formatRuntime, getYear } from '../../services/tmdb';
import './Modal.css';

const Modal = ({ movie, onClose }) => {
    const [details, setDetails] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchDetails = async () => {
            if (!movie) return;

            setLoading(true);
            try {
                const mediaType = movie.media_type || (movie.first_air_date ? 'tv' : 'movie');
                const data = mediaType === 'tv'
                    ? await tmdbAPI.getTVDetails(movie.id)
                    : await tmdbAPI.getMovieDetails(movie.id);
                setDetails(data);
            } catch (error) {
                console.error('Error fetching details:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchDetails();

        // Prevent body scroll when modal is open
        document.body.style.overflow = 'hidden';
        return () => {
            document.body.style.overflow = '';
        };
    }, [movie]);

    const handleBackdropClick = (e) => {
        if (e.target === e.currentTarget) {
            onClose();
        }
    };

    if (!movie) return null;

    const title = details?.title || details?.name || movie.title || movie.name;
    const releaseDate = details?.release_date || details?.first_air_date || movie.release_date || movie.first_air_date;
    const runtime = details?.runtime || (details?.episode_run_time?.[0]);
    const matchScore = Math.round((movie.vote_average || 0) * 10);
    const cast = details?.credits?.cast?.slice(0, 10) || [];
    const images = details?.images?.backdrops?.slice(0, 8) || [];
    const similar = details?.similar?.results?.slice(0, 6) || details?.recommendations?.results?.slice(0, 6) || [];

    return (
        <div className="modal-backdrop" onClick={handleBackdropClick}>
            <div className="modal">
                <button className="modal-close" onClick={onClose}>
                    <FiX />
                </button>

                {loading ? (
                    <div className="modal-loading">
                        <div className="loader"></div>
                        <p>Loading details...</p>
                    </div>
                ) : (
                    <>
                        {/* Header with Backdrop */}
                        <div className="modal-header">
                            {(details?.backdrop_path || movie.backdrop_path) && (
                                <img
                                    src={getImageUrl(details?.backdrop_path || movie.backdrop_path, 'backdrop', 'large')}
                                    alt={title}
                                    className="modal-backdrop-image"
                                />
                            )}
                            <div className="modal-header-gradient"></div>
                            <div className="modal-header-content">
                                <h2 className="modal-title">{title}</h2>
                                <div className="modal-buttons">
                                    <button className="modal-btn modal-btn-play">
                                        <FiPlay />
                                        Play
                                    </button>
                                    <button className="modal-btn-icon" title="Add to My List">
                                        <FiPlus />
                                    </button>
                                    <button className="modal-btn-icon" title="Like">
                                        <FiThumbsUp />
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Body */}
                        <div className="modal-body">
                            <div className="modal-info">
                                <div className="modal-main">
                                    <div className="modal-meta">
                                        <span className="modal-match">{matchScore}% Match</span>
                                        <span className="modal-year">{getYear(releaseDate)}</span>
                                        {runtime && <span className="modal-duration">{formatRuntime(runtime)}</span>}
                                        {details?.vote_average && (
                                            <span className="modal-rating-badge">
                                                ⭐ {details.vote_average.toFixed(1)}
                                            </span>
                                        )}
                                    </div>
                                    <p className="modal-overview">{details?.overview || movie.overview}</p>
                                </div>

                                <div className="modal-details">
                                    {details?.genres && details.genres.length > 0 && (
                                        <div className="modal-detail-row">
                                            <span className="modal-detail-label">Genres: </span>
                                            <div className="modal-genres">
                                                {details.genres.map((genre) => (
                                                    <span key={genre.id} className="modal-genre-tag">
                                                        {genre.name}
                                                    </span>
                                                ))}
                                            </div>
                                        </div>
                                    )}

                                    {details?.production_companies && details.production_companies.length > 0 && (
                                        <div className="modal-detail-row">
                                            <span className="modal-detail-label">Studio: </span>
                                            <span className="modal-detail-value">
                                                {details.production_companies.slice(0, 2).map(c => c.name).join(', ')}
                                            </span>
                                        </div>
                                    )}

                                    {details?.status && (
                                        <div className="modal-detail-row">
                                            <span className="modal-detail-label">Status: </span>
                                            <span className="modal-detail-value">{details.status}</span>
                                        </div>
                                    )}

                                    {details?.original_language && (
                                        <div className="modal-detail-row">
                                            <span className="modal-detail-label">Language: </span>
                                            <span className="modal-detail-value">
                                                {details.original_language.toUpperCase()}
                                            </span>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Cast Section */}
                            {cast.length > 0 && (
                                <div className="modal-section">
                                    <h3 className="modal-section-title">
                                        <FiUsers />
                                        Cast
                                    </h3>
                                    <div className="cast-grid">
                                        {cast.map((person) => (
                                            <div key={person.id} className="cast-card">
                                                {person.profile_path ? (
                                                    <img
                                                        src={getImageUrl(person.profile_path, 'profile', 'medium')}
                                                        alt={person.name}
                                                        className="cast-image"
                                                    />
                                                ) : (
                                                    <div className="cast-placeholder">
                                                        {person.name.charAt(0)}
                                                    </div>
                                                )}
                                                <p className="cast-name">{person.name}</p>
                                                <p className="cast-character">{person.character}</p>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Images Gallery */}
                            {images.length > 0 && (
                                <div className="modal-section">
                                    <h3 className="modal-section-title">
                                        <FiImage />
                                        Gallery
                                    </h3>
                                    <div className="images-scroll">
                                        {images.map((image, index) => (
                                            <img
                                                key={index}
                                                src={getImageUrl(image.file_path, 'backdrop', 'medium')}
                                                alt={`Scene ${index + 1}`}
                                                className="gallery-image"
                                            />
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Similar Movies */}
                            {similar.length > 0 && (
                                <div className="modal-section">
                                    <h3 className="modal-section-title">More Like This</h3>
                                    <div className="similar-grid">
                                        {similar.map((item) => (
                                            <div key={item.id} className="similar-card">
                                                {item.poster_path ? (
                                                    <img
                                                        src={getImageUrl(item.poster_path, 'poster', 'medium')}
                                                        alt={item.title || item.name}
                                                        className="similar-poster"
                                                    />
                                                ) : (
                                                    <div
                                                        className="similar-poster"
                                                        style={{
                                                            background: 'var(--gradient-purple)',
                                                            display: 'flex',
                                                            alignItems: 'center',
                                                            justifyContent: 'center',
                                                            padding: 'var(--space-sm)',
                                                            textAlign: 'center',
                                                            fontSize: 'var(--font-size-xs)'
                                                        }}
                                                    >
                                                        {item.title || item.name}
                                                    </div>
                                                )}
                                                <p className="similar-title">{item.title || item.name}</p>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};

export default Modal;
