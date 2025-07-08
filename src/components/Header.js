import React, { useState, useEffect } from 'react';
import { Link, withRouter } from 'react-router-dom';
import './Header.css';
import { useTranslation } from 'react-i18next';

const Header = ({ location }) => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isMobile, setIsMobile] = useState(false);
    const { t, i18n } = useTranslation();

    // Language configuration with flags
    const languages = [
        { code: 'en', name: t('english'), flag: '🇺🇸', shortName: 'EN', supported: true },
        { code: 'vi', name: t('vietnamese'), flag: '🇻🇳', shortName: 'VI', supported: true },
        { code: 'es', name: 'Español', flag: '🇪🇸', shortName: 'ES', supported: false },
        { code: 'fr', name: 'Français', flag: '🇫🇷', shortName: 'FR', supported: false },
        { code: 'de', name: 'Deutsch', flag: '🇩🇪', shortName: 'DE', supported: false },
        { code: 'zh', name: '中文', flag: '🇨🇳', shortName: 'ZH', supported: false },
        { code: 'ja', name: '日本語', flag: '🇯🇵', shortName: 'JA', supported: false },
        { code: 'ko', name: '한국어', flag: '🇰🇷', shortName: 'KO', supported: false }
    ];

    // Filter to only show supported languages
    const supportedLanguages = languages.filter(lang => lang.supported);

    // Function to get flag emoji with fallback
    const getFlagEmoji = (countryCode) => {
        const flagMap = {
            'en': '🇺🇸',
            'vi': '🇻🇳',
            'es': '🇪🇸',
            'fr': '🇫🇷',
            'de': '🇩🇪',
            'zh': '🇨🇳',
            'ja': '🇯🇵',
            'ko': '🇰🇷'
        };
        
        // Simple fallback check - if the flag renders as a single character, it's likely supported
        const testFlag = flagMap[countryCode] || '🇺🇸';
        
        // Try to detect if emoji is supported by checking if it's a single character
        // This is a simple heuristic that works in most cases
        if (testFlag.length === 2) { // Flag emojis are typically 2 characters in JS
            return flagMap[countryCode] || '🌐';
        } else {
            // Fallback to country codes if flags don't render properly
            const codeMap = {
                'en': '🇺🇸',
                'vi': '🇻🇳',
                'es': '🇪🇸',
                'fr': '🇫🇷',
                'de': '🇩🇪',
                'zh': '🇨🇳',
                'ja': '🇯🇵',
                'ko': '🇰🇷'
            };
            return codeMap[countryCode] || '🌐';
        }
    };

    // Check if screen is mobile size
    useEffect(() => {
        const checkMobile = () => {
            setIsMobile(window.innerWidth <= 768);
        };
        
        checkMobile();
        window.addEventListener('resize', checkMobile);
        
        return () => window.removeEventListener('resize', checkMobile);
    }, []);

    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    };

    const closeMenu = () => {
        setIsMenuOpen(false);
    };

    const changeLanguage = (lng) => {
        i18n.changeLanguage(lng);
    };

    // Get current language info
    const currentLanguage = supportedLanguages.find(lang => lang.code === i18n.language) || supportedLanguages[0];

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

            <div className="language-selector" style={{ 
                position: 'absolute', 
                right: isMobile ? 60 : 20, 
                top: isMobile ? 15 : 20, 
                zIndex: 100
            }}>
                <label 
                    htmlFor="lang-switch" 
                    style={{ 
                        marginRight: isMobile ? 4 : 8,
                        fontSize: isMobile ? '12px' : '14px',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '4px'
                    }}
                >
                    {isMobile ? '🌐' : `${getFlagEmoji(currentLanguage.code)} ${t('language')}`}:
                </label>
                <select
                    id="lang-switch"
                    value={i18n.language}
                    onChange={e => changeLanguage(e.target.value)}
                    style={{ 
                        padding: isMobile ? '2px 4px' : '4px 8px', 
                        fontSize: isMobile ? '12px' : '14px',
                        minWidth: isMobile ? '60px' : '100px'
                    }}
                >
                    {supportedLanguages.map(lang => (
                        <option key={lang.code} value={lang.code} style={{ fontSize: '14px' }}>
                            {getFlagEmoji(lang.code)} {isMobile ? lang.shortName : lang.name}
                        </option>
                    ))}
                </select>
            </div>
        </header>
    );
};

export default withRouter(Header); 