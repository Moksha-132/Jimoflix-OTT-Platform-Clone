import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiBookmark, FiX, FiPlay } from 'react-icons/fi';
import Modal from '../../components/Modal/Modal';
import Footer from '../../components/Footer/Footer';
import { getImageUrl, getYear } from '../../services/tmdb';
import './MyList.css';

const MyList = () => {
    const [myList, setMyList] = useState([]);
    const [selectedMovie, setSelectedMovie] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const savedList = JSON.parse(localStorage.getItem('myList') || '[]');
        setMyList(savedList);
    }, []);

    const handleRemove = (e, movieId) => {
        e.stopPropagation();
        const updatedList = myList.filter(movie => movie.id !== movieId);
        localStorage.setItem('myList', JSON.stringify(updatedList));
        setMyList(updatedList);
    };

    const handleMovieClick = (movie) => {
        setSelectedMovie(movie);
    };

    const handleCloseModal = () => {
        setSelectedMovie(null);
    };

    return (
        <div className="mylist-page">
            <div className="mylist-header">
                <h1 className="mylist-title">My List</h1>
                <p className="mylist-subtitle">
                    {myList.length > 0
                        ? `${myList.length} title${myList.length > 1 ? 's' : ''} in your list`
                        : 'Your personal collection of movies and shows'
                    }
                </p>
            </div>

            {myList.length > 0 ? (
                <div className="mylist-grid">
                    {myList.map((movie) => (
                        <div
                            key={movie.id}
                            className="mylist-card"
                            onClick={() => handleMovieClick(movie)}
                        >
                            <button
                                className="mylist-card-remove"
                                onClick={(e) => handleRemove(e, movie.id)}
                                title="Remove from My List"
                            >
                                <FiX />
                            </button>

                            {movie.poster_path ? (
                                <img
                                    src={getImageUrl(movie.poster_path, 'poster', 'medium')}
                                    alt={movie.title}
                                    className="mylist-card-poster"
                                    loading="lazy"
                                />
                            ) : (
                                <div className="mylist-card-placeholder">
                                    {movie.title}
                                </div>
                            )}

                            <div className="mylist-card-info">
                                <h3 className="mylist-card-title">{movie.title}</h3>
                                <div className="mylist-card-meta">
                                    <span className="mylist-card-rating">
                                        ⭐ {movie.vote_average?.toFixed(1)}
                                    </span>
                                    <span>{getYear(movie.release_date)}</span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="mylist-empty">
                    <FiBookmark className="mylist-empty-icon" />
                    <h2 className="mylist-empty-title">Your list is empty</h2>
                    <p className="mylist-empty-text">
                        Add movies and shows to your list by clicking the + button on any title.
                    </p>
                    <button
                        className="mylist-browse-btn"
                        onClick={() => navigate('/')}
                    >
                        <FiPlay />
                        Browse Movies
                    </button>
                </div>
            )}

            <Footer />

            {selectedMovie && (
                <Modal movie={selectedMovie} onClose={handleCloseModal} />
            )}
        </div>
    );
};

export default MyList;
