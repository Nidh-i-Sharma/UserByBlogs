import { Router } from 'express';
import { addUser, loginUser ,updateProfilePicture,deleteUser, resetPassword, forgetPassword } from '../controller/user.js';
import { upload } from '../middleware/auth.js';

const router = Router();


router.post('/adduser',addUser)
router.post('/login',loginUser)
router.post('/forgetpassword',forgetPassword)
router.post('/resetPassword',resetPassword)
router.post('/login',loginUser)
router.post('/updateprofilepicture/:id',upload.single('profilePicture'),updateProfilePicture)
router.delete('/deleteuser/:id',deleteUser)

export default router;
