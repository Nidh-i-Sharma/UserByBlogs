import { mongo } from 'mongoose';
import User from '../model/userModal.js'
import bcrypt from 'bcrypt'
import  jwt from 'jsonwebtoken'
import * as dotenv from 'dotenv'
dotenv.config()

const JWT_KEY = process.env.JWT_KEY;

export const addUser = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        if (!(email && password && email)) {
            res.status(400).send("All input is required");
        }

        const alreadyExist = await User.findOne({ email });

        if (alreadyExist) {
            return res.status(409).send("User Already Exist. Please Login");
        }

        //Encrypt user password
        encryptedPassword = await bcrypt.hash(password, 10);

        const user = await User.create({
            name,
            email: email.toLowerCase(), // sanitize: convert email to lowercase
            password: encryptedPassword,
        });

        // Create token
        const token = jwt.sign({ userId: user._id }, JWT_KEY, { expiresIn: '1h' });

        res.status(200).json({ message: "User Created Successfully", data: user });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Internal Server Error", error: JSON.stringify(error), success: false })
    }
}
export const loginUser = async (req, res) => {
    const { email, password } = req.body;

    try {
        // Check if user exists with the provided email
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(401).json({ message: 'Invalid email or password' });
        }

        // Compare the provided password with the hashed password in the database
        const passwordMatch = await bcrypt.compare(password, user.password);
        if (!passwordMatch) {
            return res.status(401).json({ message: 'Invalid email or password' });
        }

        // Generate JWT token
        const token = jwt.sign({ userId: user._id }, JWT_KEY, { expiresIn: '1h' });

        res.status(200).json({ message: "Logged In successfully", data: { user, token } });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Internal Server Error", error: JSON.stringify(error), success: false })
    }
}
export const updateProfilePicture = async (req, res) => {
    try {
        const { userId } = req.params;
        const profilePicture = req.file;

        // Find the user by ID
        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Update the user's profile information
        user.profilePicture = profilePicture.filename;

        await user.save();

        res.status(200).json({ message: 'User Profile updated successfully', data: user });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Internal Server Error", error: JSON.stringify(error), success: false })
    }
}
export const deleteUser = async (req, res) => {
    try {
        let { id } = req.params;
        if (!id) {
            return res.status(400).json({ message: `ID required!` });
        }

        let existUser = await User.findOne({ _id: new mongoose.Schema.Types.ObjectId(id) });

        if (!existUser) return res.status(400).json({ message: `User is not existed. Invalid ID!` });

        await User.remove()
        res.status(201).json({ message: `User deleted successfully.` })
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Internal Server Error", error: JSON.stringify(error), success: false })
    }
}
export const forgetPassword = async (req, res) => {
    const { email } = req.body;
  
    try {
      const user = await User.findOne({ email });
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
  
      const token = jwt.sign({ userId: user._id }, JWT_KEY, { expiresIn: '15m' });
  
      const transporter = nodemailer.createTransport({
        // Configure your email provider settings here
        service: 'gmail',
        auth: {
          user: 'your_email',
          pass: 'your_password',
        },
      });
  
      const mailOptions = {
        from: process.env.FROM,
        to: email,
        subject: 'Password Reset',
        text: `Please click the following link to reset your password: http://localhost:5000/user/reset-password/${token}`,
      };
  
      transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
          console.error('Error sending email:', error);
          res.status(500).json({ message: 'Server error' });
        } else {
          console.log('Email sent:', info.response);
          res.status(200).json({ message: 'Password reset email sent' });
        }
      });
    }catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Internal Server Error", error: JSON.stringify(error), success: false })
    }
}  
export const resetPassword =  async (req, res) => {
    const { token, newPassword } = req.body;
  
    try {
      const decodedToken = jwt.verify(token, JWT_KEY);
      const userId = decodedToken.userId;
  
      // Find the user by ID
      const user = await User.findById(userId);
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
  
      user.password = newPassword;
      await user.save();
  
      res.status(200).json({ message: 'Password reset successful' });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Internal Server Error", error: JSON.stringify(error), success: false })
    }
}