import Razorpay from "razorpay";
import crypto from "crypto";
import Order from "../models/Order.js";
import Product from "../models/Product.js";
import Cart from "../models/Cart.js";
import User from "../models/User.js";
import StoreHero from "../models/StoreHero.js";
import { 
  sendOrderConfirmationEmail, 
  sendOrderNotificationToAdmin,
  sendOrderStatusUpdateEmail 
} from "../services/emailService.js";

const RAZORPAY_KEY = process.env.RAZORPAY_KEY;
const RAZORPAY_SECRET = process.env.RAZORPAY_SECRET;

// Validate Razorpay credentials
if (!RAZORPAY_KEY || !RAZORPAY_SECRET) {
  console.error("Razorpay credentials not found in environment variables");
}

const razorpay = new Razorpay({
  key_id: RAZORPAY_KEY,
  key_secret: RAZORPAY_SECRET,
});

// Create Razorpay order with comprehensive validation
export const createOrder = async (req, res) => {
  try {
    const { useCart = false, products, cartItems, totalAmount, shippingAddress } = req.body;
    const userId = req.user.id;

    console.log("=== CREATE ORDER DEBUG ===");
    console.log("Request body:", req.body);
    console.log("User ID:", userId);

    let orderProducts = [];
    let calculatedTotal = 0;

    if (useCart) {
      // Use cart items from frontend localStorage
      if (!cartItems || !Array.isArray(cartItems) || cartItems.length === 0) {
        return res.status(400).json({
          success: false,
          message: "Cart is empty"
        });
      }

      // Validate stock availability for all cart items
      for (const item of cartItems) {
        let product = await Product.findById(item._id);
        if (!product) {
          const hero = await StoreHero.findById(item._id);
          if (hero) {
            product = {
              _id: hero._id,
              name: item.name || hero.title,
              description: hero.description,
              price: item.price || hero.discountedPrice || hero.price,
              image: hero.image,
              quantity: 9999
            };
          }
        }
        if (!product) {
          return res.status(400).json({
            success: false,
            message: `Product ${item.name || 'unknown'} no longer available`
          });
        }
        
        if (product.quantity < item.quantity) {
          return res.status(400).json({
            success: false,
            message: `Insufficient stock for ${product.name}. Only ${product.quantity} available.`
          });
        }

        orderProducts.push({
          product: product._id,
          name: product.name,
          description: product.description,
          price: item.price || product.price,
          quantity: item.quantity,
          image: product.image
        });

        calculatedTotal += (item.price || product.price) * item.quantity;
      }
    } else {
      // Use products from request body
      if (!products || !Array.isArray(products) || products.length === 0) {
        return res.status(400).json({
          success: false,
          message: "Products are required"
        });
      }

      // Validate and calculate total from provided products
      for (const item of products) {
        let product = await Product.findById(item._id || item.product);
        if (!product) {
          const hero = await StoreHero.findById(item._id || item.product);
          if (hero) {
            product = {
              _id: hero._id,
              name: item.name || hero.title,
              description: hero.description,
              price: item.price || hero.discountedPrice || hero.price,
              image: hero.image,
              quantity: 9999
            };
          }
        }
        if (!product) {
          return res.status(400).json({
            success: false,
            message: `Product ${item.name || 'unknown'} not found`
          });
        }
        
        if (product.quantity < (item.quantity || 1)) {
          return res.status(400).json({
            success: false,
            message: `Insufficient stock for ${product.name}`
          });
        }

        orderProducts.push({
          product: product._id,
          name: product.name,
          description: product.description,
          price: item.price || product.price,
          quantity: item.quantity || 1,
          image: product.image
        });

        calculatedTotal += (item.price || product.price) * (item.quantity || 1);
      }
    }

    // Validate shipping address
    if (!shippingAddress || !shippingAddress.address || !shippingAddress.city || !shippingAddress.phone) {
      return res.status(400).json({
        success: false,
        message: "Complete shipping address is required"
      });
    }

    // Validate total amount
    const providedTotal = totalAmount || calculatedTotal;
    if (Math.abs(providedTotal - calculatedTotal) > 1) { // Allow 1 rupee difference for rounding
      return res.status(400).json({
        success: false,
        message: "Total amount mismatch"
      });
    }

    // Create Razorpay order - receipt must be <= 40 chars
    const timestamp = Date.now().toString().slice(-10); // Last 10 digits
    const userIdShort = userId.substring(0, 8); // First 8 chars of user ID
    const receipt = `ord_${userIdShort}_${timestamp}`; // Total: ~25 chars
    
    const options = {
      amount: Math.round(calculatedTotal * 100), // Convert to paise
      currency: "INR",
      receipt: receipt,
      notes: {
        userId: userId.toString(),
        orderType: useCart ? 'cart' : 'direct'
      }
    };

    console.log("Razorpay order options:", options);

    let razorpayOrder;
    try {
      razorpayOrder = await razorpay.orders.create(options);
      console.log("Razorpay order created:", razorpayOrder);
    } catch (razorpayError) {
      console.error("Razorpay API Error Details:", {
        statusCode: razorpayError.statusCode,
        error: razorpayError.error,
        message: razorpayError.message
      });
      
      if (razorpayError.statusCode === 401) {
        return res.status(400).json({
          success: false,
          message: "Razorpay authentication failed. Please check your API keys.",
          error: "Invalid Razorpay credentials"
        });
      }
      
      throw razorpayError;
    }

    res.json({
      success: true,
      key_id: RAZORPAY_KEY,
      amount: razorpayOrder.amount,
      currency: razorpayOrder.currency,
      id: razorpayOrder.id,
      receipt: razorpayOrder.receipt,
      orderDetails: {
        products: orderProducts,
        totalAmount: calculatedTotal,
        shippingAddress
      }
    });
  } catch (error) {
    console.error("Create order error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to create order",
      error: error.message,
    });
  }
};

// Verify payment and store order in DB with enhanced validation
export const verifyPayment = async (req, res) => {
  try {
    const { 
      razorpay_order_id, 
      razorpay_payment_id, 
      razorpay_signature,
      orderDetails 
    } = req.body;
    const userId = req.user.id;

    console.log("=== VERIFY PAYMENT DEBUG ===");
    console.log("Payment verification data:", req.body);
    console.log("User ID:", userId);

    // Validate required fields
    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return res.status(400).json({
        success: false,
        message: "Missing payment verification data"
      });
    }

    if (!orderDetails || !orderDetails.products || !orderDetails.shippingAddress) {
      return res.status(400).json({
        success: false,
        message: "Missing order details"
      });
    }

    // Verify payment signature
    const body = razorpay_order_id + "|" + razorpay_payment_id;
    const expectedSignature = crypto
      .createHmac("sha256", RAZORPAY_SECRET)
      .update(body.toString())
      .digest("hex");

    if (expectedSignature !== razorpay_signature) {
      console.error("Payment signature verification failed");
      return res.status(400).json({
        success: false,
        message: "Payment verification failed"
      });
    }

    // Get user details
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found"
      });
    }

    // Final stock validation before creating order
    for (const item of orderDetails.products) {
      const product = await Product.findById(item.product);
      if (!product) {
        return res.status(400).json({
          success: false,
          message: `Product ${item.name} no longer available`
        });
      }
      
      if (product.quantity < item.quantity) {
        return res.status(400).json({
          success: false,
          message: `Insufficient stock for ${product.name}`
        });
      }
    }

    // Create order in database
    const newOrder = new Order({
      products: orderDetails.products,
      payment: {
        razorpay_order_id,
        razorpay_payment_id,
        razorpay_signature,
        amount: orderDetails.totalAmount,
        currency: "INR",
        status: "completed"
      },
      buyer: {
        _id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone
      },
      shippingAddress: orderDetails.shippingAddress,
      totalAmount: orderDetails.totalAmount,
      status: "Processing"
    });

    await newOrder.save();

    // Update product quantities
    for (const item of orderDetails.products) {
      await Product.findByIdAndUpdate(
        item.product,
        { $inc: { quantity: -item.quantity } },
        { new: true }
      );
    }

    // Clear user's cart if order was created from cart
    if (req.body.useCart) {
      await Cart.findOneAndUpdate(
        { user: userId },
        { items: [] }
      );
    }

    console.log("Order created successfully:", newOrder._id);

    // Send email notifications (don't block the response if email fails)
    Promise.all([
      sendOrderConfirmationEmail(newOrder),
      sendOrderNotificationToAdmin(newOrder)
    ]).then(results => {
      console.log("Email notifications sent:", results);
    }).catch(error => {
      console.error("Error sending email notifications:", error);
    });

    res.status(200).json({ 
      success: true, 
      message: "Payment verified and order created successfully",
      order: newOrder 
    });
  } catch (error) {
    console.error("Verify payment error:", error);
    res.status(500).json({ 
      success: false, 
      message: "Payment verification failed",
      error: error.message 
    });
  }
};

// Get user orders
export const getUserOrders = async (req, res) => {
  try {
    const userId = req.user.id;
    
    console.log("=== GET USER ORDERS DEBUG ===");
    console.log("User ID:", userId);
    
    // Try both possible query formats
    const orders = await Order.find({ "buyer._id": userId })
      .sort({ createdAt: -1 })
      .populate('products.product');
    
    console.log("Orders found:", orders.length);
    console.log("Orders:", orders);

    res.status(200).json({
      success: true,
      orders,
      message: "Orders fetched successfully"
    });
  } catch (error) {
    console.error("Get user orders error:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching orders",
      error: error.message
    });
  }
};

// Get all orders (Admin only)
export const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find()
      .sort({ createdAt: -1 })
      .populate('products.product');

    console.log("=== GET ALL ORDERS DEBUG ===");
    console.log("Total orders found:", orders.length);
    console.log("Orders:", JSON.stringify(orders, null, 2));

    res.status(200).json({
      success: true,
      orders,
      message: "All orders fetched successfully"
    });
  } catch (error) {
    console.error("Get all orders error:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching orders",
      error: error.message
    });
  }
};

// Update order status (Admin only)
export const updateOrderStatus = async (req, res) => {
  try {
    const { orderId } = req.params;
    const { status } = req.body;

    const validStatuses = ['Processing', 'Shipped', 'Delivered', 'Cancelled'];
    
    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Invalid order status"
      });
    }

    // Get current order to track previous status
    const currentOrder = await Order.findById(orderId);
    if (!currentOrder) {
      return res.status(404).json({
        success: false,
        message: "Order not found"
      });
    }

    const previousStatus = currentOrder.status;

    const order = await Order.findByIdAndUpdate(
      orderId,
      { status, updatedAt: new Date() },
      { new: true }
    );

    // Send status update email if status actually changed
    if (previousStatus !== status) {
      sendOrderStatusUpdateEmail(order, previousStatus).catch(error => {
        console.error("Error sending status update email:", error);
      });
    }

    res.status(200).json({
      success: true,
      order,
      message: "Order status updated successfully"
    });
  } catch (error) {
    console.error("Update order status error:", error);
    res.status(500).json({
      success: false,
      message: "Error updating order status",
      error: error.message
    });
  }
};
