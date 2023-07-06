import { Router } from 'express';
import authenticateUser from '../middleware/auth.js';
import { addPost, deletePost, getPosts, updatePost } from '../controller/post.js';

const router = Router();


router.post('/addpost',authenticateUser,addPost)
router.get('/getposts',authenticateUser,getPosts)
router.put('/updatepost/:id/:userId',authenticateUser,updatePost)
router.delete('/deletepost/:id/:userId',authenticateUser,deletePost)

export default router;