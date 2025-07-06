import React, { useState } from 'react';
import { Link, withRouter } from 'react-router-dom';
import './Header.css';
import { useTranslation } from 'react-i18next';

const Header = ({ location }) => {
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
                    {/* Home */}
                    <Link 
                        to="/" 
                        className={`nav-link ${location.pathname === '/' ? 'active' : ''}`}
                        onClick={closeMenu}
                    >
                        🏠 {t('menu.home')}
                    </Link>
                    
                    {/* Content Generation Group */}
                    <div className="nav-group">
                        <div className="nav-group-label">Content Creation</div>
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
                            to="/history" 
                            className={`nav-link ${location.pathname === '/history' ? 'active' : ''}`}
                            onClick={closeMenu}
                        >
                            📚 {t('menu.history')}
                        </Link>
                    </div>
                    
                    {/* AI & Tools Group */}
                    <div className="nav-group">
                        <div className="nav-group-label">AI & Tools</div>
                        <Link 
                            to="/llama" 
                            className={`nav-link ${location.pathname === '/llama' ? 'active' : ''}`}
                            onClick={closeMenu}
                        >
                            🤖 {t('menu.llama')}
                        </Link>
                        <Link 
                            to="/customer-service-response" 
                            className={`nav-link ${location.pathname === '/customer-service-response' ? 'active' : ''}`}
                            onClick={closeMenu}
                        >
                            💬 {t('menu.chattyAgent')}
                        </Link>

                    </div>
                    
                    {/* Content Management Group */}
                    <div className="nav-group">
                        <div className="nav-group-label">Content Management</div>
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
                    </div>
                    
                    {/* Additional Services */}
                    <Link 
                        to="/customer-service" 
                        className={`nav-link ${location.pathname === '/customer-service' ? 'active' : ''}`}
                        onClick={closeMenu}
                    >
                        👨‍💼 {t('menu.customerService')}
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

export default withRouter(Header); 