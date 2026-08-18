import nodemailer from 'nodemailer';

// Configure email transporter
const createTransporter = () => {
  return nodemailer.createTransport({
    service: 'gmail', // You can change this to your preferred email service
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
    }
  });
};

// Send order confirmation email to customer
export const sendOrderConfirmationEmail = async (order) => {
  try {
    const transporter = createTransporter();
    
    const customerEmailHTML = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <title>Order Confirmation - Flytium Drones</title>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
          .header h1 { margin: 0; font-size: 28px; }
          .content { background: white; padding: 30px; border: 1px solid #ddd; }
          .order-info { background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0; }
          .product-item { border-bottom: 1px solid #eee; padding: 15px 0; display: flex; align-items: center; }
          .product-item:last-child { border-bottom: none; }
          .product-image { width: 80px; height: 80px; object-fit: cover; border-radius: 8px; margin-right: 15px; }
          .product-details { flex: 1; }
          .product-name { font-weight: bold; margin-bottom: 5px; }
          .product-price { color: #28a745; font-weight: bold; }
          .total-section { background: #e9ecef; padding: 20px; border-radius: 8px; margin-top: 20px; }
          .total-amount { font-size: 24px; font-weight: bold; color: #28a745; text-align: center; }
          .footer { background: #f8f9fa; padding: 20px; text-align: center; border-radius: 0 0 10px 10px; }
          .btn { background: #667eea; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block; margin: 10px 0; }
          @media (max-width: 600px) { .container { padding: 10px; } .product-item { flex-direction: column; text-align: center; } .product-image { margin-bottom: 10px; } }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>🎉 Order Confirmed!</h1>
            <p>Thank you for shopping with Flytium Drones</p>
          </div>
          
          <div class="content">
            <h2>Hello ${order.buyer.name},</h2>
            <p>We're excited to confirm that your order has been successfully placed and payment has been received!</p>
            
            <div class="order-info">
              <h3>Order Details</h3>
              <p><strong>Order ID:</strong> #${order._id.toString().slice(-8).toUpperCase()}</p>
              <p><strong>Order Date:</strong> ${new Date(order.orderDate).toLocaleDateString('en-IN', {
                day: 'numeric',
                month: 'long',
                year: 'numeric'
              })}</p>
              <p><strong>Payment Status:</strong> <span style="color: #28a745;">✅ Paid</span></p>
              <p><strong>Order Status:</strong> ${order.status}</p>
            </div>
            
            <h3>Items Ordered:</h3>
            ${order.products.map(item => `
              <div class="product-item">
                <img src="${item.image}" alt="${item.name}" class="product-image" onerror="this.src='https://via.placeholder.com/80x80?text=Product'">
                <div class="product-details">
                  <div class="product-name">${item.name}</div>
                  <div>Quantity: ${item.quantity}</div>
                  <div class="product-price">₹${item.price.toLocaleString()} each</div>
                </div>
                <div style="font-weight: bold;">₹${(item.price * item.quantity).toLocaleString()}</div>
              </div>
            `).join('')}
            
            <div class="total-section">
              <div class="total-amount">Total: ₹${order.totalAmount.toLocaleString()}</div>
            </div>
            
            <h3>Shipping Address:</h3>
            <div class="order-info">
              <p>${order.shippingAddress.address}</p>
              <p>${order.shippingAddress.city}, ${order.shippingAddress.state || ''} ${order.shippingAddress.pincode || ''}</p>
              <p>Phone: ${order.shippingAddress.phone}</p>
            </div>
            
            <p>We'll send you another email with tracking information once your order ships.</p>
            
            <div style="text-align: center; margin: 30px 0;">
              <a href="https://flytiumdrones.com/dashboard/user/orders" class="btn">Track Your Order</a>
            </div>
          </div>
          
          <div class="footer">
            <p>Thank you for choosing Flytium Drones!</p>
            <p>For any questions, contact us at support@flytiumdrones.com</p>
            <p>© 2025 Flytium Drones. All rights reserved.</p>
          </div>
        </div>
      </body>
      </html>
    `;

    const customerMailOptions = {
      from: `"Flytium Drones" <${process.env.EMAIL_USER}>`,
      to: order.buyer.email,
      subject: `Order Confirmation - #${order._id.toString().slice(-8).toUpperCase()}`,
      html: customerEmailHTML
    };

    await transporter.sendMail(customerMailOptions);
    console.log(`Order confirmation email sent to: ${order.buyer.email}`);
    
    return { success: true, message: 'Customer email sent successfully' };
  } catch (error) {
    console.error('Error sending customer email:', error);
    return { success: false, error: error.message };
  }
};

// Send order notification email to admin
export const sendOrderNotificationToAdmin = async (order) => {
  try {
    const transporter = createTransporter();
    
    const adminEmailHTML = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <title>New Order Alert - Flytium Drones</title>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #ff6b6b 0%, #ee5a24 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
          .header h1 { margin: 0; font-size: 28px; }
          .content { background: white; padding: 30px; border: 1px solid #ddd; text-align: center; }
          .date-info { font-size: 18px; margin-top: 20px; font-weight: bold; }
          .footer { background: #f8f9fa; padding: 20px; text-align: center; border-radius: 0 0 10px 10px; }
          .btn { background: #ee5a24; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block; margin: 30px 0; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>🔔 New Order Alert!</h1>
          </div>
          
          <div class="content">
            <h2>A new order has been placed.</h2>
            <div class="date-info">
              Date: ${new Date(order.orderDate || order.createdAt).toLocaleDateString('en-IN', {
                day: 'numeric',
                month: 'long',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
              })}
            </div>
            
            <a href="https://flytiumdrones.com/admin/orders" class="btn">View Order Details</a>
          </div>
          
          <div class="footer">
            <p>Flytium Drones Admin System</p>
          </div>
        </div>
      </body>
      </html>
    `;

    const adminMailOptions = {
      from: `"Flytium Drones System" <${process.env.EMAIL_USER}>`,
      to: process.env.ADMIN_EMAIL || process.env.EMAIL_USER,
      subject: `🔔 New Order Alert - #${order._id.toString().slice(-8).toUpperCase()} - ₹${order.totalAmount.toLocaleString()}`,
      html: adminEmailHTML
    };

    await transporter.sendMail(adminMailOptions);
    console.log(`Order notification email sent to admin`);
    
    return { success: true, message: 'Admin email sent successfully' };
  } catch (error) {
    console.error('Error sending admin email:', error);
    return { success: false, error: error.message };
  }
};

// Send order status update email
export const sendOrderStatusUpdateEmail = async (order, previousStatus) => {
  try {
    const transporter = createTransporter();
    
    const getStatusIcon = (status) => {
      switch (status) {
        case 'Processing': return '⏳';
        case 'Shipped': return '🚚';
        case 'Delivered': return '✅';
        case 'Cancelled': return '❌';
        default: return '📦';
      }
    };

    const statusUpdateHTML = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <title>Order Status Update - Flytium Drones</title>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
          .header h1 { margin: 0; font-size: 28px; }
          .content { background: white; padding: 30px; border: 1px solid #ddd; }
          .status-update { background: #d4edda; border: 1px solid #c3e6cb; padding: 20px; border-radius: 8px; margin: 20px 0; text-align: center; }
          .order-info { background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0; }
          .footer { background: #f8f9fa; padding: 20px; text-align: center; border-radius: 0 0 10px 10px; }
          .btn { background: #667eea; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block; margin: 10px 0; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>${getStatusIcon(order.status)} Order Update</h1>
            <p>Your order status has been updated</p>
          </div>
          
          <div class="content">
            <h2>Hello ${order.buyer.name},</h2>
            <p>We have an update on your order:</p>
            
            <div class="status-update">
              <h3>Status Changed: ${previousStatus} → ${order.status}</h3>
              <p style="font-size: 18px; margin: 10px 0;">${getStatusIcon(order.status)} <strong>${order.status}</strong></p>
            </div>
            
            <div class="order-info">
              <h3>Order Details</h3>
              <p><strong>Order ID:</strong> #${order._id.toString().slice(-8).toUpperCase()}</p>
              <p><strong>Order Date:</strong> ${new Date(order.orderDate).toLocaleDateString('en-IN')}</p>
              <p><strong>Total Amount:</strong> ₹${order.totalAmount.toLocaleString()}</p>
            </div>
            
            ${order.status === 'Delivered' ? `
              <div style="background: #d1ecf1; border: 1px solid #bee5eb; padding: 20px; border-radius: 8px; margin: 20px 0;">
                <h3>🎉 Order Delivered Successfully!</h3>
                <p>Thank you for shopping with us. We hope you love your purchase!</p>
                <p>Please consider leaving a review to help other customers.</p>
              </div>
            ` : ''}
            
            <div style="text-align: center; margin: 30px 0;">
              <a href="https://flytiumdrones.com/dashboard/user/orders" class="btn">View Order Details</a>
            </div>
          </div>
          
          <div class="footer">
            <p>Thank you for choosing Flytium Drones!</p>
            <p>For any questions, contact us at support@flytiumdrones.com</p>
            <p>© 2025 Flytium Drones. All rights reserved.</p>
          </div>
        </div>
      </body>
      </html>
    `;

    const mailOptions = {
      from: `"Flytium Drones" <${process.env.EMAIL_USER}>`,
      to: order.buyer.email,
      subject: `Order Update - #${order._id.toString().slice(-8).toUpperCase()} is now ${order.status}`,
      html: statusUpdateHTML
    };

    await transporter.sendMail(mailOptions);
    console.log(`Status update email sent to: ${order.buyer.email}`);
    
    return { success: true, message: 'Status update email sent successfully' };
  } catch (error) {
    console.error('Error sending status update email:', error);
    return { success: false, error: error.message };
  }
};