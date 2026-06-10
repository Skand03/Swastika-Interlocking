import React, { useState, useEffect } from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';
import { useAuth } from '../auth/AuthContext';
import DashboardOverview from '../components/admin/DashboardOverview';
import ProductsManagement from '../components/admin/ProductsManagement';
import InventoryShuttering from '../components/admin/InventoryShuttering';
import SalesReports from '../components/admin/SalesReports';
import OrdersManagement from '../components/admin/OrdersManagement';
import CustomersInquiries from '../components/admin/CustomersInquiries';
import InquiriesManagement from '../components/admin/InquiriesManagement';
import Settings from '../components/admin/Settings';
import RCCProjectsManagement from '../components/admin/RCCProjectsManagement';

import { getAllProducts, createProduct, updateProduct, deleteProduct } from '../services/productService';
import { getAllOrders, updateOrderStatus } from '../services/orderService';
import { getAllInquiries } from '../services/inquiryService';
import { getAllCustomers } from '../services/customerService';
import { uploadImage } from '../services/uploadService';

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
    imageFile: null,
    desc_en: '',
    desc_hi: '',
    variants: [],
    spec_thickness: '',
    spec_weight: '',
    spec_strength: '',
    spec_color: '',
    spec_application: '',
    spec_material: '',
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

  const { profile: dbUser, loading: authLoading } = useAuth();

  const fetchProducts = async () => {
    try {
      const data = await getAllProducts();
      setProducts(data || []);
    } catch (err) {
      console.error("Error fetching products:", err);
    }
  };

  const fetchData = async () => {
    try {
      const [ordersData, inquiriesData, customersData] = await Promise.all([
        getAllOrders(),
        getAllInquiries(),
        getAllCustomers()
      ]);

      setOrders(ordersData || []);
      setInquiries(inquiriesData || []);
      setCustomers(customersData || []);
      
      if (customersData && customersData.length > 0) {
        setSelectedCustomer(customersData[0]);
      }
      if (inquiriesData && inquiriesData.length > 0) {
        setSelectedInquiry(inquiriesData[0]);
      }
      
      // Calculate metrics based on real data
      const totalSales = (ordersData || []).reduce((sum, ord) => sum + (parseFloat(ord.total_amount) || 0), 0);
      const newOrders = (ordersData || []).filter(o => o.status === 'Pending').length;
      const newCustomers = (customersData || []).length;
      
      setMetrics({ totalSales, newOrders, newCustomers, lowStock: 0 });
    } catch (err) {
      console.error("Error fetching admin stats:", err);
    } finally {
      setLoading(false);
    }
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
    fetchData();
  }, [navigate, dbUser, authLoading]);

  const handleStatusChange = async (orderId, newStatus) => {
    setUpdatingOrderId(orderId);
    try {
      await updateOrderStatus(orderId, newStatus);
      fetchData();
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
      imageFile: null,
      desc_en: '',
      desc_hi: '',
      variants: [],
      spec_thickness: '',
      spec_weight: '',
      spec_strength: '',
      spec_color: '',
      spec_application: '',
      spec_material: '',
    });
    setProductStatus('');
    const formElement = document.getElementById('product-form-container');
    if (formElement) formElement.scrollIntoView({ behavior: 'smooth' });
  };

  const handleEditProduct = (prod) => {
    setIsEditing(true);
    // Build price string from DB numeric fields
    const priceStr = prod.price_min && prod.price_max
      ? prod.price_min === prod.price_max
        ? String(prod.price_min)
        : `${prod.price_min}-${prod.price_max}`
      : String(prod.price_min || '');

    // Read specs from specifications jsonb
    const specs = prod.specifications || {};

    setProductForm({
      id: prod.id,
      product_key: prod.id,
      category: prod.division === 'shuttering' ? 'Shuttering' : 'Interlocking Blocks',
      name_en: prod.name_en || '',
      name_hi: prod.name_hi || '',
      price: priceStr,
      stock: prod.stock_quantity ?? '',
      image_url: prod.images && prod.images.length > 0 ? prod.images[0] : '',
      imageFile: null,
      desc_en: prod.description_en || '',
      desc_hi: prod.description_hi || '',
      variants: prod.specifications?.variants || [],
      // Spec fields
      spec_thickness: specs.thickness || '',
      spec_weight: specs.weight || '',
      spec_strength: specs.strength || '',
      spec_color: specs.color || '',
      spec_application: specs.application || '',
      spec_material: specs.material || '',
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
      imageFile: null,
      desc_en: '',
      desc_hi: '',
      variants: [],
      spec_thickness: '',
      spec_weight: '',
      spec_strength: '',
      spec_color: '',
      spec_application: '',
      spec_material: '',
    });
    setProductStatus('');
  };

  const handleSaveProduct = async () => {
    if (!productForm.name_en) {
      setProductStatus('Please fill in the product English name.');
      setProductIsSuccess(false);
      return;
    }

    try {
      // Upload main image if a new file was selected
      let finalImageUrl = productForm.image_url || '';
      if (productForm.imageFile) {
        try {
          finalImageUrl = await uploadImage(productForm.imageFile, 'products');
        } catch (err) {
          setProductStatus(`Image upload failed: ${err.message}`);
          setProductIsSuccess(false);
          return;
        }
      }

      // Upload variant images
      let processedVariants = [];
      if (productForm.variants && productForm.variants.length > 0) {
        for (const v of productForm.variants) {
          let variantUrl = v.image_url || '';
          if (v.imageFile) {
            try {
              variantUrl = await uploadImage(v.imageFile, 'products');
            } catch (e) {
              // variant image upload failed — skip silently
            }
          }
          processedVariants.push({ name: v.name, image_url: variantUrl });
        }
      }

      // Parse price — supports "55", "45-85", "₹45 - ₹85 / sq.ft"
      const rawPrice = String(productForm.price || '0');
      const nums = rawPrice.match(/\d+(\.\d+)?/g) || ['0'];
      const priceMin = parseFloat(nums[0]) || 0;
      const priceMax = parseFloat(nums[1] || nums[0]) || priceMin;

      // Determine division from category
      const divisionMap = {
        'Interlocking Blocks': 'building_materials',
        'Raw Materials': 'building_materials',
        'Pipes & Drainage': 'building_materials',
        'Shuttering': 'shuttering',
      };

      const productData = {
        name_en: productForm.name_en,
        name_hi: productForm.name_hi || productForm.name_en,
        description_en: productForm.desc_en || '',
        description_hi: productForm.desc_hi || '',
        price_min: priceMin,
        price_max: priceMax,
        price_unit: 'piece',
        stock_quantity: parseInt(productForm.stock) || 0,
        division: divisionMap[productForm.category] || 'building_materials',
        is_active: true,
        images: finalImageUrl ? [finalImageUrl] : [],
        // Store specs + variants inside specifications jsonb
        specifications: {
          variants: processedVariants,
          thickness: productForm.spec_thickness || '',
          weight: productForm.spec_weight || '',
          strength: productForm.spec_strength || '',
          color: productForm.spec_color || '',
          application: productForm.spec_application || '',
          material: productForm.spec_material || '',
        },
      };

      if (isEditing && productForm.id) {
        await updateProduct(productForm.id, productData);
      } else {
        await createProduct(productData);
      }

      setProductStatus(isEditing ? 'Product updated successfully.' : 'Product added successfully.');
      setProductIsSuccess(true);
      if (!isEditing) handleCancelEdit();
      fetchProducts();
    } catch (err) {
      console.error(err);
      setProductStatus(`Error: ${err.message}`);
      setProductIsSuccess(false);
    }
  };

  const handleDeleteProduct = async (id) => {
    if (!window.confirm('Are you sure you want to delete this product?')) return;
    try {
      await deleteProduct(id);
      fetchProducts();
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
