import { useNavigate } from "react-router-dom";
import { useEffect, useState, useCallback } from "react";
import "./AdminDashboard.css";
import logo from "../assets/logo.png";

const API = "https://my-react-backend-im39.onrender.com";

export default function AdminDashboard() {
  const navigate = useNavigate();

  const [products, setProducts] = useState([]);
  const [inquiries, setInquiries] = useState([]);
  const [categories, setCategories] = useState([]);
  const [newCategory, setNewCategory] = useState("");
  const [activeTab, setActiveTab] = useState("products");
  const [editingProduct, setEditingProduct] = useState(null);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [toast, setToast] = useState(null);
  const [loading, setLoading] = useState(false);
  const [formKey, setFormKey] = useState(0);
  
  // Filter states for inquiries
  const [inquiryFilter, setInquiryFilter] = useState("all");
  const [inquirySearch, setInquirySearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [priorityFilter, setPriorityFilter] = useState("all");
  const [leadType, setLeadType] = useState("all"); // 🔥 NEW: Lead Type Filter
  
  // Notes modal state
  const [showNotesModal, setShowNotesModal] = useState(false);
  const [selectedInquiry, setSelectedInquiry] = useState(null);
  const [noteText, setNoteText] = useState("");
  
  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Status options
  const statusOptions = [
    { value: "new", label: "🆕 New", color: "#ef4444", bg: "#fee2e2" },
    { value: "contacted", label: "📞 Contacted", color: "#f59e0b", bg: "#fef3c7" },
    { value: "quotation", label: "📄 Quotation Sent", color: "#3b82f6", bg: "#dbeafe" },
    { value: "negotiation", label: "🤝 Negotiation", color: "#8b5cf6", bg: "#ede9fe" },
    { value: "closed", label: "✅ Closed", color: "#10b981", bg: "#d1fae5" },
    { value: "rejected", label: "❌ Rejected", color: "#6b7280", bg: "#f3f4f6" }
  ];

  // Priority options
  const priorityOptions = [
    { value: "normal", label: "Normal", color: "#6b7280", bg: "#f3f4f6" },
    { value: "hot", label: "🔥 Hot Lead", color: "#ef4444", bg: "#fee2e2" },
    { value: "bulk", label: "📦 Bulk Order", color: "#8b5cf6", bg: "#ede9fe" },
    { value: "dealer", label: "🏪 Dealer", color: "#f59e0b", bg: "#fef3c7" },
    { value: "urgent", label: "⚠️ Urgent", color: "#dc2626", bg: "#fee2e2" },
    { value: "hospital", label: "🏥 Hospital", color: "#10b981", bg: "#d1fae5" }
  ];

  const showToast = (message, type = "success") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3500);
  };

  const safeJson = async (res) => {
    const ct = res.headers.get("content-type") || "";
    if (ct.includes("application/json")) return res.json();
    const text = await res.text();
    console.error("Non-JSON server response:", text);
    throw new Error(`Server ${res.status}: ${text.slice(0, 300)}`);
  };

  const fetchProducts = useCallback(async () => {
    try {
      const res = await fetch(`${API}/api/products`);
      const data = await safeJson(res);
      setProducts(Array.isArray(data) ? data : data.products ?? []);
    } catch (err) { console.error("fetchProducts:", err); }
  }, []);

  const fetchCategories = async () => {
    try {
      const res = await fetch(`${API}/api/categories`);
      const data = await res.json();
      setCategories(Array.isArray(data) ? data : data.categories ?? []);
    } catch (err) { console.error("fetchCategories:", err); }
  };

  const fetchInquiries = useCallback(async () => {
    try {
      const res = await fetch(`${API}/api/inquiries`);
      const data = await safeJson(res);
      setInquiries(Array.isArray(data) ? data : data.inquiries ?? []);
    } catch (err) { console.warn("fetchInquiries:", err.message); }
  }, []);

  // Generate WhatsApp message
  const getWhatsAppMessage = (inq) => {
    const msg = 
`🏥 Sri Srinivasa Clean Rooms

📞 Call/WhatsApp: +91 94406 43193
📧 Email: chakri.9441@gmail.com

────────────────────────────

📋 NEW INQUIRY RECEIVED

👤 Name: ${inq.name}
📱 Phone: ${inq.phone}
📧 Email: ${inq.email || "Not provided"}
📦 Product: ${inq.productName || "Not specified"}
💬 Message: ${inq.message || "No message"}
📅 Date: ${new Date(inq.createdAt).toLocaleString()}
🏷️ Status: New
⭐ Priority: Normal

────────────────────────────

🔹 Premium Medical Furniture Manufacturer
🔹 Trusted by 50+ Hospitals Across India
🔹 ISO Certified Quality

📍 Subhash Nagar, Malkajgiri
📍 Telangana – 500055

⏰ Response: Within 24 hours

Thank you for choosing Sri Srinivasa Clean Rooms`;
    
    return encodeURIComponent(msg);
  };

  // Generate Email
  const getEmailSubject = (inq) => {
    return encodeURIComponent(`Inquiry from ${inq.name} - ${inq.productName || "Product Inquiry"} - Sri Srinivasa Clean Rooms`);
  };

  const getEmailBody = (inq) => {
    const body = 
`Dear ${inq.name},

Thank you for your inquiry with Sri Srinivasa Clean Rooms.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
YOUR INQUIRY DETAILS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Name: ${inq.name}
Phone: ${inq.phone}
Email: ${inq.email || "Not provided"}
Product: ${inq.productName || "Not specified"}
Message: ${inq.message || "No message"}
Date: ${new Date(inq.createdAt).toLocaleString()}
Status: New
Priority: Normal

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
ABOUT US
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Sri Srinivasa Clean Rooms is India's leading manufacturer of premium medical furniture and clean room infrastructure.

Our Products:
✓ ICU Beds & Hospital Furniture
✓ Modular Clean Room Systems
✓ Medical Lockers & Storage
✓ Procedure & Examination Tables
✓ Hospital Trolleys
✓ Nurse Stations

Trusted by 50+ hospitals across India.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
CONTACT US
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Phone: +91 94406 43193
Email: chakri.9441@gmail.com
Address: Subhash Nagar, Malkajgiri, Telangana – 500055

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

We will respond within 24 hours with the best quote.

Best Regards,
Chakradhar Chepuri
Founder & Managing Director
Sri Srinivasa Clean Rooms`;
    
    return encodeURIComponent(body);
  };

  // Add Category
  const addCategory = async () => {
    if (!newCategory.trim()) {
      showToast("Please enter a category name", "error");
      return;
    }

    try {
      const res = await fetch(`${API}/api/categories`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: newCategory.trim() })
      });
      const data = await res.json();
      if (data.success) {
        setNewCategory("");
        await fetchCategories();
        showToast("Category added successfully");
      } else {
        showToast(data.message || "Failed to add category", "error");
      }
    } catch (err) {
      showToast("Server error", "error");
    }
  };

  // Delete Category
  const deleteCategory = async (id) => {
    if (!window.confirm("Delete this category? Products in this category will be affected.")) return;
    try {
      const res = await fetch(`${API}/api/categories/${id}`, { method: "DELETE" });
      if (res.ok) {
        await fetchCategories();
        await fetchProducts();
        showToast("Category deleted successfully");
      } else {
        showToast("Failed to delete category", "error");
      }
    } catch (err) {
      showToast("Server error", "error");
    }
  };

useEffect(() => {
  const token = localStorage.getItem("adminToken");

  if (!token) {
    navigate("/admin/login", { replace: true });
    return;
  }

  fetchProducts();
  fetchInquiries();
  fetchCategories();
}, [navigate]);

  // Safe CSV Export
  const exportToCSV = () => {
    const headers = ["Date", "Name", "Phone", "Email", "Product", "Message", "Status", "Priority", "Lead Type", "Notes"];
    
    const rows = filteredInquiries.map(inq => [
      new Date(inq.createdAt).toLocaleString(),
      inq.name,
      inq.phone,
      inq.email || "-",
      inq.productName || "-",
      inq.message?.replace(/,/g, ";").replace(/\n/g, " "),
      statusOptions.find(s => s.value === inq.status)?.label || inq.status || "New",
      priorityOptions.find(p => p.value === inq.priority)?.label || "Normal",
      inq.type === "product" ? "Product Lead" : "General Lead",
      inq.notes?.map(n => `${new Date(n.createdAt).toLocaleString()}: ${n.note}`).join(" | ") || "-"
    ]);
    
    const csvContent = [headers, ...rows]
      .map(row => row.map(cell => `"${cell}"`).join(","))
      .join("\n");
    
    const blob = new Blob(["\uFEFF" + csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.href = url;
    link.setAttribute("download", `inquiries_${new Date().toISOString().split("T")[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    
    showToast("Exported to CSV successfully");
  };

  // Update inquiry status
  const updateInquiryStatus = async (id, status) => {
    try {
      const res = await fetch(`${API}/api/inquiries/${id}/status`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status })
      });
      if (res.ok) {
        setInquiries(prev => prev.map(i => i._id === id ? { ...i, status } : i));
        showToast(`Status updated to ${statusOptions.find(s => s.value === status)?.label}`);
      }
    } catch (err) { console.error(err); }
  };

  // Update inquiry priority
  const updateInquiryPriority = async (id, priority) => {
    try {
      const res = await fetch(`${API}/api/inquiries/${id}/priority`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ priority })
      });
      if (res.ok) {
        setInquiries(prev => prev.map(i => i._id === id ? { ...i, priority } : i));
        showToast(`Priority updated`);
      }
    } catch (err) { console.error(err); }
  };

  // Add note to inquiry
  const addNote = async () => {
    if (!noteText.trim()) return;
    try {
      const res = await fetch(`${API}/api/inquiries/${selectedInquiry._id}/notes`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ note: noteText, createdAt: new Date().toISOString() })
      });
      if (res.ok) {
        const updated = await res.json();
        setInquiries(prev => prev.map(i => i._id === selectedInquiry._id ? updated : i));
        setNoteText("");
        showToast("Note added successfully");
      }
    } catch (err) { console.error(err); }
  };

  const addProduct = async (e) => {
    e.preventDefault();
    setLoading(true);
    const form = e.target;

    if (!form.image.files[0]) {
      showToast("Please select a product image", "error");
      setLoading(false);
      return;
    }

    const fd = new FormData();
    fd.append("title", form.title.value.trim());
    fd.append("price", form.price.value.trim());
    fd.append("category", form.category.value);
    fd.append("desc", form.desc.value.trim());
    fd.append("image", form.image.files[0]);

    try {
      const res = await fetch(`${API}/api/products`, { method: "POST", body: fd });
      const data = await safeJson(res);

      if (res.ok || data.success) {
        showToast("Product added successfully!");
        form.reset();
        setSearchTerm("");
        await fetchProducts();
        setFormKey(k => k + 1);
        setActiveTab("products");
      } else {
        showToast(data.message || "Failed to add product", "error");
      }
    } catch (err) {
      showToast(err.message || "Server error", "error");
    } finally {
      setLoading(false);
    }
  };

  const updateProduct = async (e) => {
    e.preventDefault();
    setLoading(true);
    const form = e.target;

    const fd = new FormData();
    fd.append("title", form.title.value.trim());
    fd.append("price", form.price.value.trim());
    fd.append("category", form.category.value);
    fd.append("desc", form.desc.value.trim());
    if (form.image.files && form.image.files[0]) {
      fd.append("image", form.image.files[0]);
    }

    try {
      const res = await fetch(`${API}/api/products/${editingProduct._id}`, { method: "PUT", body: fd });
      const data = await safeJson(res);

      if (res.ok || data.success) {
        showToast("Product updated successfully!");
        setEditingProduct(null);
        await fetchProducts();
        setActiveTab("products");
      } else {
        showToast(data.message || "Failed to update product", "error");
      }
    } catch (err) {
      showToast(err.message || "Server error — check console", "error");
    } finally {
      setLoading(false);
    }
  };

  const deleteProduct = async (id) => {
    if (!window.confirm("Delete this product?")) return;
    setProducts(prev => prev.filter(p => p._id !== id));
    try {
      const res = await fetch(`${API}/api/products/${id}`, { method: "DELETE" });
      if (res.ok) showToast("Product deleted");
      else { showToast("Failed to delete", "error"); fetchProducts(); }
    } catch { showToast("Server error", "error"); fetchProducts(); }
  };

  const markAsRead = async (id) => {
    setInquiries(prev => prev.map(i => i._id === id ? { ...i, read: true } : i));
    try { await fetch(`${API}/api/inquiries/${id}/read`, { method: "PUT" }); } 
    catch (err) { console.error(err); }
  };

  const deleteInquiry = async (id) => {
    if (!window.confirm("Delete this inquiry?")) return;
    setInquiries(prev => prev.filter(i => i._id !== id));
    try {
      await fetch(`${API}/api/inquiries/${id}`, { method: "DELETE" });
      showToast("Inquiry deleted");
    } catch { showToast("Server error", "error"); }
  };

  const logout = () => { localStorage.removeItem("adminToken"); navigate("/admin/login"); };

  // 🔥 UPDATED: Filter inquiries with Lead Type
  const filteredInquiries = inquiries.filter(inq => {
    // Search filter
    const matchesSearch = !inquirySearch || 
      inq.name?.toLowerCase().includes(inquirySearch.toLowerCase()) ||
      inq.phone?.includes(inquirySearch) ||
      inq.email?.toLowerCase().includes(inquirySearch.toLowerCase()) ||
      inq.productName?.toLowerCase().includes(inquirySearch.toLowerCase());
    
    // Status filter
    const matchesStatus = statusFilter === "all" || inq.status === statusFilter;
    
    // Priority filter
    const matchesPriority = priorityFilter === "all" || inq.priority === priorityFilter;
    
    // 🔥 NEW: Lead Type filter
  const matchesType =
  leadType === "all" ||
  (leadType === "product" && inq.type === "product") ||
  (leadType === "general" && (!inq.type || inq.type === "general"));
    
    // Quick filter (unread, today, week, closed, hot)
    let matchesQuick = true;
    if (inquiryFilter === "unread") matchesQuick = !inq.read;
    else if (inquiryFilter === "today") {
      const today = new Date().toDateString();
      matchesQuick = new Date(inq.createdAt).toDateString() === today;
    }
    else if (inquiryFilter === "week") {
      const weekAgo = new Date();
      weekAgo.setDate(weekAgo.getDate() - 7);
      matchesQuick = new Date(inq.createdAt) >= weekAgo;
    }
    else if (inquiryFilter === "closed") matchesQuick = inq.status === "closed";
    else if (inquiryFilter === "hot") matchesQuick = inq.priority === "hot";
    
    return matchesSearch && matchesStatus && matchesPriority && matchesQuick && matchesType;
  });

  // Pagination
  const paginatedInquiries = filteredInquiries.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );
  const totalPages = Math.ceil(filteredInquiries.length / itemsPerPage);

  const filteredProducts = products.filter(p =>
    p.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.category?.toLowerCase().includes(searchTerm.toLowerCase())
  );
  const getCategoryCount = (catName) => products.filter(p => p.category === catName).length;
  const unreadCount = inquiries.filter(i => !i.read).length;

  const getStatusStyle = (status) => {
    const s = statusOptions.find(opt => opt.value === status);
    return s || { color: "#6b7280", bg: "#f3f4f6", label: status || "New" };
  };

  const getPriorityStyle = (priority) => {
    const p = priorityOptions.find(opt => opt.value === priority);
    return p || { color: "#6b7280", bg: "#f3f4f6", label: "Normal" };
  };

  const navItems = [
    { id:"products", label:"Products", badge: products.length, icon: "📦" },
    { id:"add-product", label:"Add Product", badge: null, icon: "➕" },
    { id:"categories", label:"Categories", badge: categories.length, icon: "🏷️" },
    { id:"inquiries", label:"Inquiries", badge: unreadCount || null, badgeWarn: true, icon: "💬" },
    { id:"analytics", label:"Analytics", badge: null, icon: "📊" },
  ];

  const getPageTitle = () => {
    if (activeTab === "add-product") return editingProduct ? "✎ Edit Product" : "➕ Add New Product";
    return navItems.find(n => n.id === activeTab)?.label || "";
  };

  return (
    <div className="adm">
      {toast && (
        <div className={`adm-toast adm-toast--${toast.type}`}>
          <span className="adm-toast__icon">{toast.type === "success" ? "✓" : "✕"}</span>
          {toast.message}
        </div>
      )}

      {/* Sidebar */}
      <aside className={`adm-sidebar ${sidebarCollapsed ? "adm-sidebar--collapsed" : ""}`}>
        <div className="adm-sidebar__top">
          <div className="adm-brand">
            <div className="adm-brand__icon">
              <img src={logo} alt="Sri Srinivasa" className="adm-brand__logo" />
            </div>
            {!sidebarCollapsed && (
              <div className="adm-brand__text">
                <span className="adm-brand__name">Sri Srinivasa</span>
                <span className="adm-brand__sub">Admin Panel</span>
              </div>
            )}
          </div>
          <button className="adm-sidebar__toggle" onClick={() => setSidebarCollapsed(c => !c)}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              {sidebarCollapsed ? <path d="M9 18l6-6-6-6"/> : <path d="M15 18l-6-6 6-6"/>}
            </svg>
          </button>
        </div>

        <nav className="adm-sidebar__nav">
          {navItems.map(item => (
            <button key={item.id}
              className={`adm-nav-btn ${activeTab === item.id ? "adm-nav-btn--active" : ""}`}
              onClick={() => { setActiveTab(item.id); if (item.id !== "add-product") setEditingProduct(null); }}
              title={sidebarCollapsed ? item.label : ""}
            >
              <span className="adm-nav-btn__icon">{item.icon}</span>
              {!sidebarCollapsed && <span className="adm-nav-btn__label">{item.label}</span>}
              {!sidebarCollapsed && item.badge != null && (
                <span className={`adm-nav-btn__badge ${item.badgeWarn ? "adm-nav-btn__badge--warn" : ""}`}>{item.badge}</span>
              )}
              {sidebarCollapsed && item.badge != null && <span className="adm-nav-btn__dot" />}
            </button>
          ))}
        </nav>

        <div className="adm-sidebar__bottom">
          <button className="adm-logout-btn" onClick={logout}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4"/>
              <polyline points="16 17 21 12 16 7"/>
              <line x1="21" y1="12" x2="9" y2="12"/>
            </svg>
            {!sidebarCollapsed && <span>Logout</span>}
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="adm-main">
        <header className="adm-topbar">
          <div className="adm-topbar__left">
            <div className="adm-topbar__title">{getPageTitle()}</div>
            <div className="adm-topbar__breadcrumb">Dashboard / {getPageTitle()}</div>
          </div>
          <div className="adm-topbar__right">
            <div className="adm-search">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
              </svg>
              <input type="text" placeholder="Search products…" value={searchTerm} onChange={e => setSearchTerm(e.target.value)} />
            </div>
            <div className="adm-topbar__avatar">A</div>
          </div>
        </header>

        <div className="adm-body">
          {/* Stats Cards */}
          {["products", "analytics", "categories"].includes(activeTab) && (
            <div className="adm-stats">
              <div className="adm-stat"><div className="adm-stat__icon adm-stat__icon--teal">📦</div><div className="adm-stat__content"><div className="adm-stat__val">{products.length}</div><div className="adm-stat__label">Total Products</div></div></div>
              <div className="adm-stat"><div className="adm-stat__icon adm-stat__icon--gold">🏷️</div><div className="adm-stat__content"><div className="adm-stat__val">{categories.length}</div><div className="adm-stat__label">Categories</div></div></div>
              <div className="adm-stat"><div className="adm-stat__icon adm-stat__icon--navy">💬</div><div className="adm-stat__content"><div className="adm-stat__val">{inquiries.length}</div><div className="adm-stat__label">Inquiries</div></div></div>
              <div className="adm-stat"><div className="adm-stat__icon adm-stat__icon--rose">📋</div><div className="adm-stat__content"><div className="adm-stat__val">{unreadCount}</div><div className="adm-stat__label">Unread</div></div></div>
            </div>
          )}

          {/* Products Tab */}
          {activeTab === "products" && (
            <div className="adm-card">
              <div className="adm-card__header">
                <div><h2 className="adm-card__title">All Products</h2><p className="adm-card__sub">{filteredProducts.length} items in catalog</p></div>
                <button className="adm-btn adm-btn--primary" onClick={() => { setEditingProduct(null); setFormKey(k => k + 1); setActiveTab("add-product"); }}>➕ Add Product</button>
              </div>
              <div className="adm-table-wrap">
                <table className="adm-table">
                  <thead><tr><th>Image</th><th>Product Name</th><th>Category</th><th>Price</th><th>Actions</th></tr></thead>
                  <tbody>
                    {filteredProducts.map(item => (
                      <tr key={item._id}>
                        <td><div className="adm-product-img"><img src={item.image} alt={item.title} onError={e => { e.target.src = "https://placehold.co/52x52/e6faf7/0f766e?text=IMG"; }} /></div></td>
                        <td><span className="adm-product-name">{item.title}</span></td>
                        <td><span className="adm-cat-pill">{item.category}</span></td>
                        <td><span className="adm-price">{item.price}</span></td>
                        <td><div className="adm-actions"><button className="adm-icon-btn adm-icon-btn--edit" onClick={() => { setEditingProduct(item); setFormKey(k => k + 1); setActiveTab("add-product"); }}>✏️</button><button className="adm-icon-btn adm-icon-btn--del" onClick={() => deleteProduct(item._id)}>🗑️</button></div></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {filteredProducts.length === 0 && (<div className="adm-empty"><div className="adm-empty__icon">📦</div><p>{searchTerm ? `No products matching "${searchTerm}"` : "No products yet."}</p></div>)}
              </div>
            </div>
          )}

          {/* Add/Edit Form */}
          {activeTab === "add-product" && (
            <div className="adm-card">
              <div className="adm-card__header">
                <div><h2 className="adm-card__title">{editingProduct ? "Edit Product" : "Add New Product"}</h2><p className="adm-card__sub">{editingProduct ? `Editing: ${editingProduct.title}` : "Fill all required fields"}</p></div>
                <button className="adm-btn adm-btn--ghost" onClick={() => { setEditingProduct(null); setActiveTab("products"); }}>← Back</button>
              </div>
              {editingProduct?.image && (<div className="adm-edit-preview"><div className="adm-edit-preview__label">Current Image</div><img src={editingProduct.image} alt={editingProduct.title} className="adm-edit-preview__img" /></div>)}
              <form key={formKey} className="adm-form" onSubmit={editingProduct ? updateProduct : addProduct}>
                <div className="adm-form__grid">
                  <div className="adm-form__field"><label>Product Name <span className="adm-req">*</span></label><input type="text" name="title" defaultValue={editingProduct?.title || ""} required placeholder="e.g., Wooden ICU Bed" /></div>
                  <div className="adm-form__field"><label>Price <span className="adm-req">*</span></label><input type="text" name="price" defaultValue={editingProduct?.price || ""} required placeholder="e.g., ₹84,000" /></div>
                  <div className="adm-form__field"><label>Category <span className="adm-req">*</span></label>
                    <select name="category" defaultValue={editingProduct?.category || ""} required>
                      <option value="">Select Category</option>
                      {categories.map(cat => (
                        <option key={cat._id} value={cat.name}>{cat.name}</option>
                      ))}
                    </select>
                  </div>
                  <div className="adm-form__field"><label>Product Image{!editingProduct && <span className="adm-req"> *</span>}</label><input type="file" name="image" accept="image/*" className="adm-file-input" />{editingProduct && <p className="adm-form__hint">Leave empty to keep current image</p>}</div>
                </div>
                <div className="adm-form__field"><label>Description <span className="adm-req">*</span></label><textarea name="desc" rows={5} defaultValue={editingProduct?.desc || ""} required placeholder="Describe features, specifications, benefits…" /></div>
                <div className="adm-form__actions"><button type="submit" className="adm-btn adm-btn--primary adm-btn--lg" disabled={loading}>{loading ? <><span className="adm-spinner" /> {editingProduct ? "Updating…" : "Adding…"}</> : editingProduct ? "Update Product" : "Add Product"}</button><button type="button" className="adm-btn adm-btn--ghost" onClick={() => { setEditingProduct(null); setActiveTab("products"); }}>Cancel</button></div>
              </form>
            </div>
          )}

          {/* Categories Tab */}
          {activeTab === "categories" && (
            <div className="adm-card">
              <div className="adm-card__header">
                <div>
                  <h2 className="adm-card__title">Manage Categories</h2>
                  <p className="adm-card__sub">{categories.length} total categories</p>
                </div>
              </div>
              
              <div className="category-add-section">
                <div className="category-add-form">
                  <input 
                    type="text" 
                    value={newCategory} 
                    onChange={(e) => setNewCategory(e.target.value)} 
                    placeholder="Enter new category name..."
                    className="category-input"
                    onKeyPress={(e) => e.key === 'Enter' && addCategory()}
                  />
                  <button onClick={addCategory} className="adm-btn adm-btn--primary">
                    ➕ Add Category
                  </button>
                </div>
              </div>

              <div className="categories-list">
                {categories.length === 0 ? (
                  <div className="adm-empty">
                    <div className="adm-empty__icon">🏷️</div>
                    <p>No categories yet. Add your first category above.</p>
                  </div>
                ) : (
                  categories.map((cat, i) => {
                    const count = getCategoryCount(cat.name);
                    return (
                      <div key={cat._id} className="category-item">
                        <div className="category-info">
                          <div className="category-number">{String(i + 1).padStart(2, "0")}</div>
                          <div className="category-details">
                            <strong className="category-name">{cat.name}</strong>
                            <span className="category-count">{count} {count === 1 ? "product" : "products"}</span>
                          </div>
                          <span className={`category-status ${count > 0 ? "active" : "empty"}`}>
                            {count > 0 ? "Active" : "Empty"}
                          </span>
                        </div>
                        <button 
                          onClick={() => deleteCategory(cat._id)} 
                          className="adm-icon-btn adm-icon-btn--del"
                          title="Delete Category"
                        >
                          🗑️
                        </button>
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          )}

          {/* 🔥 UPDATED: Inquiries Tab with Lead Type Filter */}
          {activeTab === "inquiries" && (
            <div className="adm-card">
              <div className="adm-card__header">
                <div><h2 className="adm-card__title">Customer Inquiries</h2><p className="adm-card__sub">{unreadCount} unread · {inquiries.length} total</p></div>
                <div className="inquiry-actions-header">
                  <button className="adm-btn adm-btn--sm adm-btn--primary" onClick={exportToCSV}>
                    📊 Export to CSV
                  </button>
                </div>
              </div>

              {/* 🔥 NEW: Lead Type Filter Dropdown */}
              <div className="inquiry-filters">
                <div className="filter-group">
                  <select value={leadType} onChange={e => { setLeadType(e.target.value); setCurrentPage(1); }} className="filter-select">
                    <option value="all">📋 All Leads</option>
                    <option value="product">📦 Product Leads</option>
                    <option value="general">💬 General Leads</option>
                  </select>
                </div>
                <div className="filter-group">
                  <input type="text" placeholder="🔍 Search by name, phone, email, product..." value={inquirySearch} onChange={e => { setInquirySearch(e.target.value); setCurrentPage(1); }} className="filter-search" />
                </div>
                <div className="filter-group">
                  <select value={inquiryFilter} onChange={e => { setInquiryFilter(e.target.value); setCurrentPage(1); }} className="filter-select">
                    <option value="all">📋 All Inquiries</option>
                    <option value="unread">🆕 Unread Only</option>
                    <option value="today">📅 Today</option>
                    <option value="week">📆 This Week</option>
                    <option value="closed">✅ Closed</option>
                    <option value="hot">🔥 Hot Leads</option>
                  </select>
                </div>
                <div className="filter-group">
                  <select value={statusFilter} onChange={e => { setStatusFilter(e.target.value); setCurrentPage(1); }} className="filter-select">
                    <option value="all">🏷️ All Status</option>
                    {statusOptions.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
                  </select>
                </div>
                <div className="filter-group">
                  <select value={priorityFilter} onChange={e => { setPriorityFilter(e.target.value); setCurrentPage(1); }} className="filter-select">
                    <option value="all">⭐ All Priorities</option>
                    {priorityOptions.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
                  </select>
                </div>
              </div>

              <div className="inquiries-list">
                {paginatedInquiries.length === 0 ? (
                  <div className="adm-empty"><div className="adm-empty__icon">💬</div><p>No inquiries found matching your filters.</p></div>
                ) : (
                  paginatedInquiries.map(inq => {
                    const statusStyle = getStatusStyle(inq.status);
                    const priorityStyle = getPriorityStyle(inq.priority);
                    const phoneClean = inq.phone?.replace(/\D/g, '');
                    const whatsappUrl = `https://wa.me/91${phoneClean}?text=${getWhatsAppMessage(inq)}`;
                    const emailUrl = `mailto:${inq.email}?subject=${getEmailSubject(inq)}&body=${getEmailBody(inq)}`;
                    
                    return (
                      <div key={inq._id} className={`adm-inq ${!inq.read ? "adm-inq--unread" : ""}`}>
                        <div className="adm-inq__header">
                          <div className="adm-inq__avatar">{inq.name?.[0]?.toUpperCase() || "?"}</div>
                          <div className="adm-inq__meta">
                            <strong>{inq.name}</strong>
                            <span>{inq.email || "No email"} {inq.phone && `· ${inq.phone}`}</span>
                            {inq.productName && <span className="inq-product-tag">📦 {inq.productName}</span>}
                          </div>
                          <div className="adm-inq__right">
                            <div className="inq-badges">
                              {/* 🔥 NEW: Lead Type Badge */}
                              <span className={`lead-type-badge ${inq.type === "product" ? "badge-product" : "badge-general"}`}>
                                {inq.type === "product" ? "📦 Product Lead" : "💬 General Lead"}
                              </span>
                              <select className="status-select" value={inq.status || "new"} style={{ background: statusStyle.bg, color: statusStyle.color }} onChange={(e) => updateInquiryStatus(inq._id, e.target.value)}>
                                {statusOptions.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
                              </select>
                              <select className="priority-select" value={inq.priority || "normal"} style={{ background: priorityStyle.bg, color: priorityStyle.color }} onChange={(e) => updateInquiryPriority(inq._id, e.target.value)}>
                                {priorityOptions.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
                              </select>
                            </div>
                            <span className="adm-inq__date">{inq.createdAt ? new Date(inq.createdAt).toLocaleString() : "—"}</span>
                          </div>
                        </div>
                        <div className="adm-inq__msg">{inq.message}</div>
                        
                        {/* Notes Section */}
                        {inq.notes && inq.notes.length > 0 && (
                          <div className="inq-notes">
                            <div className="inq-notes__title">📝 Notes</div>
                            {inq.notes.map((note, idx) => (
                              <div key={idx} className="inq-note">
                                <span className="inq-note__date">{new Date(note.createdAt).toLocaleString()}</span>
                                <p>{note.note}</p>
                              </div>
                            ))}
                          </div>
                        )}
                        
                        <div className="adm-inq__actions">
                          {!inq.read && <button className="adm-btn adm-btn--sm adm-btn--primary" onClick={() => markAsRead(inq._id)}>✓ Mark as Read</button>}
                          <a href={whatsappUrl} target="_blank" rel="noreferrer" className="adm-btn adm-btn--sm btn-wa">💬 WhatsApp</a>
                          <a href={`tel:${inq.phone}`} className="adm-btn adm-btn--sm btn-call">📞 Call</a>
                          <button className="adm-btn adm-btn--sm btn-note" onClick={() => { setSelectedInquiry(inq); setShowNotesModal(true); }}>📝 Add Note</button>
                          <a href={emailUrl} className="adm-btn adm-btn--sm btn-email">📧 Send Email</a>
                          <button className="adm-icon-btn adm-icon-btn--del" onClick={() => deleteInquiry(inq._id)}>🗑️</button>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="pagination-wrapper">
                  <button className="page-btn" onClick={() => setCurrentPage(p => Math.max(1, p - 1))} disabled={currentPage === 1}>← Previous</button>
                  <span className="page-info">Page {currentPage} of {totalPages}</span>
                  <button className="page-btn" onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages}>Next →</button>
                </div>
              )}
            </div>
          )}

          {/* Analytics Tab */}
          {activeTab === "analytics" && (
            <div className="adm-analytics">
              <div className="adm-chart-card"><h3>📊 Products by Category</h3><div className="adm-chart">{categories.filter(c => getCategoryCount(c.name) > 0).length === 0 && <p style={{ color: "var(--text-muted)", padding: "20px 0" }}>No product data yet.</p>}{categories.filter(c => getCategoryCount(c.name) > 0).map((cat, i) => { const count = getCategoryCount(cat.name); const max = Math.max(...categories.map(c => getCategoryCount(c.name)), 1); return (<div key={i} className="adm-chart__row"><div className="adm-chart__label">{cat.name}</div><div className="adm-chart__bar-bg"><div className="adm-chart__bar" style={{ width: `${(count / max) * 100}%` }} /></div><div className="adm-chart__val">{count}</div></div>); })}</div></div>
              <div className="adm-chart-card"><h3>📈 Summary</h3><div className="adm-activity"><div className="adm-activity__item"><div className="adm-activity__dot" /><div><p>Total products</p><span>{products.length} products</span></div></div><div className="adm-activity__item"><div className="adm-activity__dot" /><div><p>Active categories</p><span>{categories.filter(c => getCategoryCount(c.name) > 0).length} of {categories.length}</span></div></div><div className="adm-activity__item"><div className="adm-activity__dot" /><div><p>Customer inquiries</p><span>{inquiries.length} total</span></div></div><div className="adm-activity__item"><div className="adm-activity__dot" /><div><p>Unread inquiries</p><span>{unreadCount} pending</span></div></div></div></div>
            </div>
          )}

          {/* Settings Tab */}
          {activeTab === "settings" && (
            <div className="adm-card">
              <div className="adm-card__header"><div><h2 className="adm-card__title">⚙️ Settings</h2><p className="adm-card__sub">Manage admin profile and preferences</p></div></div>
              <form className="adm-form" onSubmit={e => { e.preventDefault(); showToast("Settings saved!"); }}>
                <div className="adm-form__section"><h4 className="adm-form__section-title">Profile Information</h4><div className="adm-form__grid"><div className="adm-form__field"><label>Full Name</label><input type="text" defaultValue="Administrator" /></div><div className="adm-form__field"><label>Email Address</label><input type="email" defaultValue="admin@srisrinivasa.com" /></div></div></div>
                <div className="adm-form__section"><h4 className="adm-form__section-title">Change Password</h4><div className="adm-form__grid"><div className="adm-form__field"><label>Current Password</label><input type="password" placeholder="••••••••" /></div><div className="adm-form__field"><label>New Password</label><input type="password" placeholder="••••••••" /></div><div className="adm-form__field"><label>Confirm Password</label><input type="password" placeholder="••••••••" /></div></div></div>
                <div className="adm-form__actions"><button type="submit" className="adm-btn adm-btn--primary adm-btn--lg">Save Changes</button><button type="button" className="adm-btn adm-btn--ghost">Cancel</button></div>
              </form>
            </div>
          )}
        </div>
      </main>

      {/* Notes Modal */}
      {showNotesModal && selectedInquiry && (
        <div className="modal-overlay" onClick={() => { setShowNotesModal(false); setNoteText(""); }}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>📝 Add Note for {selectedInquiry.name}</h3>
              <button className="modal-close" onClick={() => { setShowNotesModal(false); setNoteText(""); }}>✕</button>
            </div>
            <div className="modal-body">
              <textarea rows="4" placeholder="Enter your note here..." value={noteText} onChange={(e) => setNoteText(e.target.value)} className="note-textarea"></textarea>
              <div className="modal-actions">
                <button className="adm-btn adm-btn--primary" onClick={() => { addNote(); setShowNotesModal(false); }}>Add Note</button>
                <button className="adm-btn adm-btn--ghost" onClick={() => { setShowNotesModal(false); setNoteText(""); }}>Cancel</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}