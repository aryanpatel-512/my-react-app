import { useState, useEffect } from "react";
import "./Home.css";
import { Link, useNavigate } from "react-router-dom";
import logo from "../assets/logo.png";
import { CLEANROOM_SOLUTIONS, OT_SOLUTIONS } from "../data/solutionsData";
import useDocumentSEO from "../utils/useDocumentSEO";

const NAV_LINKS = ["Home", "Products", "About", "Why Us", "Contact"];

const PRODUCTS = [
  {
    id: 1,
    title: "ICU Beds",
    tag: "Critical Care",
    desc: "Precision-engineered intensive care beds with multi-position articulation, stainless steel frames, and medical-grade upholstery for demanding critical environments.",
    img: "/images/card_icu_bed_v2.jpg",
    badge: "Best Seller",
    accent: "#14b8a6",
  },
  {
    id: 2,
    title: "Hospital Trolleys",
    tag: "Patient Transport",
    desc: "Smooth-roll trolleys built for daily hospital use — lightweight yet robust, with lockable casters and easy-clean surfaces for infection control.",
    img: "/images/card_hospital_trolley_79.jpg",
    badge: null,
    accent: "#0d9488",
  },
  {
    id: 3,
    title: "Medical Lockers",
    tag: "Storage Solutions",
    desc: "Anti-bacterial coated lockers for medicines, instruments and personal storage — designed to the highest hygiene and durability standards.",
    img: "/images/card_medical_locker.jpg",
    badge: "New",
    accent: "#0f766e",
  },
  {
    id: 4,
    title: "Clean Room Systems",
    tag: "Modular Environments",
    desc: "Certified modular clean room panels, doors and ceilings meeting ISO Class 5–8 requirements for pharmaceutical and surgical use.",
    img: "https://images.unsplash.com/photo-1516549655169-df83a0774514?w=900&q=90",
    badge: null,
    accent: "#14b8a6",
  },
  {
    id: 5,
    title: "Procedure Tables",
    tag: "Surgical Furniture",
    desc: "Height-adjustable procedure and examination tables with stainless steel bases and seamless foam cushioning for infection control.",
    img: "/images/card_procedure_table_perfect.jpg",
    badge: null,
    accent: "#0d9488",
  },
  {
    id: 6,
    title: "Nurse Stations",
    tag: "Workstations",
    desc: "Ergonomic modular nurse station systems with integrated storage, cable management and hygienic laminate work surfaces.",
    img: "/images/card_nurse_station.jpg",
    badge: "Premium",
    accent: "#0f766e",
  },
];

const STATS = [
  { value: "100+", label: "Products", icon: "◈" },
  { value: "50+", label: "Hospitals", icon: "◉" },
  { value: "10+", label: "Years", icon: "◎" },
  { value: "24/7", label: "Support", icon: "◌" },
];

const FEATURES = [
  {
    icon: "⬡",
    title: "ISO-Grade Materials",
    desc: "Every product manufactured with hospital-grade stainless steel, anti-bacterial coatings and certified finishes.",
    num: "01",
  },
  {
    icon: "⬡",
    title: "Custom Manufacturing",
    desc: "Bespoke designs tailored to your floor plan, workflow and institutional specifications.",
    num: "02",
  },
  {
    icon: "⬡",
    title: "Rapid Delivery",
    desc: "Pan-India logistics with dedicated installation teams ensuring zero downtime for your facility.",
    num: "03",
  },
  {
    icon: "⬡",
    title: "After-Sales Service",
    desc: "Dedicated AMC contracts, spare parts availability and on-call technician support.",
    num: "04",
  },
];

const TESTIMONIALS = [
  {
    text: "The ICU beds supplied by Sri Srinivasa are exceptional — the build quality and finish surpass much more expensive alternatives we evaluated.",
    name: "Dr. Ramesh Varma",
    role: "Medical Director, Apollo-affiliated Hospital, Hyderabad",
    initials: "RV",
    stars: 5,
  },
  {
    text: "Their clean room panels met our pharma-grade requirements perfectly. Commissioning was smooth and their team was professional throughout.",
    name: "Priya Nair",
    role: "Operations Head, LifeCare Pharmaceuticals",
    initials: "PN",
    stars: 5,
  },
  {
    text: "We've outfitted three new wards with their furniture. Pricing, quality and after-sales are all top-notch. Highly recommended.",
    name: "Mr. K. Subramaniam",
    role: "CEO, MedPlus Hospitals Group",
    initials: "KS",
    stars: 5,
  },
];

export default function App() {
  const navigate = useNavigate();

  useDocumentSEO({
    title: "Sri Srinivasa Clean Rooms | Hospital Furniture & OT Infrastructure",
    description: "Premier manufacturer and supplier of hospital furniture, ICU beds, cleanroom equipment, and modular OT infrastructure. Trusted by 50+ hospitals across India.",
    canonicalUrl: "https://sri-srinivasa-clean-room.onrender.com/",
  });

  const [siteSettings, setSiteSettings] = useState(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [cleanroomExpanded, setCleanroomExpanded] = useState(false);
  const [otExpanded, setOtExpanded] = useState(false);

  useEffect(() => {
    fetch(`${window.location.origin}/api/v1/settings/homepage?t=${Date.now()}`)
      .then(res => res.json())
      .then(json => {
        if (json.success && json.data) {
          setSiteSettings(json.data);
        }
      })
      .catch((err) => console.error("Failed to load homepage settings:", err));
  }, []);

  const handleCleanroomToggle = () => {
    if (cleanroomExpanded) {
      setCleanroomExpanded(false);
      const el = document.getElementById("cleanroom-products");
      if (el) {
        el.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    } else {
      setCleanroomExpanded(true);
    }
  };

  const handleOtToggle = () => {
    if (otExpanded) {
      setOtExpanded(false);
      const el = document.getElementById("operation-theater-solutions");
      if (el) {
        el.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    } else {
      setOtExpanded(true);
    }
  };
  const [visibleSections, setVisibleSections] = useState(new Set());
  const [formData, setFormData] = useState({ name: "", phone: "", email: "", message: "" });
  const [errors, setErrors] = useState({});
  const [formSent, setFormSent] = useState(false);
  const [formError, setFormError] = useState("");

  const handleFounderEmailClick = (e) => {
    if (e) e.preventDefault();
    const formEl = document.getElementById("contact-enquiry-form") || document.querySelector(".contact__form");
    const nameInput = document.getElementById("name");
    if (formEl) {
      formEl.scrollIntoView({ behavior: "smooth", block: "center" });
      formEl.classList.remove("contact__form--highlight");
      void formEl.offsetWidth; // Force CSS reflow to retrigger animation
      formEl.classList.add("contact__form--highlight");
      setTimeout(() => {
        nameInput?.focus();
      }, 500);
    }
  };

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && entry.target.dataset.section) {
            setVisibleSections((prev) => new Set([...prev, entry.target.dataset.section]));
          }
        });
      },
      { threshold: 0.1 }
    );
    const elements = document.querySelectorAll("[data-section]");
    elements.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  const isVisible = (key) => visibleSections.has(key);

const API = window.location.origin;

  const validateForm = () => {
    const newErrors = {};
    if (!formData.name || !formData.name.trim()) newErrors.name = "Full Name is required";
    else if (!/^[a-zA-Z\s.'-]+$/.test(formData.name.trim())) newErrors.name = "Only letters, spaces, dots or hyphens allowed";

    if (!formData.phone || !formData.phone.trim()) newErrors.phone = "Phone Number is required";
    else if (!/^[0-9]{10}$/.test(formData.phone.trim())) newErrors.phone = "Phone must be exactly 10 digits";

    if (!formData.email || !formData.email.trim()) newErrors.email = "Email Address is required";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim())) newErrors.email = "Invalid email format";

    if (!formData.message || !formData.message.trim()) newErrors.message = "Message is required";
    else if (formData.message.trim().length < 5) newErrors.message = "Message must be at least 5 characters";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

const handleFormSubmit = async (e) => {
  e.preventDefault();
  if (!validateForm()) return;

  try {
    const res = await fetch(`${API}/api/v1/inquiries`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        name: formData.name,
        phone: formData.phone,
        email: formData.email,
        message: formData.message,
        type: "general"
      })
    });

    const data = await res.json();

    if (data.success) {
      setFormSent(true);
      setFormData({
        name: "",
        phone: "",
        email: "",
        message: ""
      });
    } else {
      setFormError(data.error || data.message || "Failed to send inquiry. Please try again.");
    }

  } catch (err) {
    console.log(err);
  }
};

  return (
    <div className="site">

      {/* ── NAVBAR ── */}
      <header className={`header ${scrolled ? "header--scrolled" : ""}`}>
        <div className="header__inner wrap">
          <a
            className="brand"
            href="#home"
            onClick={(e) => {
              e.preventDefault();
              const el = document.getElementById("home");
              if (el) {
                el.scrollIntoView({ behavior: "smooth", block: "start" });
                window.history.pushState(null, "", "#home");
              }
            }}
          >
            <div className="brand__logo-wrap">
              <img src={logo} alt="Sri Srinivasa Clean Rooms" className="brand__logo" />
            </div>
            <div className="brand__text-wrap">
              <span className="brand__name">Sri Srinivasa</span>
              <span className="brand__sub">Clean Rooms</span>
            </div>
          </a>

          <nav className="nav__links" aria-label="Main navigation">
          {NAV_LINKS.map((l) =>
  l === "Products" ? (
    <Link
      key={l}
      to="/products"
      className="nav__link"
    >
      {l}
      <span className="nav__link-line" />
    </Link>
  ) : (
    <a
      key={l}
      href={`#${l.toLowerCase().replace(" ", "-")}`}
      className="nav__link"
      onClick={(e) => {
        e.preventDefault();
        const targetId = l.toLowerCase().replace(" ", "-");
        const el = document.getElementById(targetId);
        if (el) {
          el.scrollIntoView({ behavior: "smooth", block: "start" });
          window.history.pushState(null, "", `#${targetId}`);
        }
      }}
    >
      {l}
      <span className="nav__link-line" />
    </a>
  )
)}
          </nav>

          <div className="nav__right">
            <a href="tel:+919440643193" className="nav__phone" aria-label="Call us">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 10.8a19.79 19.79 0 01-3.07-8.68A2 2 0 012 0h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L6.09 7.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 14.92v2z"/></svg>
              +91 94406 43193
            </a>
            <a href="https://wa.me/919440643193" target="_blank" rel="noopener noreferrer" className="nav__whatsapp" aria-label="Chat on WhatsApp" title="Chat on WhatsApp">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/><path d="M12 0C5.373 0 0 5.373 0 12c0 2.126.556 4.122 1.527 5.854L.057 24l6.304-1.651A11.933 11.933 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 22c-1.893 0-3.667-.523-5.183-1.432l-.372-.221-3.742.981.999-3.65-.241-.381A9.934 9.934 0 012 12C2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10z"/></svg>
            </a>
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
            {NAV_LINKS.map((l, idx) =>
              l === "Products" ? (
                <Link
                  key={l}
                  to="/products"
                  className="mobile-drawer__link"
                  onClick={() => setMenuOpen(false)}
                >
                  <span className="mobile-drawer__num">0{idx + 1}</span>
                  {l}
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
                </Link>
              ) : (
                <a
                  key={l}
                  href={`#${l.toLowerCase().replace(" ", "-")}`}
                  className="mobile-drawer__link"
                  onClick={(e) => {
                    e.preventDefault();
                    setMenuOpen(false);
                    const targetId = l.toLowerCase().replace(" ", "-");
                    const el = document.getElementById(targetId);
                    if (el) {
                      el.scrollIntoView({ behavior: "smooth", block: "start" });
                      window.history.pushState(null, "", `#${targetId}`);
                    }
                  }}
                >
                  <span className="mobile-drawer__num">0{idx + 1}</span>
                  {l}
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
                </a>
              )
            )}
            <a
              href="#contact"
              className="btn btn--gold mobile-drawer__cta"
              onClick={(e) => {
                e.preventDefault();
                setMenuOpen(false);
                const el = document.getElementById("contact");
                if (el) {
                  el.scrollIntoView({ behavior: "smooth", block: "start" });
                  window.history.pushState(null, "", "#contact");
                }
              }}
            >
              Get a Quote
            </a>
          </div>
        </div>
      </header>

      {/* ── HERO ── */}
      <section id="home" className="hero">
        {/* Background noise & grid */}
        <div className="hero__noise" aria-hidden="true" />
        <div className="hero__grid-lines" aria-hidden="true">
          {[...Array(8)].map((_, i) => <span key={i} className="hero__grid-v" style={{ left: `${i * 14.28}%` }} />)}
        </div>

        {/* Orbs */}
        <div className="hero__orb hero__orb--1" aria-hidden="true" />
        <div className="hero__orb hero__orb--2" aria-hidden="true" />
        <div className="hero__orb hero__orb--3" aria-hidden="true" />

        <div className="hero__inner wrap">
          <div className="hero__left">
            <div className="hero__eyebrow">
              <span className="hero__eyebrow-dot" />
              <span>Precision</span>
              <span className="hero__eyebrow-sep">·</span>
              <span>Purity</span>
              <span className="hero__eyebrow-sep">·</span>
              <span>Trust</span>
            </div>

            <h1 className="hero__title">
              <span className="hero__title-line hero__title-line--1">Premium</span>
              <span className="hero__title-line hero__title-line--2">
                Medical <em>Furniture</em>
              </span>
              <span className="hero__title-line hero__title-line--3">
                &amp; <span className="hero__title-outline">Clean Rooms</span>
              </span>
            </h1>

            <p className="hero__desc">
              We design and manufacture ICU beds, hospital furniture, modular clean room systems and healthcare infrastructure built for reliability — trusted by 50+ hospitals across India.
            </p>

            <div className="hero__actions">
              <Link to="/products" className="btn btn--gold btn--lg hero__btn-primary">
                <span>Explore Products</span>
                <span className="btn__arrow">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
                </span>
              </Link>
              <a href="#contact" className="btn btn--outline btn--lg">Contact Us</a>
            </div>

            <div className="hero__stats">
              {STATS.map((s) => (
                <div className="hero__stat" key={s.label}>
                  <strong className="hero__stat-value">{s.value}</strong>
                  <span className="hero__stat-label">{s.label}</span>
                  <div className="hero__stat-line" />
                </div>
              ))}
            </div>
          </div>

          <div className="hero__right">
            <div className="hero__visual">
              {/* Main image */}
              <div className="hero__img-main">
                <img
                  src={siteSettings?.heroBannerImage || "https://images.unsplash.com/photo-1519494080410-f9aa76cb4283?w=1200&q=90"}
                  alt="ICU Ward — Sri Srinivasa Clean Rooms"
                />
                <div className="hero__img-main-overlay" />
                <div className="hero__img-badge">
                  <div className="hero__img-badge-icon">✦</div>
                  <div>
                    <strong>ISO Certified</strong>
                    <span>Manufacturing</span>
                  </div>
                </div>
              </div>

              {/* Floating cards */}
              <div className="hero__float hero__float--tl">
                <img src="https://plus.unsplash.com/premium_photo-1764691400654-cde59d1d6294?w=600&q=90" alt="Clean Corridor" />
                <div className="hero__float-label">Clean Corridor</div>
              </div>

              <div className="hero__float hero__float--br">
                <img src="https://images.unsplash.com/photo-1551076805-e1869033e561?w=600&q=90" alt="Procedure Table" />
                <div className="hero__float-label">Procedure Tables</div>
              </div>

              {/* Experience badge */}
              <div className="hero__exp-badge">
                <svg viewBox="0 0 100 100" className="hero__exp-ring">
                  <circle cx="50" cy="50" r="44" fill="none" stroke="rgba(20,184,166,0.3)" strokeWidth="1" strokeDasharray="4 4" />
                </svg>
                <div className="hero__exp-inner">
                  <strong>10+</strong>
                  <span>Years of<br />Excellence</span>
                </div>
              </div>

              {/* Decorative corner */}
              <div className="hero__corner-deco" aria-hidden="true">
                <svg width="80" height="80" viewBox="0 0 80 80"><path d="M0 0 L80 0 L80 80" fill="none" stroke="rgba(20,184,166,0.4)" strokeWidth="1" /></svg>
              </div>
            </div>
          </div>
        </div>

       
      </section>

      {/* ── MARQUEE BAND ── */}
      <div className="marquee-band" aria-hidden="true">
        <div className="marquee-track">
          {[...Array(6)].map((_, i) =>
            ["ICU Beds", "Hospital Trolleys", "Clean Room Systems", "Medical Lockers", "Procedure Tables", "Nurse Stations", "Modular Panels", "Stainless Steel Furniture"].map((t) => (
              <span key={`${i}-${t}`} className="marquee-item">
                <span className="marquee-diamond">◆</span>
                {t}
              </span>
            ))
          )}
        </div>
      </div>

{/* ── PRODUCTS ── */}
<section
  id="products"
  className="products section"
  data-section="products"
>
  <div className="wrap">

    <div
      className={`section-header ${
        isVisible("products") ? "anim-in" : ""
      }`}
    >
      <p className="eyebrow-label">
        <span className="eyebrow-label__line" />
        Our Products
        <span className="eyebrow-label__line" />
      </p>

      <h2 className="section-title">
        Engineered for
        <br />
        <em>Hospitals &amp; Healthcare</em>
      </h2>

      <p className="section-desc">
        Premium-grade products crafted with durability,
        hygiene standards and modern design for India's
        most demanding healthcare environments.
      </p>
    </div>

    <div className="products__grid">
      {PRODUCTS.map((p, i) => (
        <article
          key={p.id}
          className={`product-card ${
            isVisible("products")
              ? "product-card--visible"
              : ""
          }`}
          style={{
            animationDelay: `${i * 0.08}s`,
            cursor: "pointer"
          }}
          onClick={() => navigate("/products")}
        >
          {p.badge && (
            <div
              className="product-card__badge"
              style={{ background: p.accent }}
            >
              {p.badge}
            </div>
          )}

          <div className="product-card__img-wrap">
            <img
              src={p.img}
              alt={p.title}
              loading="lazy"
            />
            <div className="product-card__img-overlay" />
            <div className="product-card__tag-pill">
              {p.tag}
            </div>
          </div>

          <div className="product-card__body">
            <h3 className="product-card__title">
              {p.title}
            </h3>

            <p className="product-card__desc">
              {p.desc}
            </p>
          </div>

          <div
            className="product-card__bottom-line"
            style={{ background: p.accent }}
          />
        </article>
      ))}
    </div>

    <div className="products__cta-wrap">
      <Link to="/products" className="btn btn--gold btn--lg products__cta-btn" id="featured-explore-products-btn">
        <span>Explore Products</span>
        <span className="btn__arrow">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <path d="M5 12h14M12 5l7 7-7 7" />
          </svg>
        </span>
      </Link>
    </div>

  </div>
</section>

      {/* ── SECTION 1: CLEANROOM PRODUCTS ── */}
      <section id="cleanroom-products" className="solutions-section section" data-section="cleanroom-products">
        <div className="wrap">
          <div className={`section-header ${isVisible("cleanroom-products") ? "anim-in" : ""}`}>
            <p className="eyebrow-label">
              <span className="eyebrow-label__line" />
              Cleanroom Infrastructure
              <span className="eyebrow-label__line" />
            </p>

            <h2 className="section-title">
              CLEANROOM PRODUCTS
            </h2>

            <p className="section-desc">
              Complete cleanroom infrastructure solutions engineered for controlled,
              hygienic and high-performance environments.
            </p>
          </div>

          <div className="solutions-grid">
            {(cleanroomExpanded ? CLEANROOM_SOLUTIONS : CLEANROOM_SOLUTIONS.slice(0, 6)).map((item, index) => (
              <article
                key={item.id}
                className={`solution-card ${isVisible("cleanroom-products") ? "solution-card--visible" : ""}`}
                style={{ animationDelay: `${(index % 6) * 0.08}s` }}
              >
                <div className="solution-card__img-wrap">
                  <img src={item.image} alt={item.name} loading="lazy" />
                  <div className="solution-card__img-overlay" />
                </div>

                <div className="solution-card__body">
                  <h3 className="solution-card__title">{item.name}</h3>
                  <p className="solution-card__desc">{item.description}</p>
                </div>

                <div className="solution-card__bottom-line" />
              </article>
            ))}
          </div>

          <div className="solutions-toggle-wrap">
            <button
              type="button"
              id="toggle-cleanroom-solutions"
              className="solutions-toggle-btn"
              onClick={handleCleanroomToggle}
            >
              {cleanroomExpanded ? "Show Less ↑" : "Explore All 17 Solutions ↓"}
            </button>
          </div>
        </div>
      </section>

      {/* ── SECTION 2: OPERATION THEATER SOLUTIONS ── */}
      <section id="operation-theater-solutions" className="solutions-section section" data-section="operation-theater-solutions">
        <div className="wrap">
          <div className={`section-header ${isVisible("operation-theater-solutions") ? "anim-in" : ""}`}>
            <p className="eyebrow-label">
              <span className="eyebrow-label__line" />
              Surgical Environments
              <span className="eyebrow-label__line" />
            </p>

            <h2 className="section-title">
              OPERATION THEATER SOLUTIONS
            </h2>

            <p className="section-desc">
              Integrated operation theater infrastructure designed for safe, efficient
              and modern surgical environments.
            </p>
          </div>

          <div className="solutions-grid">
            {(otExpanded ? OT_SOLUTIONS : OT_SOLUTIONS.slice(0, 6)).map((item, index) => (
              <article
                key={item.id}
                className={`solution-card ${isVisible("operation-theater-solutions") ? "solution-card--visible" : ""}`}
                style={{ animationDelay: `${(index % 6) * 0.08}s` }}
              >
                <div className="solution-card__img-wrap">
                  <img src={item.image} alt={item.name} loading="lazy" />
                  <div className="solution-card__img-overlay" />
                </div>

                <div className="solution-card__body">
                  <h3 className="solution-card__title">{item.name}</h3>
                  <p className="solution-card__desc">{item.description}</p>
                </div>

                <div className="solution-card__bottom-line" />
              </article>
            ))}
          </div>

          <div className="solutions-toggle-wrap">
            <button
              type="button"
              id="toggle-ot-solutions"
              className="solutions-toggle-btn"
              onClick={handleOtToggle}
            >
              {otExpanded ? "Show Less ↑" : "Explore All 11 Solutions ↓"}
            </button>
          </div>
        </div>
      </section>

      {/* ── ABOUT ── */}
      <section id="about" className="about section" data-section="about">
        <div className="about__bg-shape" aria-hidden="true" />
        <div className="wrap">
          <div className={`about__inner ${isVisible("about") ? "anim-in" : ""}`}>
            <div className="about__left">
              <div className="about__img-stack">
                <div className="about__img-main">
                  <img
                    src="https://images.unsplash.com/photo-1516549655169-df83a0774514?w=1000&q=90"
                    alt="Manufacturing Facility"
                  />
                  <div className="about__img-shimmer" />
                </div>
                <div className="about__img-secondary">
                  <img
                    src="/images/cleanroom_corridor_about.jpg"
                    alt="Cleanroom Infrastructure"
                  />
                </div>
                <div className="about__stat-card">
                  <div className="about__stat-card-inner">
                    <strong>50+</strong>
                    <span>Hospitals<br />Served</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="about__right">
              <p className="eyebrow-label">
                <span className="eyebrow-label__line" />
                About Us
              </p>
              <h2 className="section-title" style={{ textAlign: "left" }}>
                A Decade of<br />
                <em>Medical Excellence</em>
              </h2>
              <p className="about__text">
                Founded in 2014, Sri Srinivasa Clean Rooms has grown from a boutique
                manufacturer to one of Telangana's most trusted names in medical furniture
                and clean room infrastructure. Every product that leaves our facility
                is a reflection of our obsession with precision and hygiene.
              </p>
              <p className="about__text">
                From design consultation to post-installation support, we own every step —
                ensuring your facility operates at the highest standards of safety,
                efficiency and care.
              </p>

              <div className="about__quote">
                <div className="about__quote-mark">"</div>
                <p>Trusted partner for hospitals, clinics, pharma labs and institutional healthcare spaces across Telangana and Andhra Pradesh.</p>
                <div className="about__quote-author">
                  <div className="about__quote-avatar">CC</div>
                  <div>
                    <strong>Chakradhar Chepuri</strong>
                    <span>Founder &amp; Managing Director</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── WHY US ── */}
      <section id="why-us" className="why section" data-section="why">
        <div className="wrap">
          <div className={`section-header ${isVisible("why") ? "anim-in" : ""}`}>
            <p className="eyebrow-label">
              <span className="eyebrow-label__line" />
              Why Choose Us
              <span className="eyebrow-label__line" />
            </p>
            <h2 className="section-title">
              Built for<br />
              <em>Performance &amp; Trust</em>
            </h2>
          </div>

          <div className="why__grid">
            {FEATURES.map((f, i) => (
              <div
                key={i}
                className={`feature-card ${isVisible("why") ? "feature-card--visible" : ""}`}
                style={{ animationDelay: `${i * 0.12}s` }}
              >
                <div className="feature-card__num">{f.num}</div>
                <div className="feature-card__icon-wrap">
                  <div className="feature-card__icon-ring" />
                  <span className="feature-card__icon">{f.icon}</span>
                </div>
                <h4 className="feature-card__title">{f.title}</h4>
                <p className="feature-card__desc">{f.desc}</p>
                <div className="feature-card__bottom-accent" />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── TESTIMONIALS ── */}
      <section className="testimonials section" data-section="testimonials">
        <div className="testimonials__bg" aria-hidden="true" />
        <div className="wrap">
          <div className={`section-header ${isVisible("testimonials") ? "anim-in" : ""}`}>
            <p className="eyebrow-label">
              <span className="eyebrow-label__line" />
              Client Voices
              <span className="eyebrow-label__line" />
            </p>
            <h2 className="section-title">
              Trusted by<br />
              <em>Industry Leaders</em>
            </h2>
          </div>

          <div className="testimonials__grid">
            {TESTIMONIALS.map((t, i) => (
              <div
                key={i}
                className={`testimonial-card ${isVisible("testimonials") ? "testimonial-card--visible" : ""}`}
                style={{ animationDelay: `${i * 0.15}s` }}
              >
                <div className="testimonial-card__top">
                  <div className="testimonial-card__quote-icon">"</div>
                  <div className="testimonial-card__stars">
                    {"★".repeat(t.stars)}
                  </div>
                </div>
                <p className="testimonial-card__text">{t.text}</p>
                <div className="testimonial-card__divider" />
                <div className="testimonial-card__author">
                  <div className="testimonial-card__avatar">
                    <span>{t.initials}</span>
                    <div className="testimonial-card__avatar-ring" />
                  </div>
                  <div className="testimonial-card__author-info">
                    <strong>{t.name}</strong>
                    <span>{t.role}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA BANNER ── */}
      <section className="cta-banner" data-section="cta">
        <div className="cta-banner__bg" aria-hidden="true" />
        <div className="cta-banner__particles" aria-hidden="true">
          {[...Array(12)].map((_, i) => <span key={i} className="cta-banner__particle" />)}
        </div>
        <div className={`wrap cta-banner__inner ${isVisible("cta") ? "anim-in" : ""}`}>
          <div className="cta-banner__text">
            <p className="cta-banner__eyebrow">Ready to Transform Your Facility?</p>
            <h2>Get a Custom Quote for<br />Bulk Hospital Furniture</h2>
            <p className="cta-banner__sub">Clean room systems, ICU beds, and complete ward setups — delivered and installed.</p>
          </div>
          <div className="cta-banner__actions">
            <a href="#contact" className="btn btn--white btn--lg">
              Request a Quote
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
            </a>
            <a href="tel:+919440643193" className="btn btn--ghost-white btn--lg">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 10.8a19.79 19.79 0 01-3.07-8.68A2 2 0 012 0h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L6.09 7.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 14.92v2z"/></svg>
              Call Now
            </a>
          </div>
        </div>
      </section>

      {/* ── CONTACT ── */}
      <section id="contact" className="contact section" data-section="contact">
        <div className="wrap">
          <div className={`section-header ${isVisible("contact") ? "anim-in" : ""}`}>
            <p className="eyebrow-label">
              <span className="eyebrow-label__line" />
              Get In Touch
              <span className="eyebrow-label__line" />
            </p>
            <h2 className="section-title">
              Let's Build Something<br />
              <em>Exceptional Together</em>
            </h2>
          </div>

          <div className="contact__grid">
            {/* Info side */}
            <div className={`contact__info ${isVisible("contact") ? "anim-slide-left" : ""}`}>
              <div className="contact__details">
                <div className="contact__detail">
                  <div className="contact__detail-icon">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" width="22" height="22"><path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 10.8a19.79 19.79 0 01-3.07-8.68A2 2 0 012 0h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L6.09 7.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 14.92v2z"/></svg>
                  </div>
                  <div className="contact__detail-text">
                    <strong>Phone</strong>
                    <a href="tel:+919440643193">+91 94406 43193</a>
                  </div>
                </div>

                <div className="contact__detail">
                  <div className="contact__detail-icon">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" width="22" height="22"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
                  </div>
                  <div className="contact__detail-text">
                    <strong>Email</strong>
                    <a href="mailto:chakri.9441@gmail.com">chakri.9441@gmail.com</a>
                  </div>
                </div>

                <div className="contact__detail">
                  <div className="contact__detail-icon">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" width="22" height="22"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/><circle cx="12" cy="10" r="3"/></svg>
                  </div>
                  <div className="contact__detail-text">
                    <strong>Address</strong>
                    <span>Subhash Nagar, Malkajgiri,<br />Telangana – 500055</span>
                  </div>
                </div>
              </div>

              <div className="contact__person-card">
                <div className="contact__person-avatar">CC</div>
                <div className="contact__person-info">
                  <strong>Chakradhar Chepuri</strong>
                  <span>Founder &amp; Managing Director</span>
                  <div className="contact__person-socials">
                    <a href="tel:+919440643193" className="contact__person-social-btn">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 10.8a19.79 19.79 0 01-3.07-8.68A2 2 0 012 0h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L6.09 7.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 14.92v2z"/></svg>
                      Call
                    </a>
                    <button
                      type="button"
                      onClick={handleFounderEmailClick}
                      className="contact__person-social-btn"
                      id="founder-email-btn"
                      aria-label="Send message via contact form"
                    >
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
                      Email
                    </button>
                    <a href="https://wa.me/919440643193" target="_blank" rel="noopener noreferrer" className="contact__person-social-btn contact__person-social-btn--whatsapp" aria-label="Chat on WhatsApp" title="Chat on WhatsApp">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/><path d="M12 0C5.373 0 0 5.373 0 12c0 2.126.556 4.122 1.527 5.854L.057 24l6.304-1.651A11.933 11.933 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 22c-1.893 0-3.667-.523-5.183-1.432l-.372-.221-3.742.981.999-3.65-.241-.381A9.934 9.934 0 012 12C2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10z"/></svg>
                      WhatsApp
                    </a>
                  </div>
                </div>
              </div>

              <div className="contact__map">
                <iframe
                  title="Sri Srinivasa Clean Rooms Location"
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3805.264038765636!2d78.5278!3d17.4560!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMTfCsDI3JzIxLjYiTiA3OMKwMzEnNDAuMSJF!5e0!3m2!1sen!2sin!4v1234567890"
                  width="100%"
                  height="200"
                  style={{ border: 0, borderRadius: "16px" }}
                  allowFullScreen=""
                  loading="lazy"
                />
              </div>
            </div>

            {/* Form side */}
            <div className={`contact__form-wrap ${isVisible("contact") ? "anim-slide-right" : ""}`}>
              {formSent ? (
                <div className="contact__success">
                  <div className="contact__success-circle">
                    <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#14b8a6" strokeWidth="2.5"><polyline points="20 6 9 17 4 12"/></svg>
                  </div>
                  <h3>Message Received!</h3>
                  <p>We'll get back to you within 24 hours. Thank you for reaching out to Sri Srinivasa Clean Rooms.</p>
                </div>
              ) : (
                <form className="contact__form" id="contact-enquiry-form" onSubmit={handleFormSubmit}>
                  <div className="contact__form-header">
                    <h3>Send an Enquiry</h3>
                    <p>We typically respond within 24 hours</p>
                    {formError && <p style={{ color: "#dc2626", marginTop: "8px", fontSize: "14px" }}>✕ {formError}</p>}
                  </div>

                  <div className="form__row">
                    <div className="form__field">
                      <label htmlFor="name">Full Name <span>*</span></label>
                      <input
                        id="name"
                        type="text"
                        placeholder="Dr. Ramesh Varma"
                        className={errors.name ? "error-input" : ""}
                        style={errors.name ? { borderColor: 'red' } : {}}
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      />
                      {errors.name && <span style={{ color: "red", fontSize: "0.85rem", marginTop: "4px" }}>{errors.name}</span>}
                    </div>
                    <div className="form__field">
                      <label htmlFor="phone">Phone Number <span>*</span></label>
                      <input
                        id="phone"
                        type="tel"
                        placeholder="9876543210"
                        className={errors.phone ? "error-input" : ""}
                        style={errors.phone ? { borderColor: 'red' } : {}}
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      />
                      {errors.phone && <span style={{ color: "red", fontSize: "0.85rem", marginTop: "4px" }}>{errors.phone}</span>}
                    </div>
                  </div>

                  <div className="form__field">
                    <label htmlFor="email">Email Address <span>*</span></label>
                    <input
                      id="email"
                      type="email"
                      placeholder="you@hospital.com"
                      className={errors.email ? "error-input" : ""}
                      style={errors.email ? { borderColor: 'red' } : {}}
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    />
                    {errors.email && <span style={{ color: "red", fontSize: "0.85rem", marginTop: "4px" }}>{errors.email}</span>}
                  </div>

                  <div className="form__field">
                    <label htmlFor="message">Message <span>*</span></label>
                    <textarea
                      id="message"
                      rows={5}
                      placeholder="Tell us about your requirements — product types, quantities, timeline..."
                      className={errors.message ? "error-input" : ""}
                      style={errors.message ? { borderColor: 'red' } : {}}
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    />
                    {errors.message && <span style={{ color: "red", fontSize: "0.85rem", marginTop: "4px" }}>{errors.message}</span>}
                  </div>

                  <button type="submit" className="btn btn--gold btn--lg btn--full">
                    <span>Send Enquiry</span>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
                  </button>
                </form>
              )}
            </div>
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
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M16 8a6 6 0 016 6v7h-4v-7a2 2 0 00-2-2 2 2 0 00-2 2v7h-4v-7a6 6 0 016-6zM2 9h4v12H2z"/><circle cx="4" cy="4" r="2"/></svg>
              </a>
              <a href="https://wa.me/919440643193" aria-label="WhatsApp" className="footer__social">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/><path d="M12 0C5.373 0 0 5.373 0 12c0 2.126.556 4.122 1.527 5.854L.057 24l6.304-1.651A11.933 11.933 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 22c-1.893 0-3.667-.523-5.183-1.432l-.372-.221-3.742.981.999-3.65-.241-.381A9.934 9.934 0 012 12C2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10z"/></svg>
              </a>
              <a href="mailto:chakri.9441@gmail.com" aria-label="Email" className="footer__social">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
              </a>
            </div>
          </div>

          <div className="footer__col">
            <h4>Products</h4>
            {["ICU Beds", "Hospital Trolleys", "Medical Lockers", "Clean Room Systems", "Procedure Tables", "Nurse Stations"].map((p) => (
              <Link key={p} to="/products">{p}</Link>
            ))}
          </div>

          <div className="footer__col">
            <h4>Company</h4>
            {["About Us", "Why Choose Us", "Quality Standards", "Bulk Orders", "Careers"].map((c) => {
              const targetId = c === "About Us" ? "about" : c === "Why Choose Us" || c === "Quality Standards" ? "why-us" : "contact";
              return (
                <a
                  key={c}
                  href={`#${targetId}`}
                  onClick={(e) => {
                    e.preventDefault();
                    const el = document.getElementById(targetId);
                    if (el) {
                      el.scrollIntoView({ behavior: "smooth", block: "start" });
                      window.history.pushState(null, "", `#${targetId}`);
                    }
                  }}
                >
                  {c}
                </a>
              );
            })}
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
      {/* Floating Action Buttons: Call & WhatsApp */}
      <div className="floating-actions" aria-label="Quick contact options">
        <a
          href="tel:+919440643193"
          className="floating-btn floating-call"
          aria-label="Call Sri Srinivasa Clean Rooms at +91 94406 43193"
          title="Call +91 94406 43193"
          id="floating-call-btn"
        >
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="currentColor"
            aria-hidden="true"
          >
            <path d="M20.01 15.38c-1.23 0-2.42-.2-3.53-.56a.977.977 0 00-1.01.24l-2.2 2.2a15.053 15.053 0 01-6.59-6.59l2.2-2.21a.96.96 0 00.25-1.01A11.36 11.36 0 018.57 3.9c0-.55-.45-1-1-1H4c-.55 0-1 .45-1 1 0 9.39 7.61 17 17 17 .55 0 1-.45 1-1v-3.52c0-.55-.45-1-1-1z"/>
          </svg>
        </a>

        <a
          href="https://wa.me/919440643193"
          target="_blank"
          rel="noopener noreferrer"
          className="floating-btn floating-whatsapp"
          aria-label="Chat with Sri Srinivasa Clean Rooms on WhatsApp"
          title="Chat on WhatsApp"
          id="floating-whatsapp-btn"
        >
          <svg
            width="30"
            height="30"
            viewBox="0 0 24 24"
            fill="currentColor"
            aria-hidden="true"
          >
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/>
            <path d="M12 0C5.373 0 0 5.373 0 12c0 2.126.556 4.122 1.527 5.854L.057 24l6.304-1.651A11.933 11.933 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 22c-1.893 0-3.667-.523-5.183-1.432l-.372-.221-3.742.981.999-3.65-.241-.381A9.934 9.934 0 012 12C2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10z"/>
          </svg>
        </a>
      </div>

    </div>
  );
}