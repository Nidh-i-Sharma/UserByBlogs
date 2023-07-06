import express from 'express'
import jwt from 'jsonwebtoken'
import multer from 'multer';
const config = process.env;

const authenticateUser = (req, res, next) => {
    const token = req.header('Authorization');
  
    if (!token) {
      return res.status(401).json({ message: 'Unauthorized' });
    }
  
    try {
      const decodedToken = jwt.verify(token, JWT_SECRET);
      req.userId = decodedToken.userId;
      next();
    } catch (error) {
      console.error(error);
      res.status(401).json({ message: 'Invalid token' });
    }
};
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, 'uploads/');
    },
    filename: function (req, file, cb) {
      cb(null, Date.now() + '_' + file.originalname);
    },
  });
export const upload = multer({ storage: storage });

export default authenticateUser;