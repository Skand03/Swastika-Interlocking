export const notifyNewOrder = (orderData) => {
  const phone = import.meta.env.VITE_BUSINESS_WHATSAPP;
  const message = `🛒 *New Order Received*\n\nOrder No: ${orderData.order_number}\nCustomer: ${orderData.customer_name}\nTotal: ₹${orderData.total_amount}\n\nPlease check the admin dashboard for details.`;
  const url = `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
  window.open(url, '_blank');
};

export const notifyOrderStatus = (orderData) => {
  if (!orderData.customer_phone) return;
  // Ensure phone has country code
  let phone = orderData.customer_phone;
  if (!phone.startsWith('+')) {
    phone = '+91' + phone; // Assuming India default
  }
  phone = phone.replace(/[^0-9]/g, ''); // Clean non-numeric except we stripped +
  
  const message = `📦 *Swastika Interlocking*\n\nHello ${orderData.customer_name},\nYour order *${orderData.order_number}* status has been updated to: *${orderData.status}*.\n\nThank you for choosing us!`;
  const url = `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
  window.open(url, '_blank');
};

export const notifyRentalDue = (rentalData) => {
  if (!rentalData.customer_phone) return;
  let phone = rentalData.customer_phone;
  if (!phone.startsWith('+')) {
    phone = '+91' + phone;
  }
  phone = phone.replace(/[^0-9]/g, '');
  
  const message = `⏰ *Swastika Shuttering Rentals*\n\nHello ${rentalData.customer_name},\nThis is a gentle reminder that your rental *${rentalData.rental_number}* is due for return today.\n\nPlease contact us for extension or return.`;
  const url = `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
  window.open(url, '_blank');
};

export const generateOrderMessage = (order) => {
  // Can be used to display formatted text to copy-paste or pre-fill
  return `🛒 *Order ${order.order_number}*\nCustomer: ${order.customer_name}\nAmount: ₹${order.total_amount}`;
};

export const generateInquiryReply = (inquiry) => {
  return `Hello ${inquiry.customer_name},\n\nThank you for contacting Swastika Interlocking regarding ${inquiry.subject}.\n\n`;
};
