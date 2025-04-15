const express = require('express');


const router = express.Router();
const {
  createBlog,
  getAllBlogs,
  getMyBlogs,
  getBlogById,
  updateBlog,
  deleteBlog,
  toggleFavorite,
  searchBlogs,
} = require('../controllers/blogController');
const authMiddleware = require('../middleware/authMiddleware'); // Update path if necessary


router.post('/', authMiddleware, createBlog);
router.get('/', getAllBlogs);
router.get('/mine', authMiddleware, getMyBlogs);
router.get('/search', searchBlogs);
router.get('/:id', getBlogById);
router.put('/:id', authMiddleware, updateBlog);
router.delete('/:id', authMiddleware, deleteBlog);
router.post('/:id/favorite', authMiddleware, toggleFavorite);

module.exports = router;
