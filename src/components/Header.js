import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import './Header.css';

const Header = () => {
    const location = useLocation();
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    };

    const closeMenu = () => {
        setIsMenuOpen(false);
    };

    return (
        <header className="header">
            <div className="header-content">
                <Link to="/" className="logo" onClick={closeMenu}>
                    <span className="logo-icon">⭐</span>
                    <span className="logo-text">ReviewGen</span>
                </Link>
                
                {/* Mobile hamburger menu */}
                <button 
                    className={`hamburger ${isMenuOpen ? 'active' : ''}`}
                    onClick={toggleMenu}
                    aria-label="Toggle navigation menu"
                >
                    <span></span>
                    <span></span>
                    <span></span>
                </button>
                
                <nav className={`nav-menu ${isMenuOpen ? 'active' : ''}`}>
                    <Link 
                        to="/" 
                        className={`nav-link ${location.pathname === '/' ? 'active' : ''}`}
                        onClick={closeMenu}
                    >
                        🏠 Home
                    </Link>
                    <Link 
                        to="/generate" 
                        className={`nav-link ${location.pathname === '/generate' ? 'active' : ''}`}
                        onClick={closeMenu}
                    >
                        ✍️ Generate
                    </Link>
                    <Link 
                        to="/voice" 
                        className={`nav-link ${location.pathname === '/voice' ? 'active' : ''}`}
                        onClick={closeMenu}
                    >
                        🎤 Voice
                    </Link>
                    <Link 
                        to="/llama" 
                        className={`nav-link ${location.pathname === '/llama' ? 'active' : ''}`}
                        onClick={closeMenu}
                    >
                        🤖 Llama
                    </Link>
                    <Link 
                        to="/history" 
                        className={`nav-link ${location.pathname === '/history' ? 'active' : ''}`}
                        onClick={closeMenu}
                    >
                        📚 History
                    </Link>
                    <Link 
                        to="/customer-service-response" 
                        className={`nav-link ${location.pathname === '/customer-service-response' ? 'active' : ''}`}
                        onClick={closeMenu}
                    >
                        💬 Chatty Agent
                    </Link>
                    <Link 
                        to="/models" 
                        className={`nav-link ${location.pathname === '/models' ? 'active' : ''}`}
                        onClick={closeMenu}
                    >
                        🤖 AI Models
                    </Link>
                    <Link 
                        to="/blog" 
                        className={`nav-link ${location.pathname.startsWith('/blog') && !location.pathname.includes('/blog-creator') ? 'active' : ''}`}
                        onClick={closeMenu}
                    >
                        📝 Blog
                    </Link>
                    <Link 
                        to="/blog-creator" 
                        className={`nav-link ${location.pathname === '/blog-creator' ? 'active' : ''}`}
                        onClick={closeMenu}
                    >
                        ✍️ Blog Creator
                    </Link>
                </nav>
            </div>
            
            {/* Mobile menu overlay */}
            {isMenuOpen && (
                <div className="mobile-overlay" onClick={closeMenu}></div>
            )}
        </header>
    );
};

export default Header; 