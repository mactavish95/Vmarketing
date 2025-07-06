import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import './Header.css';
import { useTranslation } from 'react-i18next';

const Header = () => {
    const location = useLocation();
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const { t, i18n } = useTranslation();

    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    };

    const closeMenu = () => {
        setIsMenuOpen(false);
    };

    const changeLanguage = (lng) => {
        i18n.changeLanguage(lng);
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
                        🏠 {t('menu.home')}
                    </Link>
                    <Link 
                        to="/generate" 
                        className={`nav-link ${location.pathname === '/generate' ? 'active' : ''}`}
                        onClick={closeMenu}
                    >
                        ✍️ {t('menu.generate')}
                    </Link>
                    <Link 
                        to="/voice" 
                        className={`nav-link ${location.pathname === '/voice' ? 'active' : ''}`}
                        onClick={closeMenu}
                    >
                        🎤 {t('menu.voice')}
                    </Link>
                    <Link 
                        to="/llama" 
                        className={`nav-link ${location.pathname === '/llama' ? 'active' : ''}`}
                        onClick={closeMenu}
                    >
                        🤖 {t('menu.llama')}
                    </Link>
                    <Link 
                        to="/history" 
                        className={`nav-link ${location.pathname === '/history' ? 'active' : ''}`}
                        onClick={closeMenu}
                    >
                        📚 {t('menu.history')}
                    </Link>
                    <Link 
                        to="/customer-service-response" 
                        className={`nav-link ${location.pathname === '/customer-service-response' ? 'active' : ''}`}
                        onClick={closeMenu}
                    >
                        💬 {t('menu.chattyAgent')}
                    </Link>
                    <Link 
                        to="/models" 
                        className={`nav-link ${location.pathname === '/models' ? 'active' : ''}`}
                        onClick={closeMenu}
                    >
                        🤖 {t('menu.aiModels')}
                    </Link>
                    <Link 
                        to="/blog" 
                        className={`nav-link ${location.pathname.startsWith('/blog') && !location.pathname.includes('/blog-creator') ? 'active' : ''}`}
                        onClick={closeMenu}
                    >
                        📝 {t('menu.blog')}
                    </Link>
                    <Link 
                        to="/blog-creator" 
                        className={`nav-link ${location.pathname === '/blog-creator' ? 'active' : ''}`}
                        onClick={closeMenu}
                    >
                        ✍️ {t('menu.blogCreator')}
                    </Link>
                    <Link 
                        to="/social-media" 
                        className={`nav-link ${location.pathname === '/social-media' ? 'active' : ''}`}
                        onClick={closeMenu}
                    >
                        📱 {t('menu.socialMedia')}
                    </Link>
                    <Link 
                        to="/customer-service" 
                        className={`nav-link ${location.pathname === '/customer-service' ? 'active' : ''}`}
                        onClick={closeMenu}
                    >
                        👨‍💼 {t('menu.customerService')}
                    </Link>
                    <Link 
                        to="/models-info" 
                        className={`nav-link ${location.pathname === '/models-info' ? 'active' : ''}`}
                        onClick={closeMenu}
                    >
                        ℹ️ {t('menu.modelsInfo')}
                    </Link>
                </nav>
            </div>
            
            {/* Mobile menu overlay */}
            {isMenuOpen && (
                <div className="mobile-overlay" onClick={closeMenu}></div>
            )}

            <div style={{ position: 'absolute', right: 20, top: 20, zIndex: 100 }}>
                <label htmlFor="lang-switch" style={{ marginRight: 8 }}>{t('language')}:</label>
                <select
                    id="lang-switch"
                    value={i18n.language}
                    onChange={e => changeLanguage(e.target.value)}
                    style={{ padding: '4px 8px', borderRadius: 6 }}
                >
                    <option value="en">{t('english')}</option>
                    <option value="vi">{t('vietnamese')}</option>
                </select>
            </div>
        </header>
    );
};

export default Header; 