import express from 'express'

import Post from '../model/postModal.js'

export const addPost = async (req, res) => {
    const { title, content } = req.body;
    const {userId} = req.params;
  
    try {
      // Create new post
      const newPost = new Post({ title, content, user: userId });
      await newPost.save();
  
      res.status(201).json({ message: 'Post created successfully' });
    }  catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Internal Server Error", error: JSON.stringify(error), success: false })
    }
};
  
  // Read Posts with pagination and sorting
export const getPosts = async (req, res) => {
    const { page = 1, limit = 10, sort = 'createdAt' } = req.query;
  
    try {
      // Get paginated and sorted posts
      const posts = await Post.find()
        .populate('userId', 'name')
        .sort(sort)
        .limit(limit * 1)
        .skip((page - 1) * limit)
        .exec();
  
      const totalPosts = await Post.countDocuments();
  
      res.status(200).json({ posts, totalPages: Math.ceil(totalPosts / limit) });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Internal Server Error", error: JSON.stringify(error), success: false })
    }
};
  
  // Update a Post
export const updatePost = async (req, res) => {
    const { title, content } = req.body;
    const postId = req.params.id;
    const userId = req.params.userId;
  
    try {
      // Find the post by ID
      const post = await Post.findById(postId);
  
      if (!post) {
        return res.status(404).json({ message: 'Post not found' });
      }
  
      // Update the post
      post.title = title;
      post.content = content;
  
      await post.save();
  
      res.status(200).json({ message: 'Post updated successfully' });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Internal Server Error", error: JSON.stringify(error), success: false })
    }
};
  
  // Delete a Post
export const  deletePost = async (req, res) => {
    const postId = req.params.id;
    const userId = req.params.userId;
  
    try {
      // Find the post by ID
      const post = await Post.findById(postId);
  
      if (!post) {
        return res.status(404).json({ message: 'Post not found' });
      }
  
      // Check if the logged-in user is the creator of the post
      if (post.user.toString() !== userId) {
        return res.status(403).json({ message: 'Forbidden' });
      }
  
      // Delete the post
      await post.remove();
  
      res.status(200).json({ message: 'Post deleted successfully' });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Internal Server Error", error: JSON.stringify(error), success: false })
    }
};