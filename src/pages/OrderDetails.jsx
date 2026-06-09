import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { API_BASE } from "../config";

// Google Font import can be added in index.html; here we just use class names.

export default function OrderDetails({ language }) {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!id) return;
    const fetchOrder = async () => {
      try {
        const res = await fetch(`${API_BASE}/api/get_order.php?id=${id}`);
        const data = await res.json();
        if (data.success && data.order) {
          setOrder(data.order);
        } else {
          setError(data.message || 'Failed to load order');
        }
      } catch (err) {
        console.error('Error fetching order:', err);
        setError('Network error while fetching order');
      } finally {
        setLoading(false);
      }
    };
    fetchOrder();
  }, [id]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-xl font-medium">{language === 'hi' ? 'लोड हो रहा है...' : 'Loading...'}</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-red-600 text-lg">{error}</p>
      </div>
    );
  }

  // Destructure order fields; adjust based on DB schema
  const {
    order_id,
    customer_name,
    phone,
    city,
    address,
    special_req,
    product_id,
    quantity,
    image_path,
    status,
    created_at,
  } = order;

  // Helper to format date
  const formatDate = (dateStr) => {
    const d = new Date(dateStr);
    return d.toLocaleString(language === 'hi' ? 'hi-IN' : 'en-US');
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white bg-opacity-70 backdrop-filter backdrop-blur-lg rounded-xl shadow-lg my-8">
      <h1 className="text-3xl font-bold mb-4 text-gray-800">{language === 'hi' ? 'ऑर्डर विवरण' : 'Order Details'}</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <p><span className="font-semibold">{language === 'hi' ? 'ऑर्डर ID' : 'Order ID'}:</span> {order_id}</p>
          <p><span className="font-semibold">{language === 'hi' ? 'ग्राहक' : 'Customer'}:</span> {customer_name}</p>
          <p><span className="font-semibold">{language === 'hi' ? 'फ़ोन' : 'Phone'}:</span> {phone}</p>
          <p><span className="font-semibold">{language === 'hi' ? 'शहर/गाँव' : 'City/Village'}:</span> {city}</p>
          <p><span className="font-semibold">{language === 'hi' ? 'पता' : 'Address'}:</span> {address}</p>
          <p><span className="font-semibold">{language === 'hi' ? 'विशेष अनुरोध' : 'Special Request'}:</span> {special_req || '-'}
          </p>
          <p><span className="font-semibold">{language === 'hi' ? 'उत्पाद ID' : 'Product ID'}:</span> {product_id}</p>
          <p><span className="font-semibold">{language === 'hi' ? 'मात्रा' : 'Quantity'}:</span> {quantity}</p>
          <p><span className="font-semibold">{language === 'hi' ? 'स्थिति' : 'Status'}:</span> {status || '-'}
          </p>
          <p><span className="font-semibold">{language === 'hi' ? 'बनाने की तिथि' : 'Created At'}:</span> {formatDate(created_at)}</p>
        </div>
        {image_path && (
          <div className="flex items-center justify-center">
            <img
              src={image_path.startsWith('http') ? image_path : `./uploads/orders/${image_path}`}
              alt="Order"
              className="max-w-full h-auto rounded-lg shadow-md object-cover"
            />
          </div>
        )}
      </div>
    </div>
  );
}
