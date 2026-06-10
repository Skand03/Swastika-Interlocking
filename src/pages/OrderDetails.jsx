import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getOrderById } from '../services/orderService';

export default function OrderDetails({ language }) {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!id) return;
    const fetchOrder = async () => {
      try {
        const data = await getOrderById(id);
        setOrder(data);
      } catch (err) {
        console.error('Error fetching order:', err);
        setError('Order not found');
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

  if (error || !order) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-red-600 text-lg">{error || 'Order not found'}</p>
      </div>
    );
  }

  const { order_number, customer_name, customer_phone, delivery_city, delivery_address, admin_notes, items, total_amount, status, created_at } = order;

  const formatDate = (dateStr) => {
    const d = new Date(dateStr);
    return d.toLocaleString(language === 'hi' ? 'hi-IN' : 'en-US');
  };

  const statusColors = {
    new: 'bg-blue-100 text-blue-700',
    confirmed: 'bg-purple-100 text-purple-700',
    processing: 'bg-yellow-100 text-yellow-700',
    dispatched: 'bg-orange-100 text-orange-700',
    delivered: 'bg-green-100 text-green-700',
    cancelled: 'bg-red-100 text-red-700',
  };

  return (
    <div className="max-w-4xl mx-auto p-6 pt-28 min-h-screen">
      <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-orange-600 to-orange-500 p-6 text-white">
          <h1 className="text-2xl font-bold">{language === 'hi' ? 'ऑर्डर विवरण' : 'Order Details'}</h1>
          <p className="text-orange-100 text-sm mt-1">{order_number}</p>
        </div>

        <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Customer Info */}
          <div className="space-y-3">
            <h2 className="font-bold text-gray-700 border-b pb-2">{language === 'hi' ? 'ग्राहक जानकारी' : 'Customer Info'}</h2>
            <p><span className="font-semibold text-gray-600">{language === 'hi' ? 'नाम:' : 'Name:'}</span> {customer_name}</p>
            <p><span className="font-semibold text-gray-600">{language === 'hi' ? 'फ़ोन:' : 'Phone:'}</span> {customer_phone}</p>
            <p><span className="font-semibold text-gray-600">{language === 'hi' ? 'शहर:' : 'City:'}</span> {delivery_city}</p>
            <p><span className="font-semibold text-gray-600">{language === 'hi' ? 'पता:' : 'Address:'}</span> {delivery_address}</p>
            {admin_notes && <p><span className="font-semibold text-gray-600">{language === 'hi' ? 'नोट:' : 'Note:'}</span> {admin_notes}</p>}
          </div>

          {/* Order Info */}
          <div className="space-y-3">
            <h2 className="font-bold text-gray-700 border-b pb-2">{language === 'hi' ? 'ऑर्डर जानकारी' : 'Order Info'}</h2>
            <p>
              <span className="font-semibold text-gray-600">{language === 'hi' ? 'स्थिति:' : 'Status:'}</span>{' '}
              <span className={`inline-block px-2 py-0.5 rounded-full text-sm font-medium ${statusColors[status] || 'bg-gray-100 text-gray-700'}`}>
                {status}
              </span>
            </p>
            <p><span className="font-semibold text-gray-600">{language === 'hi' ? 'कुल राशि:' : 'Total:'}</span> ₹{total_amount?.toLocaleString('en-IN') || '—'}</p>
            <p><span className="font-semibold text-gray-600">{language === 'hi' ? 'दिनांक:' : 'Date:'}</span> {formatDate(created_at)}</p>
          </div>
        </div>

        {/* Items */}
        {items && Array.isArray(items) && items.length > 0 && (
          <div className="px-6 pb-6">
            <h2 className="font-bold text-gray-700 border-b pb-2 mb-4">{language === 'hi' ? 'आइटम' : 'Items'}</h2>
            <div className="space-y-2">
              {items.map((item, i) => (
                <div key={i} className="flex justify-between items-center bg-gray-50 p-3 rounded-lg">
                  <div>
                    <p className="font-medium text-gray-800">{item.product_name}</p>
                    {item.sub_type && <p className="text-xs text-gray-500">{item.sub_type}</p>}
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-gray-600">{language === 'hi' ? 'मात्रा:' : 'Qty:'} {item.quantity}</p>
                    {item.price > 0 && <p className="text-sm font-medium text-orange-600">₹{(item.price * item.quantity).toLocaleString('en-IN')}</p>}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
