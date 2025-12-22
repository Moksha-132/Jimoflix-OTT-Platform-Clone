import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiPlay, FiPlus, FiCheck, FiThumbsUp, FiChevronDown } from 'react-icons/fi';
import { getImageUrl, getYear } from '../../services/tmdb';
import './MovieCard.css';

const MovieCard = ({
    movie,
    index,
    showTrendingNumber = false,
    variant = 'default',
    onClick
}) => {
    const [imageLoaded, setImageLoaded] = useState(false);
    const [isInList, setIsInList] = useState(() => {
        const myList = JSON.parse(localStorage.getItem('myList') || '[]');
        return myList.some(item => item.id === movie?.id);
    });
    const navigate = useNavigate();

    if (!movie) return null;

    const title = movie.title || movie.name;
    const releaseDate = movie.release_date || movie.first_air_date;
    const posterPath = variant === 'backdrop' ? movie.backdrop_path : movie.poster_path;
    const imageType = variant === 'backdrop' ? 'backdrop' : 'poster';
    const matchScore = Math.round((movie.vote_average || 0) * 10);

    const handleClick = () => {
        if (onClick) {
            onClick(movie);
        }
    };

    const handleAddToList = (e) => {
        e.stopPropagation();
        const myList = JSON.parse(localStorage.getItem('myList') || '[]');

        if (isInList) {
            // Remove from list
            const updatedList = myList.filter(item => item.id !== movie.id);
            localStorage.setItem('myList', JSON.stringify(updatedList));
            setIsInList(false);
        } else {
            // Add to list
            myList.push({
                id: movie.id,
                title: movie.title || movie.name,
                poster_path: movie.poster_path,
                backdrop_path: movie.backdrop_path,
                vote_average: movie.vote_average,
                release_date: movie.release_date || movie.first_air_date,
                media_type: movie.media_type || 'movie'
            });
            localStorage.setItem('myList', JSON.stringify(myList));
            setIsInList(true);
            // Navigate to My List page
            navigate('/my-list');
        }
    };

    return (
        <div
            className={`movie-card ${showTrendingNumber ? 'trending' : ''} ${variant}`}
            onClick={handleClick}
        >
            {showTrendingNumber && (
                <span className="trending-number">{index}</span>
            )}

            <div className="movie-card-inner">
                {posterPath ? (
                    <img
                        src={getImageUrl(posterPath, imageType, 'medium')}
                        alt={title}
                        className={`movie-card-poster ${imageLoaded ? '' : 'loading'}`}
                        onLoad={() => setImageLoaded(true)}
                        loading="lazy"
                    />
                ) : (
                    <div className="movie-card-poster" style={{
                        background: 'var(--gradient-purple)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        padding: 'var(--space-md)',
                        textAlign: 'center',
                        fontSize: 'var(--font-size-sm)'
                    }}>
                        {title}
                    </div>
                )}

                <div className="movie-card-overlay">
                    <h3 className="movie-card-title">{title}</h3>

                    <div className="movie-card-meta">
                        <span className="movie-card-match">{matchScore}% Match</span>
                        <span>{getYear(releaseDate)}</span>
                    </div>

                    <div className="movie-card-actions">
                        <button className="movie-card-action-btn play-btn" title="Play">
                            <FiPlay />
                        </button>
                        <button
                            className={`movie-card-action-btn ${isInList ? 'in-list' : ''}`}
                            title={isInList ? 'Remove from My List' : 'Add to My List'}
                            onClick={handleAddToList}
                        >
                            {isInList ? <FiCheck /> : <FiPlus />}
                        </button>
                        <button className="movie-card-action-btn" title="Like">
                            <FiThumbsUp />
                        </button>
                        <button
                            className="movie-card-action-btn"
                            title="More Info"
                            style={{ marginLeft: 'auto' }}
                        >
                            <FiChevronDown />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MovieCard;

