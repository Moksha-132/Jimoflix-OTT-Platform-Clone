import { FiHeart } from 'react-icons/fi';
import './Footer.css';

const Footer = () => {
    return (
        <footer className="footer">
            <div className="footer-content">
                <div className="footer-copyright">
                    <span className="footer-logo">JIMOFLIX</span>
                    <p className="footer-credit">
                        Made with <FiHeart className="heart-icon" /> by <span className="creator-name">Moksha</span>
                    </p>
                    <p className="footer-year">© 2024 Jimoflix</p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
