const SocialPost = require('../Models/SocialPostModel');

exports.createPost = async (req, res) => {
  try {
    const { instagramLink } = req.body;
    const imageUrl = `${req.file.filename}`;
    
    const post = await SocialPost.create({
      imageUrl,
      instagramLink
    });
    
    res.status(201).json(post);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getAllPosts = async (req, res) => {
  try {
    const posts = await SocialPost.findAll();
    res.json(posts);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.updatePost = async (req, res) => {
  try {
    const { postId } = req.params;
    const updateData = req.body;
    
    if (req.file) {
        updateData.imageUrl = `${req.file.filename}`;    }

    const [updated] = await SocialPost.update(updateData, {
      where: { postId }
    });
    
    if (updated) {
      const updatedPost = await SocialPost.findByPk(postId);
      return res.json(updatedPost);
    }
    throw new Error('Post not found');
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.deletePost = async (req, res) => {
  try {
    const { postId } = req.params;
    const deleted = await SocialPost.destroy({
      where: { postId }
    });
    
    if (deleted) {
      return res.json({ message: 'Post deleted' });
    }
    throw new Error('Post not found');
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};