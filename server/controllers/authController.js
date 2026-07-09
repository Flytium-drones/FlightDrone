// controllers/authController.js
import User from '../models/User.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { hashPassword, comparePassword } from '../helpers/authHelper.js';
import Order from '../models/Order.js';
import Product from '../models/Product.js';

// User registration
export const registerUser = async (req, res) => {
  try {
    const { name, email, password, phone, address, answer } = req.body;
    if (!name || !email || !password || !phone || !address || !answer) {
      return res.status(400).send({ message: 'Please enter all fields' });
    }
    // Check if user already exists
    const userExists = await User.findOne({ email });
    if (userExists) return res.status(400).json({ message: 'User already exists' });

    // Hash the password
    const hashedPassword = await hashPassword(password);

    // Create a new user
    const user = new User({ name, email, password: hashedPassword, phone, address, answer });
    await user.save();

    res.status(201).json({
      success: true,
      message: 'User created successfully',
      user: user
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// User login
export const loginUser = async (req, res) => {

  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).send({ message: 'Please enter all fields' });
    }

    const cleanEmail = email.trim();
    const cleanPassword = password.trim();

    const user = await User.findOne({ email: cleanEmail });
    if (!user) return res.status(400).json({ message: 'Invalid email or password' });

    // Compare passwords
    const isMatch = await comparePassword(cleanPassword, user.password);
    if (!isMatch) return res.status(400).json({ message: 'Invalid email or password' });

    // Force role to 1 only if email matches ADMIN_EMAIL
    const dynamicRole = (cleanEmail === process.env.ADMIN_EMAIL) ? 1 : 0;

    // Create JWT token
    const token = jwt.sign({
      id: user._id,
      role: dynamicRole
    }, process.env.JWT_SECRET, { expiresIn: '7d' });

    res.status(200).json({
      success: true,
      message: 'User logged in successfully',
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        address: user.address,
        role: dynamicRole
      }, token
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


export const forgotPasswordController = async (req, res) => {
  try {

    const { email, answer, newPassword } = req.body;
    if (!email || !answer || !newPassword) {
      return res.status(400).send({ message: 'Please enter all fields' });
    }

    const user = await User.findOne({
      email,
      answer
    });
    if (!user) {
      return res.status(400).send({
        success: false,
        message: 'Invalid credentials'
      });
    }
    const hashedPassword = await hashPassword(newPassword);
    await User.findByIdAndUpdate(user._id, { password: hashedPassword });
    res.status(200).send({
      success: true,
      message: 'Password reset successful'
    });

  }
  catch (err) {
    console.log(err);
    res.status(500).send(
      {
        success: false,
        message: 'Error resetting password',
        error
      }
    );
  }
}

export const updateProfileController = async (req, res) => {
  try {
    const { name, email, phone, address, password } = req.body;
    const user
      = await User.findById(req.user.id);
    if (!user) {
      return res.status(400).send({ message: 'User not found' });
    }
    const hashedPassword = password ? await hashPassword(password) : undefined;
    const updatedUser = await User.findByIdAndUpdate(req.user.id, {
      name: name || user.name,
      password: hashedPassword || user.password,
      phone: phone || user.phone,
      address: address || user.address
    }
      , { new: true }

    );
    res.status(200).send({
      success: true,
      message: 'Profile updated successfully',
      updatedUser
    });
  }
  catch (err) {
    console.log(err);
    res.status(500).send({ message: 'Error updating profile' });
  }
}

export const getOrdersController = async (req, res) => {
  try {
    console.log(req.user.id);
    const orders = await Order.find({
      buyer: req.user.id,
    }).populate("products").populate("buyer", "name");
    res.status(200).json({ success: true, orders });
  }
  catch (error) {
    console.log(error);
    res.status(500).json({ success: false, error: error.message });
  }
}

export const getAllOrdersController = async (req, res) => {
  try {
    const orders = await Order.find().populate("products").populate("buyer", "name").sort({ createdAt: -1 });
    res.status(200).json({ success: true, orders });
  }
  catch (error) {
    console.log(error);
    res.status(500).json({ success: false, error: error.message });
  }
}

export const orderStatusController = async (req, res) => {
  try {
    const { orderId } = req.params;
    const { status } = req.body;
    const order = await Order.findByIdAndUpdate(orderId, { status }, { new: true });

    if (!order) {
      return res.status(404).json({
        success: false, message: 'Order not found'
      });
    }

    res.status(200).json({ success: true, message: 'Order status updated successfully', order });
  }
  catch (error) {
    console.log(error);
    res.status(500).json({ success: false, error: error.message });
  }

}

export const getAllUsersController = async (req, res) => {
  try {
    // Fetch all users but exclude sensitive information
    const users = await User.find({}, { password: 0, answer: 0 })
      .sort({ createdAt: -1 }); // Sort by newest first
    
    res.status(200).json({ 
      success: true, 
      users,
      total: users.length 
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ 
      success: false, 
      message: "Error fetching users",
      error: error.message 
    });
  }
};

// Optional: Add a controller to get user stats
export const getUserStatsController = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments({});
    const customerCount = await User.countDocuments({ role: 0 });
    const adminCount = await User.countDocuments({ role: 1 });
    
    // Get new users in last 30 days
    const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
    const newUsers = await User.countDocuments({
      createdAt: { $gte: thirtyDaysAgo }
    });

    res.status(200).json({
      success: true,
      stats: {
        total: totalUsers,
        customers: customerCount,
        admins: adminCount,
        newUsersLastMonth: newUsers
      }
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Error fetching user statistics",
      error: error.message
    });
  }
};

export const getDashboardStats = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalProducts = await Product.countDocuments();
    const totalOrders = await Order.countDocuments();
    
    // Get total revenue
    const orders = await Order.find();
    const totalRevenue = orders.reduce((acc, order) => acc + order.amount, 0);
    
    // Get recent orders
    const recentOrders = await Order.find()
      .populate('buyer', 'name')
      .sort({ createdAt: -1 })
      .limit(5);
    
    // Get monthly revenue for the last 6 months
    const monthlyRevenue = await Order.aggregate([
      {
        $group: {
          _id: { 
            month: { $month: "$createdAt" },
            year: { $year: "$createdAt" }
          },
          total: { $sum: "$amount" }
        }
      },
      { $sort: { "_id.year": -1, "_id.month": -1 } },
      { $limit: 6 }
    ]);

    res.json({
      totalUsers,
      totalProducts,
      totalOrders,
      totalRevenue,
      recentOrders,
      monthlyRevenue: monthlyRevenue.map(item => item.total)
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ 
      success: false, 
      message: "Error fetching dashboard stats",
      error: error.message 
    });
  }
};