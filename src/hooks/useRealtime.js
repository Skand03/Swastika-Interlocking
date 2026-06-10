import { useEffect } from 'react';
import { supabase } from '../supabase/client';
import toast from 'react-hot-toast';

export const useNewOrders = (isAdmin) => {
  useEffect(() => {
    if (!isAdmin) return;

    const channel = supabase
      .channel('public:orders')
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'orders' },
        (payload) => {
          toast.success(`🛒 New order received! ${payload.new.order_number}`);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [isAdmin]);
};

export const useNewInquiries = (isAdmin) => {
  useEffect(() => {
    if (!isAdmin) return;

    const channel = supabase
      .channel('public:inquiries')
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'inquiries' },
        (payload) => {
          toast.success(`💬 New inquiry from ${payload.new.customer_name}`);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [isAdmin]);
};

export const useLowStock = (isAdmin) => {
  useEffect(() => {
    if (!isAdmin) return;

    const channel = supabase
      .channel('public:products')
      .on(
        'postgres_changes',
        { event: 'UPDATE', schema: 'public', table: 'products' },
        (payload) => {
          const product = payload.new;
          if (product.stock_quantity <= product.min_stock_alert) {
            toast.error(`⚠️ Low stock alert: ${product.name_en}`);
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [isAdmin]);
};

export const useRentalsDueToday = (isAdmin) => {
  useEffect(() => {
    if (!isAdmin) return;
    
    // Simulating a daily check for rentals due today.
    // Realtime doesn't easily trigger on "date passed" since it's an event listener for inserts/updates.
    // Instead, you would typically run a cron edge function to email admins or push a notification.
    // But for the frontend, we can fetch on load.
    const checkDueRentals = async () => {
      try {
        const today = new Date().toISOString().split('T')[0];
        const { data, error } = await supabase
          .from('shuttering_rentals')
          .select('rental_number, customer_name')
          .eq('end_date', today)
          .eq('status', 'active');
          
        if (error) {
          console.error('Error checking due rentals:', error);
          return;
        }
          
        if (data && data.length > 0) {
          toast.error(`⏰ ${data.length} shuttering rentals are due for return today!`);
        }
      } catch (err) {
        console.error('Error checking due rentals:', err);
      }
    };
    
    checkDueRentals();
  }, [isAdmin]);
};

export const useOrderStatus = (orderId, customerId) => {
  useEffect(() => {
    if (!orderId || !customerId) return;

    const channel = supabase
      .channel(`public:orders:${orderId}`)
      .on(
        'postgres_changes',
        { event: 'UPDATE', schema: 'public', table: 'orders', filter: `id=eq.${orderId}` },
        (payload) => {
          toast.success(`📦 Your order ${payload.new.order_number} status updated to: ${payload.new.status}`);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [orderId, customerId]);
};
