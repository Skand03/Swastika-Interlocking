import React, { useState, useEffect } from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import DashboardOverview from '../components/admin/DashboardOverview';
import ProductsManagement from '../components/admin/ProductsManagement';
import InventoryShuttering from '../components/admin/InventoryShuttering';
import SalesReports from '../components/admin/SalesReports';
import OrdersManagement from '../components/admin/OrdersManagement';
import CustomersInquiries from '../components/admin/CustomersInquiries';
import InquiriesManagement from '../components/admin/InquiriesManagement';
import Settings from '../components/admin/Settings';
import RCCProjectsManagement from '../components/admin/RCCProjectsManagement';

export default function AdminRoutes({ language }) {
  const navigate = useNavigate();
  const [admin, setAdmin] = useState(null);
  const [orders, setOrders] = useState([]);
  const [inquiries, setInquiries] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [products, setProducts] = useState([]);
  const [metrics, setMetrics] = useState({ totalSales: 0, newOrders: 0, newCustomers: 0, lowStock: 0 });
  const [loading, setLoading] = useState(true);

  // Products form and status states
  const [productForm, setProductForm] = useState({
    product_key: '',
    category: 'Interlocking Blocks',
    name_en: '',
    name_hi: '',
    price: '',
    stock: '',
    image_url: '',
    desc_en: '',
    desc_hi: '',
    variants: []
  });
  const [isEditing, setIsEditing] = useState(false);
  const [productStatus, setProductStatus] = useState('');
  const [productIsSuccess, setProductIsSuccess] = useState(false);

  // Selected entities for drawers/chats
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [selectedInquiry, setSelectedInquiry] = useState(null);

  // In-tab search states
  const [customerSearch, setCustomerSearch] = useState('');

  // Status updating state
  const [updatingOrderId, setUpdatingOrderId] = useState(null);

  const { dbUser, loading: authLoading, authFetch } = useAuth();

  const fetchProducts = () => {
    authFetch('./api/get_products.php')
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          setProducts(data.products || []);
        }
      })
      .catch(err => console.error("Error fetching products:", err));
  };

  const fetchData = (phone) => {
    authFetch(`./api/get_portal_data.php?phone=${phone}&role=admin`)
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          setOrders(data.orders || []);
          setInquiries(data.inquiries || []);
          setCustomers(data.customers || []);
          if (data.customers && data.customers.length > 0) {
            setSelectedCustomer(data.customers[0]);
          }
          if (data.inquiries && data.inquiries.length > 0) {
            setSelectedInquiry(data.inquiries[0]);
          }
          if (data.metrics) {
            setMetrics(data.metrics);
          }
        }
        setLoading(false);
      })
      .catch(err => {
        console.error("Error fetching admin stats:", err);
        setLoading(false);
      });
  };

  useEffect(() => {
    if (authLoading) return;
    if (!dbUser) {
      navigate('/auth');
      return;
    }
    if (dbUser.role !== 'admin') {
      navigate('/customer-dashboard');
      return;
    }
    setAdmin(dbUser);

    fetchProducts();
    fetchData(dbUser.phone);
  }, [navigate, dbUser, authLoading]);

  const handleStatusChange = async (orderId, newStatus) => {
    setUpdatingOrderId(orderId);
    try {
      const response = await authFetch('./api/update_order.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: orderId, status: newStatus, admin_phone: admin?.phone })
      });
      const result = await response.json();
      if (result.success) {
        fetchData(admin.phone);
      } else {
        alert(result.message || "Failed to update order status.");
      }
    } catch (err) {
      console.error(err);
      alert("Server error updating status.");
    } finally {
      setUpdatingOrderId(null);
    }
  };

  const handleAddNewProductClick = () => {
    setIsEditing(false);
    setProductForm({
      product_key: '',
      category: 'Interlocking Blocks',
      name_en: '',
      name_hi: '',
      price: '',
      stock: '',
      image_url: '',
      desc_en: '',
      desc_hi: '',
      variants: []
    });
    setProductStatus('');
    const formElement = document.getElementById('product-form-container');
    if (formElement) formElement.scrollIntoView({ behavior: 'smooth' });
  };

  const handleEditProduct = (prod) => {
    setIsEditing(true);
    setProductForm({
      id: prod.id,
      product_key: prod.product_key,
      category: prod.category,
      name_en: prod.name_en || '',
      name_hi: prod.name_hi || '',
      price: prod.price || '',
      stock: prod.stock || '',
      image_url: prod.image_url || '',
      desc_en: prod.desc_en || '',
      desc_hi: prod.desc_hi || '',
      variants: Array.isArray(prod.variants) ? prod.variants : []
    });
    setProductStatus('');
    const formElement = document.getElementById('product-form-container');
    if (formElement) formElement.scrollIntoView({ behavior: 'smooth' });
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setProductForm({
      product_key: '',
      category: 'Interlocking Blocks',
      name_en: '',
      name_hi: '',
      price: '',
      stock: '',
      image_url: '',
      desc_en: '',
      desc_hi: '',
      variants: []
    });
    setProductStatus('');
  };

  const handleSaveProduct = async () => {
    if (!productForm.product_key || !productForm.name_en || !productForm.price) {
      setProductStatus('Please fill in the product key, English name, and price.');
      setProductIsSuccess(false);
      return;
    }
    try {
      let finalImageUrl = productForm.image_url;
      
      // Handle Image Upload if a file was selected
      if (productForm.imageFile) {
        const formData = new FormData();
        formData.append('image', productForm.imageFile);
        
        const uploadRes = await authFetch('./api/upload_image.php', {
          method: 'POST',
          body: formData
        });
        const uploadData = await uploadRes.json();
        
        if (uploadData.success) {
          finalImageUrl = uploadData.url;
        } else {
          setProductStatus(uploadData.message || 'Image upload failed.');
          setProductIsSuccess(false);
          return;
        }
      }

      // Handle Variant Image Uploads
      const uploadedVariants = [];
      if (productForm.variants && Array.isArray(productForm.variants)) {
        for (let v of productForm.variants) {
          let vImageUrl = v.image_url;
          if (v.imageFile) {
            const formData = new FormData();
            formData.append('image', v.imageFile);
            const uploadRes = await authFetch('./api/upload_image.php', { method: 'POST', body: formData });
            const uploadData = await uploadRes.json();
            if (uploadData.success) {
              vImageUrl = uploadData.url;
            }
          }
          uploadedVariants.push({ name: v.name, image_url: vImageUrl });
        }
      }

      const response = await authFetch('./api/save_product.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...productForm,
          image_url: finalImageUrl,
          variants: uploadedVariants,
          admin_phone: admin?.phone
        })
      });
      const result = await response.json();
      if (result.success) {
        setProductStatus(isEditing ? 'Product updated successfully.' : 'Product added successfully.');
        setProductIsSuccess(true);
        if (!isEditing) {
          handleCancelEdit();
        }
        fetchProducts();
      } else {
        setProductStatus(result.message || 'Failed to save product.');
        setProductIsSuccess(false);
      }
    } catch (err) {
      console.error(err);
      setProductStatus('Server error saving product.');
      setProductIsSuccess(false);
    }
  };

  const handleDeleteProduct = async (id) => {
    if (!window.confirm('Are you sure you want to delete this product?')) return;
    try {
      const response = await authFetch('./api/delete_product.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, admin_phone: admin?.phone })
      });
      const result = await response.json();
      if (result.success) {
        fetchProducts();
      } else {
        alert(result.message || 'Failed to delete product.');
      }
    } catch (err) {
      console.error(err);
      alert('Server error deleting product.');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center pt-16">
        <div className="flex flex-col items-center gap-4 animate-pulse">
          <span className="material-symbols-outlined text-5xl text-[#E8650A] animate-spin">cyclone</span>
          <p className="font-semibold">{language === 'hi' ? 'एडमिन पोर्टल लोड हो रहा है...' : 'Loading admin portal...'}</p>
        </div>
      </div>
    );
  }

  if (!admin) return null;

  return (
    <Routes>
      <Route index element={<DashboardOverview orders={orders} customers={customers} products={products} metrics={metrics} language={language} />} />
      <Route path="dashboard" element={<DashboardOverview orders={orders} customers={customers} products={products} metrics={metrics} language={language} />} />
      <Route path="products" element={
        <ProductsManagement
          language={language}
          products={products}
          productForm={productForm}
          setProductForm={setProductForm}
          isEditing={isEditing}
          setIsEditing={setIsEditing}
          productStatus={productStatus}
          productIsSuccess={productIsSuccess}
          handleSaveProduct={handleSaveProduct}
          handleEditProduct={handleEditProduct}
          handleDeleteProduct={handleDeleteProduct}
          handleCancelEdit={handleCancelEdit}
          handleAddNewProductClick={handleAddNewProductClick}
        />
      } />
      <Route path="rcc-projects" element={<RCCProjectsManagement language={language} user={admin} />} />
      <Route path="inventory" element={<InventoryShuttering language={language} products={products} fetchProducts={fetchProducts} user={admin} />} />
      <Route path="sales" element={<SalesReports language={language} orders={orders} metrics={metrics} />} />
      <Route path="orders" element={<OrdersManagement language={language} orders={orders} handleStatusChange={handleStatusChange} />} />
      <Route path="customers" element={
        <CustomersInquiries
          language={language}
          customers={customers}
          orders={orders}
          selectedCustomer={selectedCustomer}
          setSelectedCustomer={setSelectedCustomer}
          customerSearch={customerSearch}
          setCustomerSearch={setCustomerSearch}
        />
      } />
      <Route path="inquiries" element={
        <InquiriesManagement
          language={language}
          inquiries={inquiries}
        />
      } />
      <Route path="settings" element={<Settings user={admin} language={language} />} />
    </Routes>
  );
}
