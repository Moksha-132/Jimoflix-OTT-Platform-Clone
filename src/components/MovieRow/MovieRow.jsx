import { useRef, useState, useEffect } from 'react';
import { FiChevronLeft, FiChevronRight, FiTrendingUp } from 'react-icons/fi';
import MovieCard from '../MovieCard/MovieCard';
import './MovieRow.css';

const MovieRow = ({
    title,
    movies = [],
    loading = false,
    showTrendingNumbers = false,
    variant = 'default',
    icon,
    onMovieClick
}) => {
    const scrollRef = useRef(null);
    const [canScrollLeft, setCanScrollLeft] = useState(false);
    const [canScrollRight, setCanScrollRight] = useState(true);

    const checkScroll = () => {
        if (scrollRef.current) {
            const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
            setCanScrollLeft(scrollLeft > 0);
            setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10);
        }
    };

    useEffect(() => {
        checkScroll();
        const scrollEl = scrollRef.current;
        if (scrollEl) {
            scrollEl.addEventListener('scroll', checkScroll);
            return () => scrollEl.removeEventListener('scroll', checkScroll);
        }
    }, [movies]);

    const scroll = (direction) => {
        if (scrollRef.current) {
            const scrollAmount = scrollRef.current.clientWidth * 0.8;
            scrollRef.current.scrollBy({
                left: direction === 'left' ? -scrollAmount : scrollAmount,
                behavior: 'smooth',
            });
        }
    };

    const renderSkeletons = () => {
        return Array(8).fill(0).map((_, index) => (
            <div key={index} className="skeleton-card"></div>
        ));
    };

    return (
        <section className={`movie-row ${showTrendingNumbers ? 'trending' : ''} ${variant}`}>
            <div className="movie-row-header">
                <h2 className="movie-row-title">
                    {icon || (showTrendingNumbers && <FiTrendingUp className="movie-row-title-icon" />)}
                    {title}
                </h2>
            </div>

            <div className="movie-row-container">
                <button
                    className="movie-row-nav prev"
                    onClick={() => scroll('left')}
                    disabled={!canScrollLeft}
                    aria-label="Scroll left"
                >
                    <FiChevronLeft />
                </button>

                <div
                    ref={scrollRef}
                    className="movie-row-scroll"
                    onScroll={checkScroll}
                >
                    {loading ? (
                        renderSkeletons()
                    ) : (
                        movies.map((movie, index) => (
                            <MovieCard
                                key={movie.id}
                                movie={movie}
                                index={index + 1}
                                showTrendingNumber={showTrendingNumbers}
                                variant={variant === 'backdrop' ? 'backdrop' : 'default'}
                                onClick={onMovieClick}
                            />
                        ))
                    )}
                </div>

                <button
                    className="movie-row-nav next"
                    onClick={() => scroll('right')}
                    disabled={!canScrollRight}
                    aria-label="Scroll right"
                >
                    <FiChevronRight />
                </button>
            </div>
        </section>
    );
};

export default MovieRow;
