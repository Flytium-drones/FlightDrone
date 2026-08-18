import mongoose from 'mongoose';

const orderSchema = new mongoose.Schema({
  products: [
    {
      product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
      name: { type: String, required: true },
      description: { type: String },
      price: { type: Number, required: true },
      quantity: { type: Number, required: true, min: 1 },
      image: { type: String }
    }
  ],
  payment: {
    razorpay_order_id: { type: String },
    razorpay_payment_id: { type: String },
    razorpay_signature: { type: String },
    amount: { type: Number, required: true },
    currency: { type: String, default: 'INR' },
    status: { type: String, default: 'completed' },
    method: { type: String, default: 'Online' }
  },
  buyer: {
    _id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    name: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, required: true }
  },
  shippingAddress: {
    name: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, required: true },
    address: { type: String, required: true },
    city: { type: String, required: true },
    state: { type: String, required: true },
    pincode: { type: String, required: true },
    country: { type: String, default: 'India' }
  },
  status: { 
    type: String, 
    default: 'Processing', 
    enum: ['Processing', 'Confirmed', 'Shipped', 'Delivered', 'Cancelled'] 
  },
  totalAmount: { type: Number, required: true },
  cancelReason: { type: String }
}, { timestamps: true });


const Order = mongoose.model('Orders', orderSchema);

export default Order;
