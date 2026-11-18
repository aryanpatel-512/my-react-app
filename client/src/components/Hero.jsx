// Hero.jsx
import { useState, useEffect } from "react";

const PARTICLES = Array.from({ length: 20 }, (_, i) => ({
  id: i,
  left: `${(i * 37 + 13) % 100}%`,
  animationDelay: `${(i * 0.7) % 10}s`,
  width: `${(i % 6) + 2}px`,
  height: `${(i % 6) + 2}px`,
}));

function Hero() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 0);
    return () => clearTimeout(timer);
  }, []);

  return (
    <section className="hero">
      <div className="hero-overlay"></div>
      <div className="hero-grid-pattern"></div>
      
      <div className="hero-particles">
        {PARTICLES.map((p) => (
          <div 
            key={p.id} 
            className="hero-particle"
            style={{
              left: p.left,
              animationDelay: p.animationDelay,
              width: p.width,
              height: p.height
            }}
          />
        ))}
      </div>

      <div className={`hero-container ${isVisible ? 'visible' : ''}`}>
        <div className="hero-badge">
          <span className="hero-badge-dot"></span>
          <span className="hero-badge-text">Since 2010 — Trusted Healthcare Partner</span>
        </div>

        <h1 className="hero-heading">
          Precision Medical Furniture & 
          <span className="hero-heading-highlight"> Clean Room Solutions</span>
        </h1>

        <p className="hero-text">
          We manufacture hospital beds, trolleys, lockers, ICU furniture,
          modular clean rooms and healthcare infrastructure with ISO-certified quality.
        </p>

        <div className="hero-button-group">
          <button className="hero-btn-primary">
            View Products
            <span className="hero-btn-arrow">→</span>
          </button>
          <button className="hero-btn-secondary">
            Contact Sales
          </button>
        </div>

        <div className="hero-stats">
          <div className="hero-stat">
            <div className="hero-stat-number">500+</div>
            <div className="hero-stat-label">Projects Completed</div>
          </div>
          <div className="hero-stat-divider"></div>
          <div className="hero-stat">
            <div className="hero-stat-number">50+</div>
            <div className="hero-stat-label">Partner Hospitals</div>
          </div>
          <div className="hero-stat-divider"></div>
          <div className="hero-stat">
            <div className="hero-stat-number">24/7</div>
            <div className="hero-stat-label">Customer Support</div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Hero;