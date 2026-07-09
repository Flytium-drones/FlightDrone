import JWT from 'jsonwebtoken';
import User from '../models/User.js';
export const requireSignIn = async (req, res, next) => {
  try {
    const authHeader = req.header('Authorization');
    if (!authHeader) {
      throw new Error("No Authorization header");
    }
    const token = authHeader.replace('Bearer ', '');
    const decoded = JWT.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  }
  catch (err) {
    if (err.name === 'TokenExpiredError') {
      return res.status(401).send({ message: 'Session expired. Please log in again.' });
    }
    res.status(401).send({ message: 'Please authenticate' });
  }
}


export const isAdmin = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);
    if (user.role !== 1) {
      return res.status(403).send({
        success: false,
        message: 'You are not authorized to access this route'

      });
    }

    next();


  }
  catch (err) {
    console.log(err);
    res.status(500).send({ message: 'Error authorizing user' });
  }
}

