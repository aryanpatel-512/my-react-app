import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect, useCallback } from "react";
import logo from "../assets/logo.png";
import useDocumentSEO from "../utils/useDocumentSEO";
import "./ProductDetail.css";

export default function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [product, setProduct] = useState(null);
  const [selectedImage, setSelectedImage] = useState("");
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  const [sending, setSending] = useState(false);
  const [quoteForm, setQuoteForm] = useState({
    name: "",
    phone: "",
    email: "",
    message: "",
  });
  const [errors, setErrors] = useState({});
  const [inquirySent, setInquirySent] = useState(false);
  const [submitError, setSubmitError] = useState("");

  // Dynamic Technical SEO for single product
  useDocumentSEO({
    title: product ? `${product.title} | Sri Srinivasa Clean Rooms` : "Product Details | Sri Srinivasa Clean Rooms",
    description: product?.desc ? product.desc.substring(0, 160) : "High quality hospital furniture and cleanroom equipment.",
    canonicalUrl: product ? `https://sri-srinivasa-clean-room.onrender.com/product/${product._id}` : undefined,
  });

  const fetchRelated = useCallback(async (categoryName, currentId) => {
    try {
      const res = await fetch(`${window.location.origin}/api/v1/products?category=${encodeURIComponent(categoryName)}&limit=5`);
      const json = await res.json();
      if (json.success && json.data) {
        setRelatedProducts(json.data.filter((item) => item._id !== currentId).slice(0, 4));
      }
    } catch {
      // non-blocking
    }
  }, []);

  useEffect(() => {
    let ignore = false;
    async function startFetching() {
      try {
        const res = await fetch(`${window.location.origin}/api/v1/products/${id}`);
        const json = await res.json();

        if (!ignore) {
          if (res.ok && json.success && json.data) {
            const prodData = json.data;
            setProduct(prodData);
            setSelectedImage(prodData.image || "");

            // Fetch related products in same category
            if (prodData.category) {
              fetchRelated(prodData.category, prodData._id);
            }
          } else {
            setNotFound(true);
          }
        }
      } catch (error) {
        if (!ignore) {
          console.error("Error fetching product:", error);
          setNotFound(true);
        }
      } finally {
        if (!ignore) {
          setLoading(false);
        }
      }
    }

    startFetching();
    return () => {
      ignore = true;
    };
  }, [id, fetchRelated]);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const navigateWithScroll = (path) => {
    scrollToTop();
    navigate(path);
  };

  const validateForm = () => {
    const newErrors = {};
    if (!quoteForm.name || !quoteForm.name.trim()) newErrors.name = "Name is required";
    else if (!/^[a-zA-Z\s.'-]+$/.test(quoteForm.name.trim())) newErrors.name = "Only letters, spaces, dots or hyphens allowed";

    if (!quoteForm.phone || !quoteForm.phone.trim()) newErrors.phone = "Phone is required";
    else if (!/^[0-9]{10}$/.test(quoteForm.phone)) newErrors.phone = "Phone must be exactly 10 digits";

    if (!quoteForm.email || !quoteForm.email.trim()) newErrors.email = "Email is required";
    else if (!/^\S+@\S+\.\S+$/.test(quoteForm.email)) newErrors.email = "Invalid email format";

    if (!quoteForm.message || !quoteForm.message.trim()) newErrors.message = "Message is required";
    else if (quoteForm.message.trim().length < 5) newErrors.message = "Message must be at least 5 characters";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const sendInquiry = async () => {
    if (!validateForm()) {
      return;
    }

    try {
      setSending(true);

      const res = await fetch(`${window.location.origin}/api/v1/inquiries`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: quoteForm.name,
          phone: quoteForm.phone,
          email: quoteForm.email,
          message: quoteForm.message,
          productId: product?._id,
          productName: product?.title,
          type: "product",
        }),
      });

      const data = await res.json();

      if (data.success) {
        setInquirySent(true);
        setSubmitError("");
        setQuoteForm({
          name: "",
          phone: "",
          email: "",
          message: "",
        });
        setErrors({});
      } else {
        setSubmitError(data.error?.message || data.message || "Failed to send inquiry. Please try again.");
      }
    } catch (error) {
      console.log(error);
      setSubmitError("Server error. Please try again later.");
    } finally {
      setSending(false);
    }
  };

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  if (loading) {
    return (
      <div className="pd-notfound">
        <div className="pd-notfound-content">
          <div className="loading-spinner"></div>
          <h1>Loading Product...</h1>
          <p>Please wait while we fetch product details</p>
        </div>
      </div>
    );
  }

  if (notFound || !product) {
    return (
      <div className="pd-notfound">
        <div className="pd-notfound-content">
          <h1>Product Not Found</h1>
          <p>The product you are looking for does not exist or is currently unavailable.</p>
          <button className="pd-back" style={{ marginTop: "20px" }} onClick={() => navigateWithScroll("/products")}>
            ← Back to Products Catalog
          </button>
        </div>
      </div>
    );
  }

  // Helper to format image path
  const formatImageUrl = (img) => {
    if (!img) return "https://placehold.co/600x450/e6faf7/0f766e?text=Medical+Equipment";
    if (img.startsWith("http://localhost:10000")) {
      return img.replace("http://localhost:10000", window.location.origin);
    }
    return img;
  };

  // Image list for gallery
  const allImages = [
    product.image,
    ...(Array.isArray(product.images) ? product.images : []),
  ].filter(Boolean);

  const displayImage = selectedImage || product.image;

  const NAV_LINKS = ["Home", "Products", "About", "Why Us", "Contact"];

  const handleNavClick = (e, l) => {
    e.preventDefault();
    if (l === "Products") {
      scrollToTop();
      navigate("/products");
    } else if (l === "Home") {
      scrollToTop();
      navigate("/");
    } else {
      navigate(`/#${l.toLowerCase().replace(" ", "-")}`);
    }
  };

  return (
    <div className="product-detail-page">
      {/* Navbar */}
      <header className={`navbar ${scrolled ? "navbar-scrolled" : ""}`}>
        <div className="container">
          <div className="navbar-inner">
            <a
              href="/"
              className="logo"
              onClick={(e) => {
                e.preventDefault();
                scrollToTop();
                navigate("/");
              }}
            >
              <img src={logo} alt="Sri Srinivasa Clean Rooms Logo" className="logo-img" />
              <div>
                <div className="logo-text">Sri Srinivasa</div>
                <div className="logo-sub">Clean Rooms</div>
              </div>
            </a>

            <div className="nav-links">
              {NAV_LINKS.map((l) => (
                <a
                  key={l}
                  href={l === "Products" ? "/products" : `/#${l.toLowerCase().replace(" ", "-")}`}
                  className="nav-link"
                  onClick={(e) => handleNavClick(e, l)}
                >
                  {l}
                </a>
              ))}
            </div>

            <div className="nav-right">
              <a href="tel:+919440643193" className="phone-btn">
                📞 +91 94406 43193
              </a>
              <a
                href="/#contact"
                className="btn-gold"
                onClick={(e) => {
                  e.preventDefault();
                  navigate("/#contact");
                }}
              >
                Get Quote
              </a>
              <button className="mobile-menu-btn" onClick={() => setMenuOpen(!menuOpen)}>
                ☰
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="mobile-menu">
          {NAV_LINKS.map((l) => (
            <a
              key={l}
              href={l === "Products" ? "/products" : `/#${l.toLowerCase().replace(" ", "-")}`}
              className="mobile-link"
              onClick={(e) => {
                e.preventDefault();
                setMenuOpen(false);
                if (l === "Products") {
                  scrollToTop();
                  navigate("/products");
                } else if (l === "Home") {
                  scrollToTop();
                  navigate("/");
                } else {
                  navigate(`/#${l.toLowerCase().replace(" ", "-")}`);
                }
              }}
            >
              {l}
            </a>
          ))}
        </div>
      )}

      {/* Product Main Section */}
      <section className="pd-hero">
        <div className="container">
          <button className="pd-back" onClick={() => navigateWithScroll("/products")}>
            ← Back to Products
          </button>

          <div className="pd-main-layout">
            {/* Left Column - Product Image & Gallery */}
            <div className="pd-left-col">
              <div className="pd-main-image">
                <img
                  src={formatImageUrl(displayImage)}
                  alt={product.title}
                  onError={(e) => {
                    e.target.src = "https://placehold.co/600x450/e6faf7/0f766e?text=Medical+Equipment";
                  }}
                />
                <div className="pd-image-badge">
                  <span>✦</span>
                  <div>
                    <strong>Premium Quality</strong>
                    <span>Hospital Grade</span>
                  </div>
                </div>
              </div>

              {/* Multi-image Thumbnail Gallery */}
              {allImages.length > 1 && (
                <div className="pd-thumbnails">
                  {allImages.map((img, idx) => (
                    <div
                      key={idx}
                      className={`pd-thumb ${(selectedImage === img || (!selectedImage && idx === 0)) ? "active" : ""}`}
                      onClick={() => setSelectedImage(img)}
                    >
                      <img
                        src={formatImageUrl(img)}
                        alt={`${product.title} view ${idx + 1}`}
                      />
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Middle Column - Product Details */}
            <div className="pd-middle-col">
              <div className="pd-breadcrumb">
                <span onClick={() => navigateWithScroll("/products")}>Products</span>
                <span>/</span>
                <span className="active">{product.category}</span>
              </div>

              <h1 className="pd-title">{product.title}</h1>

              <div className="pd-price-box">
                <div className="pd-current-price">{product.price}</div>
                <div className="pd-price-info">GST &amp; Technical Consultation Included</div>
              </div>

              <div className="pd-description-box">
                <h3>Product Description</h3>
                <p>{product.desc}</p>
              </div>

              <div className="pd-features-box">
                <h3>Key Features</h3>
                <div className="pd-features-grid-2col">
                  <div className="pd-feature-item">✓ Premium Build Quality</div>
                  <div className="pd-feature-item">✓ Hospital Grade Finish</div>
                  <div className="pd-feature-item">✓ Durable Steel Body</div>
                  <div className="pd-feature-item">✓ Pan-India Delivery</div>
                  <div className="pd-feature-item">✓ 1 Year Warranty</div>
                  <div className="pd-feature-item">✓ Free Installation Support</div>
                </div>
              </div>

              <div className="pd-actions-box">
                <a
                  href={`https://wa.me/919440643193?text=Hello, I need a quote for ${encodeURIComponent(product.title)}`}
                  target="_blank"
                  rel="noreferrer"
                  className="pd-btn-wa"
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/>
                    <path d="M12 0C5.373 0 0 5.373 0 12c0 2.126.556 4.122 1.527 5.854L.057 24l6.304-1.651A11.933 11.933 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0z"/>
                  </svg>
                  WhatsApp
                </a>
                <a href="tel:+919440643193" className="pd-btn-call">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 10.8a19.79 19.79 0 01-3.07-8.68A2 2 0 012 0h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L6.09 7.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 14.92v2z"/>
                  </svg>
                  Call Now
                </a>
              </div>

              <div className="pd-share-box">
                <span>Share this product:</span>
                <div className="pd-share-icons">
                  <a href="#" onClick={(e) => { e.preventDefault(); window.open(`https://www.facebook.com/sharer/sharer.php?u=${window.location.href}`); }}>📘</a>
                  <a href="#" onClick={(e) => { e.preventDefault(); window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(product.title)}&url=${window.location.href}`); }}>🐦</a>
                  <a href="#" onClick={(e) => { e.preventDefault(); window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${window.location.href}`); }}>💼</a>
                </div>
              </div>
            </div>

            {/* Right Column - Quote Form */}
            <div className="pd-right-col">
              <div className="pd-quote-card">
                {inquirySent ? (
                  <div className="pd-quote-success">
                    <div className="pd-quote-success-circle">
                      <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="#14b8a6" strokeWidth="2.5">
                        <polyline points="20 6 9 17 4 12" />
                      </svg>
                    </div>
                    <h3>Inquiry Received!</h3>
                    <p>
                      Thank you for your inquiry.<br />
                      Our technical team will contact you shortly regarding this product.
                    </p>
                    <button className="pd-quote-reset-btn" onClick={() => { setInquirySent(false); setSubmitError(""); }}>
                      Send Another Inquiry
                    </button>
                  </div>
                ) : (
                  <>
                    <h3>📋 Request Instant Quote</h3>
                    <div className="pd-quote-price">
                      <span className="quote-price">{product.price}</span>
                      <span className="quote-tax">Direct Manufacturer Pricing</span>
                    </div>

                    {submitError && <div className="pd-quote-error">✕ {submitError}</div>}

                    <div className="pd-quote-form">
                      <div className="input-group">
                        <input
                          type="text"
                          placeholder="Full Name *"
                          value={quoteForm.name}
                          className={errors.name ? "error-input" : ""}
                          onChange={(e) => {
                            setQuoteForm({ ...quoteForm, name: e.target.value });
                            if (submitError) setSubmitError("");
                          }}
                        />
                        {errors.name && <span className="error-text" style={{ color: "red", fontSize: "0.85rem", marginTop: "-10px", display: "block", marginBottom: "10px" }}>{errors.name}</span>}
                      </div>

                      <div className="input-group">
                        <input
                          type="tel"
                          placeholder="Phone Number *"
                          value={quoteForm.phone}
                          className={errors.phone ? "error-input" : ""}
                          onChange={(e) => {
                            setQuoteForm({ ...quoteForm, phone: e.target.value });
                            if (submitError) setSubmitError("");
                          }}
                        />
                        {errors.phone && <span className="error-text" style={{ color: "red", fontSize: "0.85rem", marginTop: "-10px", display: "block", marginBottom: "10px" }}>{errors.phone}</span>}
                      </div>

                      <div className="input-group">
                        <input
                          type="email"
                          placeholder="Email Address *"
                          value={quoteForm.email}
                          className={errors.email ? "error-input" : ""}
                          onChange={(e) => {
                            setQuoteForm({ ...quoteForm, email: e.target.value });
                            if (submitError) setSubmitError("");
                          }}
                        />
                        {errors.email && <span className="error-text" style={{ color: "red", fontSize: "0.85rem", marginTop: "-10px", display: "block", marginBottom: "10px" }}>{errors.email}</span>}
                      </div>

                      <div className="input-group">
                        <textarea
                          rows="3"
                          placeholder="Your requirements or message... *"
                          value={quoteForm.message}
                          className={errors.message ? "error-input" : ""}
                          onChange={(e) => {
                            setQuoteForm({ ...quoteForm, message: e.target.value });
                            if (submitError) setSubmitError("");
                          }}
                        />
                        {errors.message && <span className="error-text" style={{ color: "red", fontSize: "0.85rem", marginTop: "-10px", display: "block", marginBottom: "10px" }}>{errors.message}</span>}
                      </div>

                      <button className="quote-submit-btn" onClick={sendInquiry} disabled={sending}>
                        {sending ? "Sending..." : "Get Best Quote →"}
                      </button>
                    </div>
                    <div className="pd-quote-features">
                      <div className="quote-feature">✓ Direct Manufacturer</div>
                      <div className="quote-feature">✓ Hospital Grade</div>
                      <div className="quote-feature">✓ Bulk Pricing</div>
                      <div className="quote-feature">✓ PAN India Supply</div>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Specifications Section */}
      <section className="pd-section">
        <div className="container">
          <div className="pd-section-header">
            <p className="eyebrow">Technical Details</p>
            <h2>Product <span className="highlight">Specifications</span></h2>
          </div>

          <div className="pd-specs-grid">
            <div className="pd-spec-card"><span className="spec-icon">📏</span><strong>Product Name</strong><p>{product.title}</p></div>
            <div className="pd-spec-card"><span className="spec-icon">📂</span><strong>Category</strong><p>{product.category}</p></div>
            <div className="pd-spec-card"><span className="spec-icon">💰</span><strong>Price</strong><p>{product.price}</p></div>

            {/* Dynamic Custom Specifications if provided by Admin */}
            {product.specifications && product.specifications.length > 0 ? (
              product.specifications.map((spec, i) => (
                <div key={i} className="pd-spec-card">
                  <span className="spec-icon">🔩</span>
                  <strong>{spec.key}</strong>
                  <p>{spec.value}</p>
                </div>
              ))
            ) : (
              <>
                <div className="pd-spec-card"><span className="spec-icon">🔩</span><strong>Standard Material</strong><p>Mild Steel / High-Grade Stainless Steel</p></div>
                <div className="pd-spec-card"><span className="spec-icon">🎨</span><strong>Finish</strong><p>Antimicrobial Powder Coated / SS Finish</p></div>
                <div className="pd-spec-card"><span className="spec-icon">🏥</span><strong>Application</strong><p>Hospitals, ICUs, OT Suites &amp; Cleanrooms</p></div>
              </>
            )}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="pd-section light">
        <div className="container">
          <div className="pd-section-header">
            <p className="eyebrow">Why Choose This</p>
            <h2>Key <span className="highlight">Benefits</span></h2>
          </div>
          <div className="pd-benefits-grid">
            <div className="pd-benefit-card"><div className="benefit-icon">🏗️</div><h4>Heavy Duty Frame</h4><p>Engineered with robust steel construction for maximum durability.</p></div>
            <div className="pd-benefit-card"><div className="benefit-icon">🛡️</div><h4>Corrosion Resistant</h4><p>Special coating prevents rust and ensures long-lasting performance.</p></div>
            <div className="pd-benefit-card"><div className="benefit-icon">🔄</div><h4>Smooth Mobility</h4><p>Premium castor wheels with locking mechanism for easy movement.</p></div>
            <div className="pd-benefit-card"><div className="benefit-icon">🧼</div><h4>Easy to Clean</h4><p>Hygienic surface design meets hospital sanitation standards.</p></div>
            <div className="pd-benefit-card"><div className="benefit-icon">⚡</div><h4>Quick Assembly</h4><p>Easy-to-follow instructions for fast and hassle-free setup.</p></div>
            <div className="pd-benefit-card"><div className="benefit-icon">📦</div><h4>Warranty Support</h4><p>Comprehensive warranty coverage with dedicated service team.</p></div>
          </div>
        </div>
      </section>

      {/* Related Products */}
      {relatedProducts.length > 0 && (
        <section className="pd-section light">
          <div className="container">
            <div className="pd-section-header">
              <p className="eyebrow">You May Also Like</p>
              <h2>Related <span className="highlight">Products</span></h2>
            </div>
            <div className="pd-related-grid">
              {relatedProducts.map((item) => (
                <div
                  key={item._id}
                  className="pd-related-card"
                  onClick={() => {
                    scrollToTop();
                    navigate(`/product/${item._id}`);
                  }}
                >
                  <div className="related-image">
                    <img
                      src={formatImageUrl(item.image)}
                      alt={item.title}
                      loading="lazy"
                      onError={(e) => {
                        e.target.src = "https://placehold.co/400x300/e6faf7/0f766e?text=No+Image";
                      }}
                    />
                    <span className="related-category">{item.category}</span>
                  </div>
                  <div className="related-info">
                    <h4>{item.title.length > 35 ? item.title.substring(0, 35) + "..." : item.title}</h4>
                    <p>{item.price}</p>
                    <span className="related-view">View Details →</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* CTA Banner */}
      <section className="pd-cta-banner">
        <div className="container">
          <div className="pd-cta-content">
            <div className="pd-cta-text">
              <p className="pd-cta-eyebrow">Need Bulk Order?</p>
              <h2>Custom Manufacturing Available</h2>
              <p>Get special pricing for bulk orders and customized hospital requirements.</p>
            </div>
            <div className="pd-cta-buttons">
              <a
                href="/#contact"
                className="btn-white"
                onClick={(e) => {
                  e.preventDefault();
                  navigate("/#contact");
                }}
              >
                Contact Sales Team →
              </a>
              <a href="tel:+919440643193" className="btn-outline-white">
                📞 Call Now
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer">
        <div className="container">
          <div className="footer-grid">
            <div>
              <div className="footer-logo">
                <img src={logo} alt="Sri Srinivasa Clean Rooms Logo" className="footer-logo-img" />
                <h3>Sri Srinivasa Clean Rooms</h3>
              </div>
              <p>Premium medical furniture manufacturer trusted by 50+ hospitals across India.</p>
              <div className="social-links">
                <a href="https://wa.me/919440643193">WhatsApp</a>
                <a href="mailto:chakri.9441@gmail.com">Email</a>
              </div>
            </div>
            <div>
              <h4>Products</h4>
              <a href="/products" onClick={(e) => { e.preventDefault(); scrollToTop(); navigate("/products"); }}>ICU Beds</a>
              <a href="/products" onClick={(e) => { e.preventDefault(); scrollToTop(); navigate("/products"); }}>Hospital Trolleys</a>
              <a href="/products" onClick={(e) => { e.preventDefault(); scrollToTop(); navigate("/products"); }}>Medical Lockers</a>
              <a href="/products" onClick={(e) => { e.preventDefault(); scrollToTop(); navigate("/products"); }}>Clean Room Systems</a>
            </div>
            <div>
              <h4>Company</h4>
              <a href="/#about" onClick={(e) => { e.preventDefault(); navigate("/#about"); }}>About Us</a>
              <a href="/#why-us" onClick={(e) => { e.preventDefault(); navigate("/#why-us"); }}>Why Choose Us</a>
              <a href="/#contact" onClick={(e) => { e.preventDefault(); navigate("/#contact"); }}>Contact</a>
            </div>
            <div>
              <h4>Contact</h4>
              <a href="tel:+919440643193">+91 94406 43193</a>
              <a href="mailto:chakri.9441@gmail.com">chakri.9441@gmail.com</a>
              <span>Subhash Nagar, Malkajgiri, Telangana – 500055</span>
            </div>
          </div>
          <div className="footer-bottom">
            <p>© 2026 Sri Srinivasa Clean Rooms. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
