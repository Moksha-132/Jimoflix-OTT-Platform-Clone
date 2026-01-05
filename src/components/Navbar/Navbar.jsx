import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { FiSearch, FiBell, FiChevronDown, FiMenu } from 'react-icons/fi';
import './Navbar.css';

const Navbar = () => {
    const [isScrolled, setIsScrolled] = useState(false);
    const [searchActive, setSearchActive] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const location = useLocation();
    const navigate = useNavigate();

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 50);
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const handleSearchSubmit = (e) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
            setSearchQuery('');
            setSearchActive(false);
        }
    };

    const navLinks = [
        { path: '/', label: 'Home' },
        { path: '/tv-shows', label: 'TV Shows' },
        { path: '/movies', label: 'Movies' },
        { path: '/new', label: 'New & Popular' },
        { path: '/my-list', label: 'My List' },
    ];

    return (
        <nav className={`navbar ${isScrolled ? 'scrolled' : ''}`}>
            <div className="navbar-left">
                <Link to="/" className="navbar-logo">
                    <span className="logo-text">JIMOFLIX</span>
                </Link>

                <ul className="navbar-nav">
                    {navLinks.map((link) => (
                        <li key={link.path}>
                            <Link
                                to={link.path}
                                className={`navbar-link ${location.pathname === link.path ? 'active' : ''}`}
                            >
                                {link.label}
                            </Link>
                        </li>
                    ))}
                </ul>
            </div>

            <div className="navbar-right">
                <form onSubmit={handleSearchSubmit} className={`search-container ${searchActive ? 'active' : ''}`}>
                    <button
                        type="button"
                        className="search-btn btn-icon"
                        onClick={() => setSearchActive(!searchActive)}
                    >
                        <FiSearch />
                    </button>
                    <input
                        type="text"
                        className="search-input"
                        placeholder="Titles, people, genres"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        onBlur={() => !searchQuery && setSearchActive(false)}
                    />
                </form>

                <button className="btn-icon notification-btn">
                    <FiBell />
                    <span className="notification-badge"></span>
                </button>

                <button className="profile-btn">
                    <div className="navbar-profile-avatar">J</div>
                    <FiChevronDown className="profile-dropdown-icon" />
                </button>

                <button className="mobile-menu-btn">
                    <FiMenu />
                </button>
            </div>
        </nav>
    );
};

export default Navbar;
