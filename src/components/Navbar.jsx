import { Link } from "react-router-dom";
import { useState } from "react";

function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <>
      <nav style={styles.nav}>
        <div style={styles.logoContainer}>
          <div style={styles.logoIcon}>🏭</div>
          <div style={styles.logoTextContainer}>
            <h2 style={styles.logo}>Sri Srinivasa</h2>
            <span style={styles.logoSub}>Clean Rooms</span>
          </div>
        </div>

        {/* Desktop Links */}
        <div style={styles.links}>
          <Link to="/" style={styles.link}>Home</Link>
          <Link to="/products" style={styles.link}>Products</Link>
          <Link to="/about" style={styles.link}>About</Link>
          <Link to="/contact" style={styles.link}>Contact</Link>
        </div>

        <div style={styles.rightSection}>
          <button style={styles.btn}>Login</button>
          
          {/* Hamburger Menu Button - Mobile Only */}
          <button 
            style={styles.hamburger} 
            onClick={toggleMenu}
            aria-label="Toggle menu"
          >
            <span style={{...styles.hamburgerLine, transform: isMenuOpen ? 'rotate(45deg) translate(5px, 5px)' : 'none'}}></span>
            <span style={{...styles.hamburgerLine, opacity: isMenuOpen ? 0 : 1}}></span>
            <span style={{...styles.hamburgerLine, transform: isMenuOpen ? 'rotate(-45deg) translate(7px, -7px)' : 'none'}}></span>
          </button>
        </div>
      </nav>

      {/* Mobile Menu Drawer */}
      <div style={{...styles.mobileDrawer, transform: isMenuOpen ? 'translateX(0)' : 'translateX(100%)'}}>
        <div style={styles.mobileDrawerContent}>
          <Link 
            to="/" 
            style={styles.mobileLink} 
            onClick={() => setIsMenuOpen(false)}
          >
            <span style={styles.mobileLinkIcon}>🏠</span>
            Home
          </Link>
          <Link 
            to="/products" 
            style={styles.mobileLink} 
            onClick={() => setIsMenuOpen(false)}
          >
            <span style={styles.mobileLinkIcon}>📦</span>
            Products
          </Link>
          <Link 
            to="/about" 
            style={styles.mobileLink} 
            onClick={() => setIsMenuOpen(false)}
          >
            <span style={styles.mobileLinkIcon}>ℹ️</span>
            About
          </Link>
          <Link 
            to="/contact" 
            style={styles.mobileLink} 
            onClick={() => setIsMenuOpen(false)}
          >
            <span style={styles.mobileLinkIcon}>📞</span>
            Contact
          </Link>
          <button 
            style={styles.mobileLoginBtn}
            onClick={() => setIsMenuOpen(false)}
          >
            🔐 Login
          </button>
        </div>
      </div>

      {/* Overlay when menu is open */}
      {isMenuOpen && (
        <div style={styles.overlay} onClick={() => setIsMenuOpen(false)}></div>
      )}
    </>
  );
}

const styles = {
  nav: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "16px 24px",
    background: "#0f766e",
    color: "white",
    position: "sticky",
    top: 0,
    zIndex: 1000,
    boxShadow: "0 2px 10px rgba(0,0,0,0.1)"
  },

  logoContainer: {
    display: "flex",
    alignItems: "center",
    gap: "12px"
  },

  logoIcon: {
    fontSize: "32px",
    background: "rgba(255,255,255,0.1)",
    borderRadius: "10px",
    padding: "8px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center"
  },

  logoTextContainer: {
    display: "flex",
    flexDirection: "column"
  },

  logo: {
    margin: 0,
    fontSize: "20px",
    fontWeight: "bold",
    lineHeight: 1.2
  },

  logoSub: {
    fontSize: "10px",
    opacity: 0.9,
    letterSpacing: "1px"
  },

  links: {
    display: "flex",
    gap: "32px",
    alignItems: "center"
  },

  link: {
    color: "white",
    textDecoration: "none",
    fontSize: "16px",
    fontWeight: "500",
    transition: "all 0.3s ease",
    padding: "8px 12px",
    borderRadius: "8px"
  },

  rightSection: {
    display: "flex",
    alignItems: "center",
    gap: "16px"
  },

  btn: {
    padding: "8px 20px",
    border: "none",
    background: "white",
    color: "#0f766e",
    cursor: "pointer",
    fontWeight: "bold",
    borderRadius: "25px",
    fontSize: "14px",
    transition: "all 0.3s ease"
  },

  hamburger: {
    display: "none",
    flexDirection: "column",
    gap: "5px",
    background: "none",
    border: "none",
    cursor: "pointer",
    padding: "8px"
  },

  hamburgerLine: {
    width: "25px",
    height: "2px",
    background: "white",
    borderRadius: "2px",
    transition: "all 0.3s ease"
  },

  mobileDrawer: {
    position: "fixed",
    top: 0,
    right: 0,
    width: "280px",
    height: "100vh",
    background: "#064e3b",
    zIndex: 1001,
    transition: "transform 0.3s ease-in-out",
    boxShadow: "-2px 0 20px rgba(0,0,0,0.2)",
    overflowY: "auto"
  },

  mobileDrawerContent: {
    padding: "80px 20px 20px",
    display: "flex",
    flexDirection: "column",
    gap: "16px"
  },

  mobileLink: {
    color: "white",
    textDecoration: "none",
    fontSize: "18px",
    fontWeight: "500",
    padding: "12px 16px",
    borderRadius: "10px",
    transition: "all 0.3s ease",
    display: "flex",
    alignItems: "center",
    gap: "12px",
    background: "rgba(255,255,255,0.05)"
  },

  mobileLinkIcon: {
    fontSize: "20px"
  },

  mobileLoginBtn: {
    padding: "12px 20px",
    border: "none",
    background: "white",
    color: "#0f766e",
    cursor: "pointer",
    fontWeight: "bold",
    borderRadius: "25px",
    fontSize: "16px",
    marginTop: "20px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "8px"
  },

  overlay: {
    position: "fixed",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: "rgba(0,0,0,0.5)",
    zIndex: 1000,
    backdropFilter: "blur(4px)"
  }
};

// Media queries for responsive design
const mediaStyles = document.createElement('style');
mediaStyles.textContent = `
  @media (max-width: 768px) {
    .nav-links-desktop {
      display: none !important;
    }
  }
`;

// Only add if not already present
if (!document.querySelector('#navbar-media-styles')) {
  mediaStyles.id = 'navbar-media-styles';
  document.head.appendChild(mediaStyles);
}

export default Navbar;