const Blog = require('../models/blogModel');

exports.createBlog = async (req, res) => {
  try {
    const { title, imageUrl, topic, content } = req.body;

    if (!title || !topic || !content) {
      return res.status(400).json({ msg: 'Title, topic, and content are required' });
    }

    const newBlog = new Blog({
      author: req.user.id,
      title,
      imageUrl,
      topic,
      content,
    });

    const savedBlog = await newBlog.save();
    res.status(201).json(savedBlog);
  } catch (err) {
    console.error('Error in createBlog:', err);
    res.status(500).json({ msg: err.message });
  }
};

exports.getAllBlogs = async (req, res) => {
  try {
    const blogs = await Blog.find()
      .populate('author', 'username')
      .sort({ createdAt: -1 });

    res.json(blogs);
  } catch (err) {
    console.error('Error in getAllBlogs:', err);
    res.status(500).json({ msg: err.message });
  }
};

exports.getMyBlogs = async (req, res) => {
  try {
    const blogs = await Blog.find({ author: req.user.id });
    res.json(blogs);
  } catch (err) {
    console.error('Error in getMyBlogs:', err);
    res.status(500).json({ msg: err.message });
  }
};

exports.getBlogById = async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id).populate('author', 'username');
    if (!blog) return res.status(404).json({ msg: 'Blog not found' });

    res.json(blog);
  } catch (err) {
    console.error('Error in getBlogById:', err);
    res.status(500).json({ msg: err.message });
  }
};

exports.updateBlog = async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);
    if (!blog) return res.status(404).json({ msg: 'Blog not found' });

    if (blog.author.toString() !== req.user.id) {
      return res.status(401).json({ msg: 'Unauthorized' });
    }

    const { title, imageUrl, topic, content } = req.body;
    if (!title || !topic || !content) {
      return res.status(400).json({ msg: 'Missing required fields' });
    }

    blog.title = title;
    blog.imageUrl = imageUrl;
    blog.topic = topic;
    blog.content = content;

    const updated = await blog.save();
    res.json(updated);
  } catch (err) {
    console.error('Error in updateBlog:', err);
    res.status(500).json({ msg: err.message });
  }
};

exports.deleteBlog = async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);
    if (!blog) return res.status(404).json({ msg: 'Blog not found' });

    if (blog.author.toString() !== req.user.id) {
      return res.status(401).json({ msg: 'Unauthorized' });
    }

    await Blog.deleteOne({ _id: blog._id });
    res.json({ msg: 'Blog deleted' });
  } catch (err) {
    console.error('Error in deleteBlog:', err);
    res.status(500).json({ msg: err.message });
  }
};

exports.toggleFavorite = async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);
    if (!blog) return res.status(404).json({ msg: 'Blog not found' });

    const index = blog.favorites.indexOf(req.user.id);
    if (index === -1) {
      blog.favorites.push(req.user.id);
    } else {
      blog.favorites.splice(index, 1);
    }

    await blog.save();
    res.json(blog);
  } catch (err) {
    console.error('Error in toggleFavorite:', err);
    res.status(500).json({ msg: err.message });
  }
};

exports.searchBlogs = async (req, res) => {
  try {
    const { topic } = req.query;

    if (!topic) {
      return res.status(400).json({ msg: 'Search query is required' });
    }

    const blogs = await Blog.find({
      $or: [
        { title: { $regex: topic, $options: 'i' } },
        { topic: { $regex: topic, $options: 'i' } },
        { content: { $regex: topic, $options: 'i' } },
      ],
    });

    res.json(blogs);
  } catch (err) {
    console.error('Error in searchBlogs:', err);
    res.status(500).json({ msg: err.message });
  }
};
