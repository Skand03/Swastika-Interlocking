/**
 * Email Service
 * 
 * Handles dispatching emails (Welcome, Forgot Password, Order Confirmations).
 * Since this is a frontend-only application, this service acts as a wrapper.
 * In a production environment, you should connect this to:
 * 1. Supabase Edge Functions (recommended)
 * 2. An EmailJS account
 * 3. A custom backend API
 */

export const sendWelcomeEmail = async (email, name) => {
  console.log(`[Email Service] Sending Welcome Email to: ${email}`);
  
  const payload = {
    to: email,
    subject: 'Welcome to Swastika Interlocking!',
    template_data: {
      customer_name: name || 'Customer',
      company_name: 'Swastika Interlocking',
      support_email: 'support@swastikainterlocking.com'
    }
  };

  try {
    // Placeholder implementation. 
    // Replace this block with your actual API call.
    // Example using Supabase Edge Functions:
    // const { data, error } = await supabase.functions.invoke('send-email', { body: payload });
    // if (error) throw error;
    
    // Simulate network request
    await new Promise(resolve => setTimeout(resolve, 800));
    
    console.log('[Email Service] Welcome email sent successfully', payload);
    return { success: true };
  } catch (error) {
    console.error('[Email Service] Failed to send welcome email', error);
    return { success: false, error };
  }
};

export const sendOrderConfirmationEmail = async (email, orderDetails) => {
  console.log(`[Email Service] Sending Order Confirmation to: ${email}`);
  
  try {
    // Simulate network request
    await new Promise(resolve => setTimeout(resolve, 800));
    console.log('[Email Service] Order confirmation email sent successfully');
    return { success: true };
  } catch (error) {
    console.error('[Email Service] Failed to send order confirmation', error);
    return { success: false, error };
  }
};
