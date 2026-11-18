import { useNavigate } from "react-router-dom";
import { useEffect, useState, useCallback } from "react";
import "./AdminDashboard.css";
import logo from "../assets/logo.png";

const API = window.location.origin;

export default function AdminDashboard() {
  const navigate = useNavigate();

  const [products, setProducts] = useState([]);
  const [inquiries, setInquiries] = useState([]);
  const [categories, setCategories] = useState([]);
  const [newCategory, setNewCategory] = useState("");
  const [activeTab, setActiveTab] = useState("products");
  const [editingProduct, setEditingProduct] = useState(null);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [toast, setToast] = useState(null);
  const [loading, setLoading] = useState(false);
  const [formKey, setFormKey] = useState(0);

  // Specifications state for Add/Edit product
  const [specs, setSpecs] = useState([]);
  const [newSpecKey, setNewSpecKey] = useState("");
  const [newSpecVal, setNewSpecVal] = useState("");

  // Additional gallery images to remove when editing
  const [removedImages, setRemovedImages] = useState([]);

  // Controlled visibility state for Add/Edit product
  const [productIsActive, setProductIsActive] = useState(true);

  // New gallery files and previews for Add/Edit product
  const [newGalleryFiles, setNewGalleryFiles] = useState([]);
  const [newGalleryPreviews, setNewGalleryPreviews] = useState([]);

  // Category Edit state
  const [editingCategory, setEditingCategory] = useState(null);
  const [editCategoryName, setEditCategoryName] = useState("");

  // Hero Banner state
  const [homepageSettings, setHomepageSettings] = useState({
    heroBannerImage: ""
  });
  const [bannerPreview, setBannerPreview] = useState(null);
  const [savingSettings, setSavingSettings] = useState(false);
  
  // Category expand/collapse state
  const [expandedCategories, setExpandedCategories] = useState({});
  
  // Filter states for inquiries
  const [inquiryFilter, setInquiryFilter] = useState("all");
  const [inquirySearch, setInquirySearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [priorityFilter, setPriorityFilter] = useState("all");
  const [leadType, setLeadType] = useState("all");
  
  // Notes modal state
  const [showNotesModal, setShowNotesModal] = useState(false);
  const [noteText, setNoteText] = useState("");
  const [selectedInquiry, setSelectedInquiry] = useState(null);

  // Send Email modal state (Admin outbound email via SMTP)
  const [sendEmailModal, setSendEmailModal] = useState({
    isOpen: false,
    to: "",
    subject: "",
    message: "",
    inquiryId: null,
    isSending: false,
    error: ""
  });

  // Delete confirmation modal state
  const [deleteConfirmModal, setDeleteConfirmModal] = useState({
    isOpen: false,
    type: null,
    id: null,
    title: "",
    message: "",
    name: "",
    confirmText: "",
    isDeleting: false
  });
  
  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Check if mobile view
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
      if (window.innerWidth > 768) {
        setMobileSidebarOpen(false);
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Close sidebar when clicking outside on mobile
  useEffect(() => {
    if (mobileSidebarOpen && isMobile) {
      const handleClickOutside = (e) => {
        if (!e.target.closest('.adm-sidebar') && !e.target.closest('.adm-mobile-menu-btn')) {
          setMobileSidebarOpen(false);
        }
      };
      document.addEventListener('click', handleClickOutside);
      return () => document.removeEventListener('click', handleClickOutside);
    }
  }, [mobileSidebarOpen, isMobile]);

  const toggleMobileSidebar = () => {
    setMobileSidebarOpen(!mobileSidebarOpen);
  };

  // Keyboard navigation: Close modals on ESC
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        if (deleteConfirmModal.isOpen && !deleteConfirmModal.isDeleting) {
          setDeleteConfirmModal(prev => ({ ...prev, isOpen: false }));
        }
        if (showNotesModal) {
          setShowNotesModal(false);
          setNoteText("");
        }
        if (sendEmailModal.isOpen && !sendEmailModal.isSending) {
          setSendEmailModal(prev => ({ ...prev, isOpen: false }));
        }
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [deleteConfirmModal.isOpen, deleteConfirmModal.isDeleting, showNotesModal, sendEmailModal.isOpen, sendEmailModal.isSending]);

  // Status options
  const statusOptions = [
    { value: "new", label: "New", color: "#ef4444", bg: "#fee2e2" },
    { value: "contacted", label: "Contacted", color: "#f59e0b", bg: "#fef3c7" },
    { value: "quotation", label: "Quotation Sent", color: "#3b82f6", bg: "#dbeafe" },
    { value: "negotiation", label: "Negotiation", color: "#8b5cf6", bg: "#ede9fe" },
    { value: "closed", label: "Closed", color: "#10b981", bg: "#d1fae5" },
    { value: "rejected", label: "Rejected", color: "#6b7280", bg: "#f3f4f6" }
  ];

  // Priority options
  const priorityOptions = [
    { value: "normal", label: "Normal", color: "#6b7280", bg: "#f3f4f6" },
    { value: "hot", label: "Hot Lead", color: "#ef4444", bg: "#fee2e2" },
    { value: "bulk", label: "Bulk Order", color: "#8b5cf6", bg: "#ede9fe" },
    { value: "dealer", label: "Dealer", color: "#f59e0b", bg: "#fef3c7" },
    { value: "urgent", label: "Urgent", color: "#dc2626", bg: "#fee2e2" },
    { value: "hospital", label: "Hospital", color: "#10b981", bg: "#d1fae5" }
  ];

  const authFetch = async (url, options = {}) => {
    const token = localStorage.getItem('adminToken');
    const headers = { ...options.headers };
    if (token) headers['Authorization'] = `Bearer ${token}`;
    
    // Auto-inject /v1/ if not present
    const v1Url = url.includes('/api/v1/') ? url : url.replace('/api/', '/api/v1/');
    
    const res = await fetch(v1Url, { ...options, headers });
    
    if (res.status === 401) {
      localStorage.removeItem('adminToken');
      window.location.href = '/admin/login';
      throw new Error('Unauthorized');
    }
    return res;
  };

  const showToast = (message, type = "success") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3500);
  };

  const safeJson = async (res) => {
    const json = await res.json();
    return json.success && json.data ? json.data : json;
  };

  const fetchProducts = useCallback(async () => {
    try {
      const res = await authFetch(`${API}/api/products?includeInactive=true`);
      const data = await safeJson(res);
      setProducts(Array.isArray(data) ? data : data.products ?? []);
    } catch (err) { console.error("fetchProducts:", err); }
  }, []);

  const fetchCategories = useCallback(async () => {
    try {
      const res = await authFetch(`${API}/api/categories`);
      const data = await safeJson(res);
      setCategories(Array.isArray(data) ? data : data.categories ?? []);
    } catch (err) { console.error("fetchCategories:", err); }
  }, []);

  const fetchInquiries = useCallback(async () => {
    try {
      const res = await authFetch(`${API}/api/inquiries`);
      const data = await safeJson(res);
      setInquiries(Array.isArray(data) ? data : data.inquiries ?? []);
    } catch (err) { console.warn("fetchInquiries:", err.message); }
  }, []);

  const toggleCategory = (categoryId) => {
    setExpandedCategories(prev => ({
      ...prev,
      [categoryId]: !prev[categoryId]
    }));
  };

  const getProductsByCategory = (categoryName) => {
    return products.filter(product => product.category === categoryName);
  };

  const getWhatsAppMessage = (inq) => {
    const msg = 
`Sri Srinivasa Clean Rooms

Call/WhatsApp: +91 94406 43193
Email: chakri.9441@gmail.com

────────────────────────────

NEW INQUIRY RECEIVED

Name: ${inq.name}
Phone: ${inq.phone}
Email: ${inq.email || "Not provided"}
Product: ${inq.productName || "Not specified"}
Message: ${inq.message || "No message"}
Date: ${new Date(inq.createdAt).toLocaleString()}
Status: New
Priority: Normal

────────────────────────────

Premium Medical Furniture Manufacturer
Trusted by 50+ Hospitals Across India
ISO Certified Quality

Address: Subhash Nagar, Malkajgiri, Telangana – 500055

Response: Within 24 hours

Thank you for choosing Sri Srinivasa Clean Rooms`;
    
    return encodeURIComponent(msg);
  };

  const addCategory = async () => {
    if (!newCategory.trim()) {
      showToast("Please enter a category name", "error");
      return;
    }

    try {
      const res = await authFetch(`${API}/api/categories`, {
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
    } catch {
      showToast("Server error", "error");
    }
  };

  const deleteCategory = (id) => {
    const cat = categories.find(c => c._id === id);
    openDeleteCategoryModal(cat || { _id: id, name: "Category" });
  };

  const fetchHomepageSettings = useCallback(async () => {
    try {
      const res = await fetch(`${API}/api/v1/settings/homepage?t=${Date.now()}`);
      const data = await res.json();
      if (data.success && data.data) {
        setHomepageSettings(data.data);
      }
    } catch (err) {
      console.error("fetchHomepageSettings:", err);
    }
  }, []);

  useEffect(() => {
    const token = localStorage.getItem("adminToken");
    if (!token) {
      navigate("/admin/login", { replace: true });
      return;
    }
    fetchProducts();
    fetchInquiries();
    fetchCategories();
    fetchHomepageSettings();
  }, [navigate, fetchProducts, fetchInquiries, fetchCategories, fetchHomepageSettings]);

  // Sync specs, visibility, and gallery images when editing product or resetting form
  useEffect(() => {
    if (editingProduct) {
      setSpecs(Array.isArray(editingProduct.specifications) ? [...editingProduct.specifications] : []);
      setProductIsActive(editingProduct.isActive !== false);
      setRemovedImages([]);
    } else {
      setSpecs([]);
      setProductIsActive(true);
      setRemovedImages([]);
    }
    // Clean up previous temporary object URLs
    setNewGalleryPreviews(prev => {
      prev.forEach(p => URL.revokeObjectURL(p.url));
      return [];
    });
    setNewGalleryFiles([]);
    setNewSpecKey("");
    setNewSpecVal("");
  }, [editingProduct, formKey]);

  const startEditingProduct = async (item) => {
    setEditingProduct(item);
    setProductIsActive(item.isActive !== false);
    setSpecs(Array.isArray(item.specifications) ? [...item.specifications] : []);
    setRemovedImages([]);
    setNewGalleryFiles([]);
    setNewGalleryPreviews(prev => {
      prev.forEach(p => URL.revokeObjectURL(p.url));
      return [];
    });
    setFormKey(k => k + 1);
    setActiveTab("add-product");

    try {
      const res = await authFetch(`${API}/api/products/${item._id}`);
      const fresh = await safeJson(res);
      if (fresh && fresh._id) {
        setEditingProduct(fresh);
        setProductIsActive(fresh.isActive !== false);
        if (Array.isArray(fresh.specifications)) {
          setSpecs([...fresh.specifications]);
        }
      }
    } catch (err) {
      console.warn("Could not fetch fresh product details:", err);
    }
  };

  const handleAddSpec = () => {
    if (!newSpecKey.trim() || !newSpecVal.trim()) return;
    setSpecs(prev => [...prev, { key: newSpecKey.trim(), value: newSpecVal.trim() }]);
    setNewSpecKey("");
    setNewSpecVal("");
  };

  const handleRemoveSpec = (index) => {
    setSpecs(prev => prev.filter((_, i) => i !== index));
  };

  const handleToggleRemoveImage = (imgUrl) => {
    setRemovedImages(prev =>
      prev.includes(imgUrl) ? prev.filter(u => u !== imgUrl) : [...prev, imgUrl]
    );
  };

  const handlePrimaryImageChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const allowed = ["image/jpeg", "image/png", "image/webp"];
      if (!allowed.includes(file.type)) {
        showToast("Primary image must be JPEG, PNG, or WEBP", "error");
        e.target.value = "";
        return;
      }
      if (file.size > 5 * 1024 * 1024) {
        showToast("Primary image must be 5MB or smaller", "error");
        e.target.value = "";
        return;
      }
    }
  };

  const handleGalleryFilesChange = (e) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    const allowedTypes = ["image/jpeg", "image/png", "image/webp"];
    const validFiles = [];

    // Calculate existing retained images
    const currentRetainedCount = (editingProduct?.images?.length || 0) - removedImages.length;
    const currentNewCount = newGalleryFiles.length;
    const availableSlots = 5 - (currentRetainedCount + currentNewCount);

    if (availableSlots <= 0) {
      showToast("Maximum 5 additional gallery images reached. Remove some to add more.", "error");
      e.target.value = "";
      return;
    }

    for (const file of files) {
      if (!allowedTypes.includes(file.type)) {
        showToast(`${file.name} is not a valid format. Only JPEG, PNG and WEBP are supported.`, "error");
        continue;
      }
      if (file.size > 5 * 1024 * 1024) {
        showToast(`${file.name} exceeds 5MB limit. Please upload images under 5MB.`, "error");
        continue;
      }
      validFiles.push(file);
    }

    if (validFiles.length > availableSlots) {
      showToast(`Only ${availableSlots} more image(s) can be added (Maximum 5 total).`, "error");
      validFiles.splice(availableSlots);
    }

    if (validFiles.length > 0) {
      const newPreviews = validFiles.map(file => ({
        id: Math.random().toString(36).slice(2),
        file,
        url: URL.createObjectURL(file),
        name: file.name
      }));
      setNewGalleryFiles(prev => [...prev, ...validFiles]);
      setNewGalleryPreviews(prev => [...prev, ...newPreviews]);
    }

    e.target.value = "";
  };

  const handleRemoveNewGalleryFile = (indexToRemove) => {
    const previewToRemove = newGalleryPreviews[indexToRemove];
    if (previewToRemove) {
      URL.revokeObjectURL(previewToRemove.url);
    }
    setNewGalleryFiles(prev => prev.filter((_, i) => i !== indexToRemove));
    setNewGalleryPreviews(prev => prev.filter((_, i) => i !== indexToRemove));
  };

  const toggleProductStatus = async (id, currentStatus) => {
    try {
      const res = await authFetch(`${API}/api/products/${id}/status`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isActive: !currentStatus })
      });
      const data = await safeJson(res);
      if (res.ok || data.success) {
        showToast(`Product ${!currentStatus ? "activated" : "hidden"} successfully`);
        setProducts(prev => prev.map(p => p._id === id ? { ...p, isActive: !currentStatus } : p));
      } else {
        showToast(data.message || "Failed to update product status", "error");
      }
    } catch (err) {
      showToast(err.message || "Server error updating status", "error");
    }
  };

  const handleUpdateCategory = async (e) => {
    e.preventDefault();
    if (!editingCategory || !editCategoryName.trim()) return;
    try {
      const res = await authFetch(`${API}/api/categories/${editingCategory._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: editCategoryName.trim() })
      });
      const data = await res.json();
      if (data.success) {
        showToast("Category renamed successfully!");
        setEditingCategory(null);
        setEditCategoryName("");
        await fetchCategories();
        await fetchProducts();
      } else {
        showToast(data.message || "Failed to rename category", "error");
      }
    } catch {
      showToast("Server error renaming category", "error");
    }
  };

  const handleBannerFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        showToast("Banner image must be 5MB or smaller", "error");
        e.target.value = "";
        setBannerPreview(null);
        return;
      }
      const allowed = ["image/jpeg", "image/png", "image/webp"];
      if (!allowed.includes(file.type)) {
        showToast("Only JPEG, PNG and WEBP image formats are supported", "error");
        e.target.value = "";
        setBannerPreview(null);
        return;
      }
      const url = URL.createObjectURL(file);
      setBannerPreview(url);
      setHomepageSettings(prev => ({ ...prev, removeBanner: false }));
    } else {
      setBannerPreview(null);
    }
  };

  const handleSaveSiteSettings = async (e) => {
    e.preventDefault();
    setSavingSettings(true);
    const form = e.target;
    const fd = new FormData();

    const fileSelected = form.bannerImage && form.bannerImage.files && form.bannerImage.files[0];
    const isRemoving = homepageSettings.removeBanner;

    if (!fileSelected && !isRemoving) {
      showToast("No new banner selected to upload.", "info");
      setSavingSettings(false);
      return;
    }

    if (fileSelected) {
      const file = form.bannerImage.files[0];
      if (file.size > 5 * 1024 * 1024) {
        showToast("Banner image must be 5MB or smaller", "error");
        setSavingSettings(false);
        return;
      }
      const allowed = ["image/jpeg", "image/png", "image/webp"];
      if (!allowed.includes(file.type)) {
        showToast("Only JPEG, PNG and WEBP image formats are supported", "error");
        setSavingSettings(false);
        return;
      }
      fd.append("image", file);
    } else if (isRemoving) {
      fd.append("removeBanner", "true");
    }

    try {
      const res = await authFetch(`${API}/api/settings/homepage`, {
        method: "PUT",
        body: fd
      });
      const data = await res.json();
      if (data.success && data.data) {
        showToast("Hero banner updated successfully!");
        setHomepageSettings(data.data);
        setBannerPreview(null);
        if (form.bannerImage) form.bannerImage.value = "";
      } else {
        showToast(data.message || "Failed to update banner", "error");
      }
    } catch {
      showToast("Server error saving banner", "error");
    } finally {
      setSavingSettings(false);
    }
  };

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

  const updateInquiryStatus = async (id, status) => {
    try {
      const res = await authFetch(`${API}/api/inquiries/${id}/status`, {
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

  const updateInquiryPriority = async (id, priority) => {
    try {
      const res = await authFetch(`${API}/api/inquiries/${id}/priority`, {
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

  const addNote = async () => {
    if (!noteText.trim()) return;
    try {
      const res = await authFetch(`${API}/api/inquiries/${selectedInquiry._id}/notes`, {
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
      showToast("Please select a primary product image", "error");
      setLoading(false);
      return;
    }

    const fd = new FormData();
    fd.append("title", form.title.value.trim());
    fd.append("price", form.price.value.trim());
    fd.append("category", form.category.value);
    fd.append("desc", form.desc.value.trim());
    fd.append("order", form.order.value || "0");
    fd.append("isActive", productIsActive ? "true" : "false");
    fd.append("specifications", JSON.stringify(specs.filter(s => s.key && s.value)));
    fd.append("image", form.image.files[0]);

    if (newGalleryFiles && newGalleryFiles.length > 0) {
      for (let i = 0; i < newGalleryFiles.length; i++) {
        fd.append("additionalImages", newGalleryFiles[i]);
      }
    } else if (form.additionalImages && form.additionalImages.files) {
      for (let i = 0; i < form.additionalImages.files.length; i++) {
        fd.append("additionalImages", form.additionalImages.files[i]);
      }
    }

    try {
      const res = await authFetch(`${API}/api/products`, { method: "POST", body: fd });
      const data = await safeJson(res);

      if (res.ok || data.success) {
        showToast("Product added successfully!");
        form.reset();
        setSpecs([]);
        newGalleryPreviews.forEach(p => URL.revokeObjectURL(p.url));
        setNewGalleryFiles([]);
        setNewGalleryPreviews([]);
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
    fd.append("order", form.order.value || "0");
    fd.append("isActive", productIsActive ? "true" : "false");
    fd.append("specifications", JSON.stringify(specs.filter(s => s.key && s.value)));

    if (removedImages.length > 0) {
      fd.append("removedImages", JSON.stringify(removedImages));
    }

    if (form.image.files && form.image.files[0]) {
      fd.append("image", form.image.files[0]);
    }

    if (newGalleryFiles && newGalleryFiles.length > 0) {
      for (let i = 0; i < newGalleryFiles.length; i++) {
        fd.append("additionalImages", newGalleryFiles[i]);
      }
    } else if (form.additionalImages && form.additionalImages.files) {
      for (let i = 0; i < form.additionalImages.files.length; i++) {
        fd.append("additionalImages", form.additionalImages.files[i]);
      }
    }

    try {
      const res = await authFetch(`${API}/api/products/${editingProduct._id}`, { method: "PUT", body: fd });
      const data = await safeJson(res);

      if (res.ok || data.success) {
        showToast("Product updated successfully!");
        setEditingProduct(null);
        setSpecs([]);
        setRemovedImages([]);
        newGalleryPreviews.forEach(p => URL.revokeObjectURL(p.url));
        setNewGalleryFiles([]);
        setNewGalleryPreviews([]);
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

  const openDeleteInquiryModal = (inq) => {
    setDeleteConfirmModal({
      isOpen: true,
      type: "inquiry",
      id: inq._id,
      title: "Delete Inquiry?",
      message: "Are you sure you want to delete the inquiry from:",
      name: inq.name || "Customer",
      confirmText: "Delete Inquiry",
      isDeleting: false
    });
  };

  const openDeleteProductModal = (prod) => {
    setDeleteConfirmModal({
      isOpen: true,
      type: "product",
      id: prod._id,
      title: "Delete Product?",
      message: "Are you sure you want to delete the product:",
      name: prod.title || "Product",
      confirmText: "Delete Product",
      isDeleting: false
    });
  };

  const openDeleteCategoryModal = (cat) => {
    setDeleteConfirmModal({
      isOpen: true,
      type: "category",
      id: cat._id,
      title: "Delete Category?",
      message: "Are you sure you want to delete this category? Products in this category may be affected:",
      name: cat.name || "Category",
      confirmText: "Delete Category",
      isDeleting: false
    });
  };

  const handleConfirmDelete = async () => {
    if (deleteConfirmModal.isDeleting) return;
    setDeleteConfirmModal(prev => ({ ...prev, isDeleting: true }));

    const { type, id } = deleteConfirmModal;

    if (type === "inquiry") {
      try {
        const res = await authFetch(`${API}/api/inquiries/${id}`, { method: "DELETE" });
        const data = await res.json().catch(() => ({}));
        if (res.ok) {
          setInquiries(prev => prev.filter(i => i._id !== id));
          showToast("Inquiry deleted successfully");
          setDeleteConfirmModal({ isOpen: false, type: null, id: null, isDeleting: false });
        } else {
          showToast(data.message || data.error || "Failed to delete inquiry", "error");
          setDeleteConfirmModal(prev => ({ ...prev, isDeleting: false }));
        }
      } catch (err) {
        showToast(err.message || "Failed to delete inquiry", "error");
        setDeleteConfirmModal(prev => ({ ...prev, isDeleting: false }));
      }
    } else if (type === "product") {
      try {
        const res = await authFetch(`${API}/api/products/${id}`, { method: "DELETE" });
        const data = await res.json().catch(() => ({}));
        if (res.ok) {
          setProducts(prev => prev.filter(p => p._id !== id));
          showToast("Product deleted successfully");
          setDeleteConfirmModal({ isOpen: false, type: null, id: null, isDeleting: false });
        } else {
          showToast(data.message || data.error || "Failed to delete product", "error");
          setDeleteConfirmModal(prev => ({ ...prev, isDeleting: false }));
          fetchProducts();
        }
      } catch (err) {
        showToast(err.message || "Failed to delete product", "error");
        setDeleteConfirmModal(prev => ({ ...prev, isDeleting: false }));
        fetchProducts();
      }
    } else if (type === "category") {
      try {
        const res = await authFetch(`${API}/api/categories/${id}`, { method: "DELETE" });
        const data = await res.json().catch(() => ({}));
        if (res.ok) {
          await fetchCategories();
          await fetchProducts();
          showToast("Category deleted successfully");
          setDeleteConfirmModal({ isOpen: false, type: null, id: null, isDeleting: false });
        } else {
          showToast(data.message || data.error || "Failed to delete category", "error");
          setDeleteConfirmModal(prev => ({ ...prev, isDeleting: false }));
        }
      } catch (err) {
        showToast(err.message || "Failed to delete category", "error");
        setDeleteConfirmModal(prev => ({ ...prev, isDeleting: false }));
      }
    }
  };

  const deleteProduct = (id) => {
    const prod = products.find(p => p._id === id);
    openDeleteProductModal(prod || { _id: id, title: "Product" });
  };

  const markAsRead = async (id) => {
    setInquiries(prev => prev.map(i => i._id === id ? { ...i, read: true } : i));
    try { await authFetch(`${API}/api/inquiries/${id}/read`, { method: "PUT" }); } 
    catch (err) { console.error(err); }
  };

  const deleteInquiry = (id) => {
    const inq = inquiries.find(i => i._id === id);
    openDeleteInquiryModal(inq || { _id: id, name: "Customer" });
  };

  const handleOpenSendEmail = (inq) => {
    const defaultSubject = inq.productName
      ? `Regarding your inquiry for ${inq.productName} - Sri Srinivasa Clean Rooms`
      : `Regarding your inquiry - Sri Srinivasa Clean Rooms`;
    
    const defaultBody = `Dear ${inq.name},\n\nThank you for reaching out to Sri Srinivasa Clean Rooms.\n\nRegarding your inquiry:\n"${inq.message || ''}"\n\n\n\nWarm regards,\nSri Srinivasa Clean Rooms Team\nPhone: +91 94406 43193\nEmail: chakri.9441@gmail.com`;

    setSendEmailModal({
      isOpen: true,
      to: inq.email || "",
      subject: defaultSubject,
      message: defaultBody,
      inquiryId: inq._id,
      isSending: false,
      error: ""
    });
  };

  const handleSendEmailSubmit = async (e) => {
    e.preventDefault();
    if (!sendEmailModal.to || !sendEmailModal.to.trim()) {
      setSendEmailModal(prev => ({ ...prev, error: "Recipient email is required." }));
      return;
    }
    if (!sendEmailModal.subject || !sendEmailModal.subject.trim()) {
      setSendEmailModal(prev => ({ ...prev, error: "Subject is required." }));
      return;
    }
    if (!sendEmailModal.message || !sendEmailModal.message.trim()) {
      setSendEmailModal(prev => ({ ...prev, error: "Message is required." }));
      return;
    }

    setSendEmailModal(prev => ({ ...prev, isSending: true, error: "" }));

    try {
      const res = await authFetch(`${API}/api/v1/inquiries/send-email`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          to: sendEmailModal.to.trim(),
          subject: sendEmailModal.subject.trim(),
          message: sendEmailModal.message.trim()
        })
      });

      const data = await res.json().catch(() => ({}));

      if (res.ok && data.success) {
        showToast("✓ Email sent successfully", "success");
        setSendEmailModal({
          isOpen: false,
          to: "",
          subject: "",
          message: "",
          inquiryId: null,
          isSending: false,
          error: ""
        });
      } else {
        const errMsg = data.error?.message || data.message || "Failed to send email. Please check SMTP configuration.";
        setSendEmailModal(prev => ({ ...prev, isSending: false, error: errMsg }));
      }
    } catch (err) {
      setSendEmailModal(prev => ({
        ...prev,
        isSending: false,
        error: err.message || "Failed to send email. Please try again."
      }));
    }
  };

  const logout = () => { localStorage.removeItem("adminToken"); navigate("/admin/login"); };

  const filteredInquiries = inquiries.filter(inq => {
    const matchesSearch = !inquirySearch || 
      inq.name?.toLowerCase().includes(inquirySearch.toLowerCase()) ||
      inq.phone?.includes(inquirySearch) ||
      inq.email?.toLowerCase().includes(inquirySearch.toLowerCase()) ||
      inq.productName?.toLowerCase().includes(inquirySearch.toLowerCase());
    
    const matchesStatus = statusFilter === "all" || inq.status === statusFilter;
    const matchesPriority = priorityFilter === "all" || inq.priority === priorityFilter;
    
    const matchesType = leadType === "all" ||
      (leadType === "product" && inq.type === "product") ||
      (leadType === "general" && (!inq.type || inq.type === "general"));
    
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
  const currentRetainedCount = (editingProduct?.images?.length || 0) - removedImages.length;
  const totalGalleryCount = Math.max(0, currentRetainedCount) + newGalleryFiles.length;

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
    { id:"homepage", label:"Hero Banner", badge: null, icon: "🖼️" },
    { id:"inquiries", label:"Inquiries", badge: unreadCount || null, badgeWarn: true, icon: "💬" },
    { id:"analytics", label:"Analytics", badge: null, icon: "📊" },
  ];

  const getPageTitle = () => {
    if (activeTab === "add-product") return editingProduct ? "Edit Product" : "Add New Product";
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

      {/* Mobile Menu Button */}
      <button className="adm-mobile-menu-btn" onClick={toggleMobileSidebar}>
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <line x1="3" y1="12" x2="21" y2="12"/>
          <line x1="3" y1="6" x2="21" y2="6"/>
          <line x1="3" y1="18" x2="21" y2="18"/>
        </svg>
      </button>

      {/* Sidebar */}
      <aside className={`adm-sidebar ${sidebarCollapsed ? "adm-sidebar--collapsed" : ""} ${mobileSidebarOpen && isMobile ? "adm-sidebar--mobile-open" : ""}`}>
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
          {!isMobile && (
            <button className="adm-sidebar__toggle" onClick={() => setSidebarCollapsed(c => !c)}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                {sidebarCollapsed ? <path d="M9 18l6-6-6-6"/> : <path d="M15 18l-6-6 6-6"/>}
              </svg>
            </button>
          )}
        </div>

        <nav className="adm-sidebar__nav">
          {navItems.map(item => (
            <button key={item.id}
              className={`adm-nav-btn ${activeTab === item.id ? "adm-nav-btn--active" : ""}`}
              onClick={() => { 
                setActiveTab(item.id); 
                if (item.id !== "add-product") setEditingProduct(null);
                if (isMobile) setMobileSidebarOpen(false);
              }}
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

      {/* Overlay for mobile sidebar */}
      {mobileSidebarOpen && isMobile && (
        <div className="adm-sidebar-overlay" onClick={() => setMobileSidebarOpen(false)}></div>
      )}

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
                <button className="adm-btn adm-btn--primary" onClick={() => { setEditingProduct(null); setFormKey(k => k + 1); setActiveTab("add-product"); if(isMobile) setMobileSidebarOpen(false); }}>+ Add Product</button>
              </div>
              <div className="adm-table-wrap">
                <table className="adm-table">
                  <thead>
                    <tr><th>Image</th><th>Product Name</th><th>Category</th><th>Price</th><th>Order</th><th>Status</th><th>Actions</th></tr>
                  </thead>
                  <tbody>
                    {filteredProducts.map(item => (
                      <tr key={item._id}>
                        <td><div className="adm-product-img"><img src={item.image?.replace("http://localhost:10000", window.location.origin)} alt={item.title} onError={e => { e.target.src = "https://placehold.co/52x52/e6faf7/0f766e?text=IMG"; }} /></div></td>
                        <td><span className="adm-product-name">{item.title}</span></td>
                        <td><span className="adm-cat-pill">{item.category}</span></td>
                        <td><span className="adm-price">{item.price}</span></td>
                        <td><span className="adm-order-badge">#{item.order || 0}</span></td>
                        <td>
                          <button
                            type="button"
                            className={`adm-status-toggle ${item.isActive !== false ? "adm-status-toggle--active" : "adm-status-toggle--inactive"}`}
                            onClick={() => toggleProductStatus(item._id, item.isActive !== false)}
                            title="Click to toggle visibility on public website"
                          >
                            <span className="adm-status-dot" />
                            {item.isActive !== false ? "Active" : "Hidden"}
                          </button>
                        </td>
                        <td><div className="adm-actions"><button className="adm-icon-btn adm-icon-btn--edit" onClick={() => startEditingProduct(item)}>✏️</button><button className="adm-icon-btn adm-icon-btn--del" onClick={() => deleteProduct(item._id)}>🗑️</button></div></td>
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
              {editingProduct?.image && (<div className="adm-edit-preview"><div className="adm-edit-preview__label">Current Primary Image</div><img src={editingProduct.image?.replace("http://localhost:10000", window.location.origin)} alt={editingProduct.title} className="adm-edit-preview__img" /></div>)}
              <form key={formKey} className="adm-form" onSubmit={editingProduct ? updateProduct : addProduct}>
                <div className="adm-form__grid">
                  <div className="adm-form__field"><label>Product Name <span className="adm-req">*</span></label><input type="text" name="title" defaultValue={editingProduct?.title || ""} required placeholder="e.g., Wooden ICU Bed" /></div>
                  <div className="adm-form__field"><label>Price <span className="adm-req">*</span></label><input type="text" name="price" defaultValue={editingProduct?.price || ""} required placeholder="e.g., ₹84,000" /></div>
                  <div className="adm-form__field"><label>Category <span className="adm-req">*</span></label>
                    <select name="category" defaultValue={editingProduct?.category || ""} required>
                      <option value="">Select Category</option>
                      {categories.map(cat => (<option key={cat._id} value={cat.name}>{cat.name}</option>))}
                    </select>
                  </div>
                  <div className="adm-form__field"><label>Display Order</label><input type="number" name="order" defaultValue={editingProduct?.order || 0} min="0" placeholder="0 (Lower numbers appear first)" /></div>
                  <div className="adm-form__field">
                    <label>Public Visibility</label>
                    <div style={{ marginTop: 8 }}>
                      <button
                        type="button"
                        className={`adm-vis-toggle-btn ${productIsActive ? "adm-vis-toggle-btn--active" : "adm-vis-toggle-btn--inactive"}`}
                        onClick={() => setProductIsActive(!productIsActive)}
                        style={{
                          display: "inline-flex",
                          alignItems: "center",
                          gap: 10,
                          padding: "8px 16px",
                          borderRadius: 8,
                          border: productIsActive ? "1.5px solid #059669" : "1.5px solid #d97706",
                          background: productIsActive ? "#ecfdf5" : "#fffbeb",
                          color: productIsActive ? "#065f46" : "#92400e",
                          fontWeight: 600,
                          fontSize: "0.88rem",
                          cursor: "pointer",
                          transition: "all 0.2s ease"
                        }}
                      >
                        <span
                          style={{
                            width: 18,
                            height: 18,
                            borderRadius: "50%",
                            background: productIsActive ? "#10b981" : "#f59e0b",
                            display: "inline-flex",
                            alignItems: "center",
                            justifyContent: "center",
                            color: "white",
                            fontSize: 10,
                            fontWeight: 800
                          }}
                        >
                          {productIsActive ? "✓" : "✕"}
                        </span>
                        <span>{productIsActive ? "Visible on Public Website" : "Hidden from Public Website"}</span>
                      </button>
                      <p className="adm-form__hint" style={{ marginTop: 4 }}>
                        {productIsActive
                          ? "This product is published and visible to website visitors."
                          : "This product is hidden from visitors and only manageable by admin."}
                      </p>
                    </div>
                  </div>
                  <div className="adm-form__field">
                    <label>Primary Product Image{!editingProduct && <span className="adm-req"> *</span>}</label>
                    <input
                      type="file"
                      name="image"
                      accept="image/jpeg,image/png,image/webp"
                      onChange={handlePrimaryImageChange}
                      className="adm-file-input"
                    />
                    {editingProduct && <p className="adm-form__hint">Leave empty to keep current image</p>}
                  </div>
                  <div className="adm-form__field adm-form__field--full">
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 4 }}>
                      <label style={{ margin: 0 }}>Additional Gallery Images (Max 5)</label>
                      <span style={{ fontSize: "0.82rem", fontWeight: 700, color: totalGalleryCount >= 5 ? "#dc2626" : "#0f766e" }}>
                        {totalGalleryCount} / 5 slots used
                      </span>
                    </div>
                    <input
                      type="file"
                      name="additionalImages"
                      multiple
                      accept="image/jpeg,image/png,image/webp"
                      className="adm-file-input"
                      onChange={handleGalleryFilesChange}
                      disabled={totalGalleryCount >= 5}
                    />
                    <p className="adm-form__hint">
                      {totalGalleryCount >= 5
                        ? "Maximum 5 gallery images reached. Remove an image to upload more."
                        : `Upload JPEG, PNG, or WEBP images (up to 5MB each). ${5 - totalGalleryCount} slot(s) remaining.`}
                    </p>
                  </div>
                </div>

                {newGalleryPreviews.length > 0 && (
                  <div className="adm-form__field adm-form__field--full" style={{ marginBottom: 16 }}>
                    <label style={{ color: "#0f766e", fontWeight: 700 }}>
                      Newly Selected Gallery Images ({newGalleryPreviews.length} pending save)
                    </label>
                    <div className="adm-gallery-preview-grid">
                      {newGalleryPreviews.map((item, idx) => (
                        <div key={item.id} className="adm-gallery-thumb-wrap" style={{ border: "2px solid #0d9488" }}>
                          <img src={item.url} alt={`New upload ${idx + 1}`} />
                          <button
                            type="button"
                            className="adm-gallery-thumb-del"
                            onClick={() => handleRemoveNewGalleryFile(idx)}
                            title="Remove selected image"
                          >
                            ✕
                          </button>
                        </div>
                      ))}
                    </div>
                    <p style={{ fontSize: "0.8rem", color: "#0f766e" }}>
                      These images will be uploaded and added to the gallery when you save the product.
                    </p>
                  </div>
                )}

                {editingProduct?.images && editingProduct.images.length > 0 && (
                  <div className="adm-form__field adm-form__field--full" style={{ marginBottom: 16 }}>
                    <label>Current Gallery Images ({editingProduct.images.length})</label>
                    <div className="adm-gallery-preview-grid">
                      {editingProduct.images.map((imgUrl, idx) => {
                        const isRemoved = removedImages.includes(imgUrl);
                        const src = imgUrl.startsWith("http") ? imgUrl : `${window.location.origin}${imgUrl}`;
                        return (
                          <div key={idx} className={`adm-gallery-thumb-wrap ${isRemoved ? "adm-gallery-thumb-wrap--removed" : ""}`}>
                            <img src={src} alt={`Additional ${idx + 1}`} />
                            <button
                              type="button"
                              className="adm-gallery-thumb-del"
                              onClick={() => handleToggleRemoveImage(imgUrl)}
                              title={isRemoved ? "Restore image" : "Mark image for deletion"}
                            >
                              {isRemoved ? "↺" : "✕"}
                            </button>
                          </div>
                        );
                      })}
                    </div>
                    {removedImages.length > 0 && (
                      <p style={{ fontSize: "0.8rem", color: "#ef4444" }}>
                        {removedImages.length} image(s) marked for removal upon saving.
                      </p>
                    )}
                  </div>
                )}

                <div className="adm-form__field adm-form__field--full" style={{ marginBottom: 16 }}>
                  <label>Technical Specifications (Key - Value)</label>
                  <div className="adm-specs-manager">
                    <div className="adm-specs-inputs">
                      <input
                        type="text"
                        placeholder="Key (e.g., Material, Dimensions)"
                        value={newSpecKey}
                        onChange={e => setNewSpecKey(e.target.value)}
                        onKeyDown={e => { if (e.key === "Enter") { e.preventDefault(); handleAddSpec(); } }}
                      />
                      <input
                        type="text"
                        placeholder="Value (e.g., SS 304, 2100 x 950 mm)"
                        value={newSpecVal}
                        onChange={e => setNewSpecVal(e.target.value)}
                        onKeyDown={e => { if (e.key === "Enter") { e.preventDefault(); handleAddSpec(); } }}
                      />
                      <button
                        type="button"
                        className="adm-btn adm-btn--sm adm-btn--primary"
                        onClick={handleAddSpec}
                      >
                        + Add Spec
                      </button>
                    </div>

                    {specs.length > 0 ? (
                      <div className="adm-specs-list">
                        {specs.map((s, idx) => (
                          <div key={idx} className="adm-spec-item">
                            <span className="adm-spec-key">{s.key}:</span>
                            <span className="adm-spec-val">{s.value}</span>
                            <button
                              type="button"
                              className="adm-spec-del-btn"
                              onClick={() => handleRemoveSpec(idx)}
                              title="Remove specification"
                            >
                              ✕ Remove
                            </button>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p style={{ fontSize: "0.85rem", color: "#94a3b8", margin: "6px 0 0" }}>
                        No specifications added yet. Add key-value pairs above to showcase technical parameters on the product page.
                      </p>
                    )}
                  </div>
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
                <div><h2 className="adm-card__title">Manage Categories</h2><p className="adm-card__sub">{categories.length} total categories - Click on any category to view its products</p></div>
              </div>
              
              <div className="category-add-section">
                <div className="category-add-form">
                  <input type="text" value={newCategory} onChange={(e) => setNewCategory(e.target.value)} placeholder="Enter new category name..." className="category-input" onKeyPress={(e) => e.key === 'Enter' && addCategory()} />
                  <button onClick={addCategory} className="adm-btn adm-btn--primary">+ Add Category</button>
                </div>
              </div>

              <div className="categories-list-expandable">
                {categories.length === 0 ? (
                  <div className="adm-empty"><div className="adm-empty__icon">🏷️</div><p>No categories yet. Add your first category above.</p></div>
                ) : (
                  categories.map((cat, i) => {
                    const count = getCategoryCount(cat.name);
                    const categoryProducts = getProductsByCategory(cat.name);
                    const isExpanded = expandedCategories[cat._id];
                    
                    return (
                      <div key={cat._id} className="category-expandable-item">
                        <div className="category-expandable-header" onClick={() => toggleCategory(cat._id)}>
                          <div className="category-expandable-left">
                            <span className="expand-icon">{isExpanded ? "▼" : "▶"}</span>
                            <span className="category-number">{String(i + 1).padStart(2, "0")}</span>
                            <div className="category-details-expandable">
                              <strong className="category-name">{cat.name}</strong>
                              <span className="category-count">{count} {count === 1 ? "product" : "products"}</span>
                            </div>
                          </div>
                          <div className="category-expandable-right">
                            <span className={`category-status ${count > 0 ? "active" : "empty"}`}>{count > 0 ? "Active" : "Empty"}</span>
                            <button onClick={(e) => { e.stopPropagation(); setEditingCategory(cat); setEditCategoryName(cat.name); }} className="adm-icon-btn adm-icon-btn--edit" title="Rename Category">✏️</button>
                            <button onClick={(e) => { e.stopPropagation(); deleteCategory(cat._id); }} className="adm-icon-btn adm-icon-btn--del" title="Delete Category">🗑️</button>
                          </div>
                        </div>
                        
                        {isExpanded && (
                          <div className="category-products-list">
                            <div className="category-products-header"><span>Products in "{cat.name}"</span><span>{categoryProducts.length} items</span></div>
                            {categoryProducts.length === 0 ? (
                              <div className="category-products-empty"><p>No products in this category yet.</p><button className="adm-btn adm-btn--sm adm-btn--primary" onClick={() => { setActiveTab("add-product"); setEditingProduct(null); }}>+ Add Product</button></div>
                            ) : (
                              <div className="category-products-grid">
                                {categoryProducts.map(product => (
                                  <div key={product._id} className="category-product-item">
                                    <div className="category-product-image"><img src={product.image?.replace("http://localhost:10000", window.location.origin)} alt={product.title} /></div>
                                    <div className="category-product-info"><h4>{product.title}</h4><p className="product-price">{product.price}</p><p className="product-desc">{product.desc?.substring(0, 60)}...</p></div>
                                    <div className="category-product-actions"><button className="adm-icon-btn adm-icon-btn--edit" onClick={() => { setEditingProduct(product); setFormKey(k => k + 1); setActiveTab("add-product"); }} title="Edit Product">✏️</button><button className="adm-icon-btn adm-icon-btn--del" onClick={() => deleteProduct(product._id)} title="Delete Product">🗑️</button></div>
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          )}

          {/* Hero Banner Management Tab */}
          {activeTab === "homepage" && (
            <div className="adm-card">
              <div className="adm-card__header">
                <div>
                  <h2 className="adm-card__title">Hero Banner Image</h2>
                  <p className="adm-card__sub">Manage the main public hero banner image for the homepage.</p>
                </div>
              </div>

              <div style={{ margin: "0 24px 20px 24px", padding: "14px 18px", background: "#f0fdf4", border: "1px solid #bbf7d0", borderRadius: "8px", fontSize: "0.88rem", color: "#166534" }}>
                <strong>Design Integrity Safeguard:</strong> Hero badge, headline typography, and description are locked to preserve Sri Srinivasa's approved layout, branding, and responsive design. Only the main hero banner image can be customized.
              </div>

              <form className="adm-form" onSubmit={handleSaveSiteSettings}>
                <div className="adm-form__field">
                  <label>Current Hero Banner</label>
                  {homepageSettings.heroBannerImage ? (
                    <div style={{ marginBottom: 16, display: "flex", flexDirection: "column", gap: 12 }}>
                      <div style={{ position: "relative", display: "inline-block", maxWidth: 520 }}>
                        <img
                          src={homepageSettings.heroBannerImage.startsWith("http") ? homepageSettings.heroBannerImage : `${window.location.origin}${homepageSettings.heroBannerImage}`}
                          alt="Current Banner"
                          style={{ width: "100%", maxHeight: 220, borderRadius: 8, border: "1px solid #cbd5e1", objectFit: "cover" }}
                        />
                      </div>
                      <div>
                        <button
                          type="button"
                          className="adm-btn adm-btn--sm"
                          style={{ background: "#fee2e2", color: "#b91c1c", border: "1px solid #fca5a5" }}
                          onClick={() => {
                            setHomepageSettings(prev => ({ ...prev, heroBannerImage: "", removeBanner: true }));
                            setBannerPreview(null);
                          }}
                        >
                          ✕ Remove Custom Banner (Restore Default)
                        </button>
                      </div>
                    </div>
                  ) : homepageSettings.removeBanner ? (
                    <div style={{ marginBottom: 16, padding: "12px 16px", background: "#fef3c7", border: "1px solid #fde68a", borderRadius: 8, color: "#92400e", fontSize: "0.9rem" }}>
                      ⚠️ Banner marked for removal. Click <strong>"Save Banner Image"</strong> below to apply and restore the default ICU Ward image.
                    </div>
                  ) : (
                    <div style={{ marginBottom: 16, padding: "12px 16px", background: "#f1f5f9", border: "1px solid #e2e8f0", borderRadius: 8, color: "#475569", fontSize: "0.9rem" }}>
                      ℹ️ Using default hero banner image (ICU Ward). Upload a custom image below to replace it.
                    </div>
                  )}

                  {bannerPreview && (
                    <div style={{ marginBottom: 16, padding: 12, background: "#f8fafc", border: "1px dashed #0d9488", borderRadius: 8 }}>
                      <p style={{ margin: "0 0 8px 0", fontSize: "0.85rem", fontWeight: 600, color: "#0d9488" }}>
                        New Banner Preview (Unsaved):
                      </p>
                      <img
                        src={bannerPreview}
                        alt="New Banner Preview"
                        style={{ maxWidth: 520, maxHeight: 220, borderRadius: 6, objectFit: "cover", display: "block" }}
                      />
                    </div>
                  )}

                  <label style={{ marginTop: 8 }}>Select New Banner Image</label>
                  <input
                    type="file"
                    name="bannerImage"
                    accept="image/jpeg,image/png,image/webp"
                    className="adm-file-input"
                    onChange={handleBannerFileChange}
                  />
                  <p className="adm-form__hint">Supported formats: JPEG, PNG, WEBP. Maximum file size: 5 MB.</p>
                </div>

                <div className="adm-form__actions" style={{ marginTop: 20 }}>
                  <button type="submit" className="adm-btn adm-btn--primary adm-btn--lg" disabled={savingSettings}>
                    {savingSettings ? <><span className="adm-spinner" /> Saving Banner...</> : "Save Banner Image"}
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* Inquiries Tab */}
          {activeTab === "inquiries" && (
            <div className="adm-card">
              <div className="adm-card__header">
                <div><h2 className="adm-card__title">Customer Inquiries</h2><p className="adm-card__sub">{unreadCount} unread · {inquiries.length} total</p></div>
                <div className="inquiry-actions-header"><button className="adm-btn adm-btn--sm adm-btn--primary" onClick={exportToCSV}>Export to CSV</button></div>
              </div>

              <div className="inquiry-filters">
                <div className="filter-group"><select value={leadType} onChange={e => { setLeadType(e.target.value); setCurrentPage(1); }} className="filter-select"><option value="all">All Leads</option><option value="product">Product Leads</option><option value="general">General Leads</option></select></div>
                <div className="filter-group"><select value={inquiryFilter} onChange={e => { setInquiryFilter(e.target.value); setCurrentPage(1); }} className="filter-select"><option value="all">All Inquiries</option><option value="unread">Unread Only</option><option value="today">Today</option><option value="week">This Week</option><option value="closed">Closed</option><option value="hot">Hot Leads</option></select></div>
                <div className="filter-group"><select value={statusFilter} onChange={e => { setStatusFilter(e.target.value); setCurrentPage(1); }} className="filter-select"><option value="all">All Status</option>{statusOptions.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}</select></div>
                <div className="filter-group"><select value={priorityFilter} onChange={e => { setPriorityFilter(e.target.value); setCurrentPage(1); }} className="filter-select"><option value="all">All Priorities</option>{priorityOptions.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}</select></div>
                <div className="filter-group"><input type="text" placeholder="Search by name, phone, email, product..." value={inquirySearch} onChange={e => { setInquirySearch(e.target.value); setCurrentPage(1); }} className="filter-search" /></div>
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
                    
                    return (
                      <div key={inq._id} className={`adm-inq ${!inq.read ? "adm-inq--unread" : ""}`}>
                        <div className="adm-inq__header">
                          <div className="adm-inq__avatar">{inq.name?.[0]?.toUpperCase() || "?"}</div>
                          <div className="adm-inq__meta"><strong>{inq.name}</strong><span>{inq.email || "No email"} {inq.phone && `· ${inq.phone}`}</span>{inq.productName && <span className="inq-product-tag">Product: {inq.productName}</span>}</div>
                          <div className="adm-inq__right"><div className="inq-badges"><span className={`lead-type-badge ${inq.type === "product" ? "badge-product" : "badge-general"}`}>{inq.type === "product" ? "Product Lead" : "General Lead"}</span><select className="status-select" value={inq.status || "new"} style={{ background: statusStyle.bg, color: statusStyle.color }} onChange={(e) => updateInquiryStatus(inq._id, e.target.value)}>{statusOptions.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}</select><select className="priority-select" value={inq.priority || "normal"} style={{ background: priorityStyle.bg, color: priorityStyle.color }} onChange={(e) => updateInquiryPriority(inq._id, e.target.value)}>{priorityOptions.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}</select></div><span className="adm-inq__date">{inq.createdAt ? new Date(inq.createdAt).toLocaleString() : "—"}</span></div>
                        </div>
                        <div className="adm-inq__msg">{inq.message}</div>
                        
                        {inq.notes && inq.notes.length > 0 && (<div className="inq-notes"><div className="inq-notes__title">Notes</div>{inq.notes.map((note, idx) => (<div key={idx} className="inq-note"><span className="inq-note__date">{new Date(note.createdAt).toLocaleString()}</span><p>{note.note}</p></div>))}</div>)}
                        
                        <div className="adm-inq__actions">
                          {!inq.read && <button className="adm-btn adm-btn--sm adm-btn--primary" onClick={() => markAsRead(inq._id)}>Mark as Read</button>}
                          <a href={whatsappUrl} target="_blank" rel="noreferrer" className="adm-btn adm-btn--sm btn-wa">WhatsApp</a>
                          <a href={`tel:${inq.phone}`} className="adm-btn adm-btn--sm btn-call">Call</a>
                          <button className="adm-btn adm-btn--sm btn-note" onClick={() => { setSelectedInquiry(inq); setShowNotesModal(true); }}>Add Note</button>
                          <button type="button" className="adm-btn adm-btn--sm btn-email" onClick={() => handleOpenSendEmail(inq)}>Send Email</button>
                          <button className="adm-icon-btn adm-icon-btn--del" onClick={() => deleteInquiry(inq._id)}>🗑️</button>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>

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
              <div className="adm-chart-card"><h3>Products by Category</h3><div className="adm-chart">{categories.filter(c => getCategoryCount(c.name) > 0).length === 0 && <p style={{ color: "var(--text-muted)", padding: "20px 0" }}>No product data yet.</p>}{categories.filter(c => getCategoryCount(c.name) > 0).map((cat, i) => { const count = getCategoryCount(cat.name); const max = Math.max(...categories.map(c => getCategoryCount(c.name)), 1); return (<div key={i} className="adm-chart__row"><div className="adm-chart__label">{cat.name}</div><div className="adm-chart__bar-bg"><div className="adm-chart__bar" style={{ width: `${(count / max) * 100}%` }} /></div><div className="adm-chart__val">{count}</div></div>); })}</div></div>
              <div className="adm-chart-card"><h3>Summary</h3><div className="adm-activity"><div className="adm-activity__item"><div className="adm-activity__dot" /><div><p>Total products</p><span>{products.length} products</span></div></div><div className="adm-activity__item"><div className="adm-activity__dot" /><div><p>Active categories</p><span>{categories.filter(c => getCategoryCount(c.name) > 0).length} of {categories.length}</span></div></div><div className="adm-activity__item"><div className="adm-activity__dot" /><div><p>Customer inquiries</p><span>{inquiries.length} total</span></div></div><div className="adm-activity__item"><div className="adm-activity__dot" /><div><p>Unread inquiries</p><span>{unreadCount} pending</span></div></div></div></div>
            </div>
          )}
        </div>
      </main>

      {/* Notes Modal */}
      {showNotesModal && selectedInquiry && (
        <div className="modal-overlay" onClick={() => { setShowNotesModal(false); setNoteText(""); }}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header"><h3>Add Note for {selectedInquiry.name}</h3><button className="modal-close" onClick={() => { setShowNotesModal(false); setNoteText(""); }}>✕</button></div>
            <div className="modal-body"><textarea rows="4" placeholder="Enter your note here..." value={noteText} onChange={(e) => setNoteText(e.target.value)} className="note-textarea"></textarea><div className="modal-actions"><button className="adm-btn adm-btn--primary" onClick={() => { addNote(); setShowNotesModal(false); }}>Add Note</button><button className="adm-btn adm-btn--ghost" onClick={() => { setShowNotesModal(false); setNoteText(""); }}>Cancel</button></div></div>
          </div>
        </div>
      )}

      {/* Custom Delete Confirmation Modal */}
      {deleteConfirmModal.isOpen && (
        <div
          className="adm-confirm-overlay"
          onClick={() => {
            if (!deleteConfirmModal.isDeleting) {
              setDeleteConfirmModal(prev => ({ ...prev, isOpen: false }));
            }
          }}
        >
          <div className="adm-confirm-modal" onClick={(e) => e.stopPropagation()}>
            <div className="adm-confirm-icon-wrap">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#ef4444" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="3 6 5 6 21 6" />
                <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                <line x1="10" y1="11" x2="10" y2="17" />
                <line x1="14" y1="11" x2="14" y2="17" />
              </svg>
            </div>
            <h3 className="adm-confirm-title">{deleteConfirmModal.title}</h3>
            <p className="adm-confirm-message">
              {deleteConfirmModal.message}
              {deleteConfirmModal.name && (
                <span className="adm-confirm-target">
                  "{deleteConfirmModal.name}"
                </span>
              )}
            </p>
            <p className="adm-confirm-warning">This action cannot be undone.</p>
            <div className="adm-confirm-actions">
              <button
                type="button"
                className="adm-btn adm-confirm-cancel-btn"
                disabled={deleteConfirmModal.isDeleting}
                onClick={() => setDeleteConfirmModal(prev => ({ ...prev, isOpen: false }))}
              >
                Cancel
              </button>
              <button
                type="button"
                className="adm-btn adm-confirm-delete-btn"
                disabled={deleteConfirmModal.isDeleting}
                onClick={handleConfirmDelete}
              >
                {deleteConfirmModal.isDeleting ? (
                  <>
                    <span className="adm-confirm-spinner"></span>
                    Deleting...
                  </>
                ) : (
                  deleteConfirmModal.confirmText || "Delete"
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Professional Outbound Send Email Modal (Admin Only) */}
      {sendEmailModal.isOpen && (
        <div
          className="adm-modal-overlay"
          onClick={() => {
            if (!sendEmailModal.isSending) {
              setSendEmailModal(prev => ({ ...prev, isOpen: false }));
            }
          }}
          role="presentation"
        >
          <div
            className="adm-email-modal"
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            aria-modal="true"
            aria-labelledby="adm-email-modal-title"
          >
            <div className="adm-email-modal__header">
              <div className="adm-email-modal__title-group">
                <span className="adm-email-modal__icon">✉️</span>
                <div>
                  <h3 id="adm-email-modal-title" className="adm-email-modal__title">Send Email</h3>
                  <p className="adm-email-modal__sub">Direct outbound reply via verified SMTP</p>
                </div>
              </div>
              <button
                type="button"
                className="adm-email-modal__close-btn"
                disabled={sendEmailModal.isSending}
                onClick={() => setSendEmailModal(prev => ({ ...prev, isOpen: false }))}
                aria-label="Close"
              >
                ✕
              </button>
            </div>

            {sendEmailModal.error && (
              <div className="adm-email-modal__error">
                <span>✕</span> {sendEmailModal.error}
              </div>
            )}

            <form onSubmit={handleSendEmailSubmit} className="adm-email-modal__form">
              <div className="adm-email-field">
                <label htmlFor="adm-email-to">To:</label>
                <input
                  id="adm-email-to"
                  type="email"
                  value={sendEmailModal.to}
                  onChange={(e) => setSendEmailModal({ ...sendEmailModal, to: e.target.value, error: "" })}
                  placeholder="customer@example.com"
                  disabled={sendEmailModal.isSending}
                  required
                />
              </div>

              <div className="adm-email-field">
                <label htmlFor="adm-email-subject">Subject:</label>
                <input
                  id="adm-email-subject"
                  type="text"
                  value={sendEmailModal.subject}
                  onChange={(e) => setSendEmailModal({ ...sendEmailModal, subject: e.target.value, error: "" })}
                  placeholder="Subject"
                  disabled={sendEmailModal.isSending}
                  required
                />
              </div>

              <div className="adm-email-field">
                <label htmlFor="adm-email-message">Message:</label>
                <textarea
                  id="adm-email-message"
                  rows={8}
                  value={sendEmailModal.message}
                  onChange={(e) => setSendEmailModal({ ...sendEmailModal, message: e.target.value, error: "" })}
                  placeholder="Type your reply message..."
                  disabled={sendEmailModal.isSending}
                  required
                />
              </div>

              <div className="adm-email-modal__actions">
                <button
                  type="button"
                  className="adm-btn adm-btn--ghost"
                  onClick={() => setSendEmailModal(prev => ({ ...prev, isOpen: false }))}
                  disabled={sendEmailModal.isSending}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="adm-btn adm-btn--primary"
                  disabled={sendEmailModal.isSending}
                  id="adm-send-email-btn"
                >
                  {sendEmailModal.isSending ? (
                    <>
                      <span className="adm-email-spinner" aria-hidden="true" />
                      <span>Sending...</span>
                    </>
                  ) : (
                    <>
                      <span>Send Email</span>
                      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                        <line x1="22" y1="2" x2="11" y2="13" />
                        <polygon points="22 2 15 22 11 13 2 9 22 2" />
                      </svg>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Category Rename Modal */}
      {editingCategory && (
        <div className="modal-overlay" onClick={() => setEditingCategory(null)}>
          <div className="modal-content" onClick={e => e.stopPropagation()} style={{ maxWidth: 440 }}>
            <div className="modal-header">
              <h3>Rename Category</h3>
              <button className="modal-close" onClick={() => setEditingCategory(null)}>✕</button>
            </div>
            <form onSubmit={handleUpdateCategory} className="modal-body">
              <p style={{ fontSize: "0.88rem", color: "var(--text-muted)", marginBottom: 16 }}>
                Renaming category <strong>"{editingCategory.name}"</strong> will safely synchronize all linked products in the database automatically.
              </p>
              <div className="adm-form__field">
                <label>Category Name <span className="adm-req">*</span></label>
                <input
                  type="text"
                  value={editCategoryName}
                  onChange={e => setEditCategoryName(e.target.value)}
                  required
                  className="category-input"
                  style={{ width: "100%", marginTop: 6 }}
                  autoFocus
                />
              </div>
              <div className="modal-actions" style={{ marginTop: 20 }}>
                <button type="submit" className="adm-btn adm-btn--primary">Save Changes</button>
                <button type="button" className="adm-btn adm-btn--ghost" onClick={() => setEditingCategory(null)}>Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}