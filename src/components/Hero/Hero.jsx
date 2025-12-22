import { useState, useEffect } from 'react';
import { FiPlay, FiInfo, FiStar } from 'react-icons/fi';
import { getImageUrl, getYear, formatRuntime } from '../../services/tmdb';
import './Hero.css';

const Hero = ({ movie, onMoreInfo, loading }) => {
    const [imageLoaded, setImageLoaded] = useState(false);

    useEffect(() => {
        if (movie?.backdrop_path) {
            const img = new Image();
            img.src = getImageUrl(movie.backdrop_path, 'backdrop', 'original');
            img.onload = () => setImageLoaded(true);
        }
    }, [movie]);

    if (loading || !movie) {
        return (
            <section className="hero hero-skeleton">
                <div className="hero-gradient"></div>
                <div className="hero-content">
                    <div className="skeleton skeleton-badge"></div>
                    <div className="skeleton skeleton-title"></div>
                    <div className="skeleton skeleton-meta"></div>
                    <div className="skeleton skeleton-description"></div>
                    <div className="skeleton-buttons">
                        <div className="skeleton skeleton-button"></div>
                        <div className="skeleton skeleton-button"></div>
                    </div>
                </div>
            </section>
        );
    }

    const title = movie.title || movie.name;
    const releaseDate = movie.release_date || movie.first_air_date;
    const rating = movie.vote_average?.toFixed(1);
    const mediaType = movie.media_type === 'tv' ? 'TV Series' : 'Movie';

    return (
        <section className="hero">
            {movie.backdrop_path && (
                <img
                    src={getImageUrl(movie.backdrop_path, 'backdrop', 'original')}
                    alt={title}
                    className="hero-backdrop"
                    style={{ opacity: imageLoaded ? 1 : 0, transition: 'opacity 0.5s ease' }}
                />
            )}
            <div className="hero-gradient"></div>

            <div className="hero-content">
                <span className="hero-badge">
                    <FiStar />
                    Top Trending
                </span>

                <h1 className="hero-title">{title}</h1>

                <div className="hero-meta">
                    <span className="hero-score">{Math.round(movie.vote_average * 10)}% Match</span>
                    <span className="hero-year">{getYear(releaseDate)}</span>
                    {movie.runtime && <span className="hero-duration">{formatRuntime(movie.runtime)}</span>}
                    <span className="hero-rating">{mediaType}</span>
                </div>

                {movie.genres && movie.genres.length > 0 && (
                    <div className="hero-genres">
                        {movie.genres.slice(0, 3).map((genre) => (
                            <span key={genre.id} className="hero-genre-tag">
                                {genre.name}
                            </span>
                        ))}
                    </div>
                )}

                <p className="hero-description">{movie.overview}</p>

                <div className="hero-buttons">
                    <button className="hero-btn hero-btn-play">
                        <FiPlay />
                        Play
                    </button>
                    <button className="hero-btn hero-btn-info" onClick={() => onMoreInfo && onMoreInfo(movie)}>
                        <FiInfo />
                        More Info
                    </button>
                </div>
            </div>
        </section>
    );
};

export default Hero;
