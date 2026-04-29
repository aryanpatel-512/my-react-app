import { useMemo, useState, useEffect, useRef } from "react";
import "./Products.css";
import { useNavigate, Link } from "react-router-dom";
import logo from "../assets/logo.png";

export default function Products() {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [sort, setSort] = useState("default");
  const [page, setPage] = useState(1);
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [visibleSections, setVisibleSections] = useState(new Set());
  const sectionRefs = useRef({});

  const perPage = 12;

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await fetch("https://my-react-backend-im39.onrender.com/api/products");
      const data = await response.json();
      console.log("Products loaded:", data);
      console.log("First product ID:", data[0]?._id);
      setProducts(data);
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  };

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setVisibleSections((prev) => new Set([...prev, entry.target.dataset.section]));
          }
        });
      },
      { threshold: 0.1 }
    );
    Object.values(sectionRefs.current).forEach((el) => el && observer.observe(el));
    return () => observer.disconnect();
  }, []);

  const registerSection = (key) => (el) => {
    if (el) {
      el.dataset.section = key;
      sectionRefs.current[key] = el;
    }
  };

  const isVisible = (key) => visibleSections.has(key);

  // Get unique categories
  const categories = useMemo(() => {
    return ["All", ...new Set(products.map((item) => item.category))];
  }, [products]);

  // Filter and Sort Products
  const filteredProducts = useMemo(() => {
    let data = [...products];

    // Search filter
    if (search.trim()) {
      data = data.filter(
        (item) =>
          item.title?.toLowerCase().includes(search.toLowerCase()) ||
          item.desc?.toLowerCase().includes(search.toLowerCase()) ||
          item.category?.toLowerCase().includes(search.toLowerCase())
      );
    }

    // Category filter
    if (category !== "All") {
      data = data.filter((item) => item.category === category);
    }

    // Sort options
    if (sort === "low") {
      data.sort(
        (a, b) =>
          Number(a.price?.replace(/[₹,]/g, "")) -
          Number(b.price?.replace(/[₹,]/g, ""))
      );
    }

    if (sort === "high") {
      data.sort(
        (a, b) =>
          Number(b.price?.replace(/[₹,]/g, "")) -
          Number(a.price?.replace(/[₹,]/g, ""))
      );
    }

    if (sort === "az") {
      data.sort((a, b) => a.title?.localeCompare(b.title));
    }

    return data;
  }, [products, search, category, sort]);

  // Calculate total pages
  const totalPages = Math.ceil(filteredProducts.length / perPage);

  // Reset page if out of range
  useEffect(() => {
    if (page > totalPages && totalPages > 0) {
      setPage(1);
    }
  }, [totalPages, page]);

  // Get current page products
  const currentProducts = filteredProducts.slice(
    (page - 1) * perPage,
    page * perPage
  );

  // Handle page change
  const changePage = (num) => {
    setPage(num);
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  // Handle product click navigation
  const handleProductClick = (product) => {
    const productId = product._id || product.id;
    console.log("Product clicked:", product.title);
    console.log("Product ID:", productId);
    console.log("Navigating to:", `/product/${productId}`);
    
    if (productId) {
      navigate(`/product/${productId}`);
    } else {
      console.error("No product ID found for:", product);
      alert("Product ID not found. Please check the console.");
    }
  };

  const NAV_LINKS = ["Home", "Products", "About", "Why Us", "Contact"];

  return (
    <div className="products-page">
      {/* ── NAVBAR ── */}
      <header className={`header ${scrolled ? "header--scrolled" : ""}`}>
        <div className="header__inner wrap">
          <Link className="brand" to="/">
            <div className="brand__logo-wrap">
              <img src={logo} alt="Sri Srinivasa Clean Rooms" className="brand__logo" />
            </div>
            <div className="brand__text-wrap">
              <span className="brand__name">Sri Srinivasa</span>
              <span className="brand__sub">Clean Rooms</span>
            </div>
          </Link>

          <nav className="nav__links" aria-label="Main navigation">
            {NAV_LINKS.map((l) =>
              l === "Products" ? (
                <Link key={l} to="/products" className="nav__link nav__link--active">
                  {l}
                  <span className="nav__link-line" />
                </Link>
              ) : (
                <Link
                  key={l}
                  to={`/#${l.toLowerCase().replace(" ", "-")}`}
                  className="nav__link"
                >
                  {l}
                  <span className="nav__link-line" />
                </Link>
              )
            )}
          </nav>

          <div className="nav__right">
            <a href="tel:+919440643193" className="nav__phone">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 10.8a19.79 19.79 0 01-3.07-8.68A2 2 0 012 0h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L6.09 7.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 14.92v2z"/>
              </svg>
              +91 94406 43193
            </a>
            <Link to="/#contact" className="btn btn--gold">Get Quote</Link>
            <button
              className={`hamburger ${menuOpen ? "hamburger--open" : ""}`}
              onClick={() => setMenuOpen(!menuOpen)}
              aria-label="Toggle menu"
            >
              <span /><span /><span />
            </button>
          </div>
        </div>

        <div className={`mobile-drawer ${menuOpen ? "mobile-drawer--open" : ""}`}>
          <div className="mobile-drawer__inner">
            {NAV_LINKS.map((l, idx) => (
              <Link
                key={l} 
                to={l === "Products" ? "/products" : `/#${l.toLowerCase().replace(" ", "-")}`} 
                className="mobile-drawer__link" 
                onClick={() => setMenuOpen(false)}
              >
                <span className="mobile-drawer__num">0{idx + 1}</span>
                {l}
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M5 12h14M12 5l7 7-7 7"/>
                </svg>
              </Link>
            ))}
            <Link to="/#contact" className="btn btn--gold mobile-drawer__cta" onClick={() => setMenuOpen(false)}>
              Get a Quote
            </Link>
          </div>
        </div>
      </header>

      {/* ── HERO SECTION ── */}
      <section className="products-hero">
        <div className="hero__noise" aria-hidden="true" />
        <div className="hero__grid-lines" aria-hidden="true">
          {[...Array(8)].map((_, i) => <span key={i} className="hero__grid-v" style={{ left: `${i * 14.28}%` }} />)}
        </div>
        <div className="hero__orb hero__orb--1" aria-hidden="true" />
        <div className="hero__orb hero__orb--2" aria-hidden="true" />
        
        <div className="wrap">
          <div className="products-hero__inner">
            <div className="products-hero__content">
              <div className="hero__eyebrow">
                <span className="hero__eyebrow-dot" />
                <span>Premium</span>
                <span className="hero__eyebrow-sep">·</span>
                <span>Medical</span>
                <span className="hero__eyebrow-sep">·</span>
                <span>Furniture</span>
              </div>
              <h1 className="products-hero__title">
                <span className="products-hero__title-line">Our Complete</span>
                <span className="products-hero__title-line">
                  <em>Product Catalog</em>
                </span>
              </h1>
              <p className="products-hero__desc">
                Discover {products.length}+ hospital-grade products engineered with precision, 
                hygiene standards, and durability for India's most demanding healthcare environments.
              </p>
              <div className="products-hero__stats">
                <div className="products-hero__stat">
                  <strong>{products.length}+</strong>
                  <span>Products</span>
                </div>
                <div className="products-hero__stat">
                  <strong>{categories.length - 1}</strong>
                  <span>Categories</span>
                </div>
                <div className="products-hero__stat">
                  <strong>ISO</strong>
                  <span>Certified</span>
                </div>
              </div>
            </div>
            <div className="products-hero__visual">
              <div className="products-hero__img-main">
                <img 
                  src="https://images.unsplash.com/photo-1631217868264-e5b90bb7e133?w=1200&q=90" 
                  alt="Medical Furniture Collection"
                />
                <div className="products-hero__img-overlay" />
                <div className="products-hero__badge">
                  <span>✦</span>
                  <div>
                    <strong>{products.length}+ Products</strong>
                    <span>Premium Quality</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── FILTERS SECTION ── */}
      <section className="filters-section">
        <div className="wrap">
          <div className="filters-grid">
            {/* Search Filter */}
            <div className="filter-group">
              <input
                type="text"
                placeholder="Search products..."
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setPage(1);
                }}
                className="filter-search"
              />
            </div>

            {/* Category Filter */}
            <div className="filter-group">
              <select
                value={category}
                onChange={(e) => {
                  setCategory(e.target.value);
                  setPage(1);
                }}
                className="filter-select"
              >
                {categories.map((cat, i) => (
                  <option key={i} value={cat}>{cat}</option>
                ))}
              </select>
            </div>

            {/* Sort Filter */}
            <div className="filter-group">
              <select
                value={sort}
                onChange={(e) => {
                  setSort(e.target.value);
                  setPage(1);
                }}
                className="filter-select"
              >
                <option value="default">Sort By: Default</option>
                <option value="low">Price: Low to High</option>
                <option value="high">Price: High to Low</option>
                <option value="az">Name: A to Z</option>
              </select>
            </div>
          </div>
        </div>
      </section>

      {/* ── PRODUCTS GRID ── */}
      <section className="products-grid-section" ref={registerSection("products")}>
        <div className="wrap">
          <div className="products-header">
            <div className="products-header__left">
              <p className="eyebrow-label">
                <span className="eyebrow-label__line" />
                Our Collection
              </p>
              <h2 className="products-header__title">
                Premium <em>Medical Furniture</em>
              </h2>
            </div>

            <div className="products-header__right">
              <p>
                Showing <strong>{currentProducts.length}</strong> of{" "}
                <strong>{filteredProducts.length}</strong> products
              </p>
            </div>
          </div>

          {currentProducts.length > 0 ? (
            <div className={`products-grid ${isVisible("products") ? "anim-in" : ""}`}>
              {currentProducts.map((item, idx) => (
                <article
                  key={item._id || item.id || idx}
                  className="product-card"
                  style={{
                    animationDelay: `${(idx % perPage) * 0.05}s`,
                    cursor: "pointer"
                  }}
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    handleProductClick(item);
                  }}
                >
                  <div className="product-card__img-wrap">
                    <img
                      src={item.image}
                      alt={item.title}
                      loading="lazy"
                      onError={(e) => {
                        e.target.src = "https://placehold.co/400x300/e6faf7/0f766e?text=No+Image";
                      }}
                    />
                    <div className="product-card__img-overlay" />
                    <div className="product-card__category">
                      {item.category}
                    </div>
                  </div>

                  <div className="product-card__body">
                    <h3 className="product-card__title">
                      {item.title}
                    </h3>

                    <p className="product-card__desc">
                      {item.desc?.substring(0, 80) || "No description"}...
                    </p>

                    <div className="product-card__footer">
                      <span className="product-card__price">
                        {item.price}
                      </span>

                      <span className="product-card__cta">
                        View Details
                        <svg
                          width="16"
                          height="16"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                        >
                          <path d="M5 12h14M12 5l7 7-7 7" />
                        </svg>
                      </span>
                    </div>
                  </div>

                  <div className="product-card__accent" />
                </article>
              ))}
            </div>
          ) : (
            <div className="no-products">
              <svg
                className="no-products__icon"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
              >
                <circle cx="11" cy="11" r="8" />
                <path d="M21 21l-4.35-4.35" />
                <path d="M8 11h6" />
              </svg>
              <h3>No products found</h3>
              <p>Try adjusting your search or filter criteria</p>
              <button
                className="btn btn--gold"
                onClick={() => {
                  setSearch("");
                  setCategory("All");
                  setSort("default");
                }}
              >
                Reset Filters
              </button>
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="pagination">
              <button
                onClick={() => changePage(page - 1)}
                disabled={page === 1}
                className="pagination__prev"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M15 18l-6-6 6-6"/>
                </svg>
                Previous
              </button>

              <div className="pagination__numbers">
                {[...Array(totalPages)].map((_, i) => (
                  <button
                    key={i}
                    onClick={() => changePage(i + 1)}
                    className={`pagination__num ${page === i + 1 ? "active" : ""}`}
                  >
                    {i + 1}
                  </button>
                ))}
              </div>

              <button
                onClick={() => changePage(page + 1)}
                disabled={page === totalPages}
                className="pagination__next"
              >
                Next
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M9 18l6-6-6-6"/>
                </svg>
              </button>
            </div>
          )}
        </div>
      </section>

      {/* ── CTA BANNER ── */}
      <section className="cta-banner">
        <div className="cta-banner__bg" aria-hidden="true" />
        <div className="cta-banner__particles" aria-hidden="true">
          {[...Array(12)].map((_, i) => <span key={i} className="cta-banner__particle" />)}
        </div>
        <div className="wrap cta-banner__inner">
          <div className="cta-banner__text">
            <p className="cta-banner__eyebrow">Need a Custom Solution?</p>
            <h2>Bulk Orders &<br />Custom Manufacturing</h2>
            <p className="cta-banner__sub">Get a tailored quote for your hospital, clinic, or healthcare facility.</p>
          </div>
          <div className="cta-banner__actions">
            <Link to="/#contact" className="btn btn--white btn--lg">
              Request a Quote
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M5 12h14M12 5l7 7-7 7"/>
              </svg>
            </Link>
            <a href="tel:+919440643193" className="btn btn--ghost-white btn--lg">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 10.8a19.79 19.79 0 01-3.07-8.68A2 2 0 012 0h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L6.09 7.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 14.92v2z"/>
              </svg>
              Call Now
            </a>
          </div>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer className="footer">
        <div className="footer__glow" aria-hidden="true" />
        <div className="footer__top wrap">
          <div className="footer__brand-col">
            <div className="footer__logo-wrap">
              <img src={logo} alt="Sri Srinivasa Clean Rooms" className="footer__logo" />
            </div>
            <p className="footer__brand-name">Sri Srinivasa<br />Clean Rooms</p>
            <p className="footer__brand-desc">
              Premium medical furniture and clean room infrastructure manufacturer
              trusted by 50+ hospitals across India.
            </p>
            <div className="footer__socials">
              <a href="#" aria-label="LinkedIn" className="footer__social">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M16 8a6 6 0 016 6v7h-4v-7a2 2 0 00-2-2 2 2 0 00-2 2v7h-4v-7a6 6 0 016-6zM2 9h4v12H2z"/>
                  <circle cx="4" cy="4" r="2"/>
                </svg>
              </a>
              <a href="https://wa.me/919440643193" aria-label="WhatsApp" className="footer__social">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/>
                  <path d="M12 0C5.373 0 0 5.373 0 12c0 2.126.556 4.122 1.527 5.854L.057 24l6.304-1.651A11.933 11.933 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0z"/>
                </svg>
              </a>
              <a href="mailto:chakri.9441@gmail.com" aria-label="Email" className="footer__social">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
                  <polyline points="22,6 12,13 2,6"/>
                </svg>
              </a>
            </div>
          </div>

          <div className="footer__col">
            <h4>Products</h4>
            {["ICU Beds", "Hospital Trolleys", "Medical Lockers", "Clean Room Systems", "Procedure Tables", "Nurse Stations"].map((p) => (
              <Link key={p} to="/#products">{p}</Link>
            ))}
          </div>

          <div className="footer__col">
            <h4>Company</h4>
            {["About Us", "Why Choose Us", "Quality Standards", "Bulk Orders"].map((c) => (
              <Link key={c} to="/#about">{c}</Link>
            ))}
          </div>

          <div className="footer__col">
            <h4>Contact</h4>
            <div className="footer__contact-block">
              <strong>Chakradhar Chepuri</strong>
              <a href="tel:+919440643193">+91 94406 43193</a>
              <a href="mailto:chakri.9441@gmail.com">chakri.9441@gmail.com</a>
              <span>Subhash Nagar, Malkajgiri,<br />Telangana – 500055</span>
            </div>
          </div>
        </div>

        <div className="footer__bottom wrap">
          <p>© 2026 Sri Srinivasa Clean Rooms. All rights reserved.</p>
          <p>Crafted with ◆ in Hyderabad, India</p>
        </div>
      </footer>
    </div>
  );
}
