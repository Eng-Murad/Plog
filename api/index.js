const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const User = require('./models/User');
const bcrypt = require('bcryptjs');
const app = express();
const Post = require('./models/post');
const Comment = require('./models/Comment');
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');
const multer  = require('multer')
const uploadmiddleware = multer({ dest: 'uploads/' });
const fs = require('fs');
const bodyParser = require("body-parser");

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
const salt = bcrypt.genSaltSync(10);
const secret = 'kjsdhfjkfhksfdfdf';


app.use(cors({credentials:true, origin:'http://localhost:5173'}));
app.use(express.json());
app.use(cookieParser());
app.use('/uploads', express.static(__dirname + '/uploads'));


mongoose.connect('mongodb://localhost:27017/blog')
  .then(() => console.log('Connected!'));

app.post('/register', async (req, res) => {
    const {username,  email, password} = req.body;
    try{
        const userDoc = await User.create({
            username, 
            email,
            password:bcrypt.hashSync(password, salt)
        })
         res.json(userDoc);
    }
    catch(e){
        res.status(400).json(e);
    }
});

app.post('/login', async (req, res) => {
    const { username, password } = req.body;
    const userDoc = await User.findOne({ username });
  
    if (userDoc) {
        const passOk = bcrypt.compareSync(password, userDoc.password);
      
        if (passOk) {
            // login
            jwt.sign({ username, id: userDoc._id }, secret, {}, (err, token) => {
                if (err) throw err;
                res.cookie('token', token).json({
                    id: userDoc._id,
                    username,
            });
            });
        } else {
            res.status(400).json('username or password not correct');
        }
    } else {
        res.status(400).json('user not found');
    }
});

app.get('/profile', (req, res) =>{
    const {token} = req.cookies;
    jwt.verify(token, secret, {}, (err, info) => {
        if (err) throw err;
        res.json(info);
    });
});

app.post('/logout', (req, res) => {
    res.cookie('token', '').json('ok');
});


app.post('/post', uploadmiddleware.single('file') ,async (req, res) => {
    const {originalname, path} = req.file;
    const parts = originalname.split('.');
    const ext = parts[parts.length - 1];
    const newPath = path+'.'+ext;
    fs.renameSync(path, newPath);

    const {token} = req.cookies;
    jwt.verify(token, secret, {}, async (err, info) => {
        if (err) throw err;
        const {title, summary, content} = req.body;
        const postDoc = await Post.create({
        title,
        summary,
        content,
        cover:newPath,
        author:info.id,
       })
        res.json(postDoc);  
    });
});

 

app.put('/post', uploadmiddleware.single('file'), async (req, res) => {
    
    const newPath = null;
    if (req.file){
        const {originalname, path} = req.file;
        const parts = originalname.split('.');
        const ext = parts[parts.length - 1];
        // const comments = await Comment.find({ postId: id });
        newPath = path+'.'+ext;
        fs.renameSync(path, newPath);
    }
  
    const {token} = req.cookies;
    jwt.verify(token, secret, {}, async (err, info) => {
        if (err) throw err;
        const {id, title, summary, content} = req.body;
        const postDoc = await Post.findById(id);
        // const comment = await Comment.find({ postId: id });
        const isAuthor = JSON.stringify(postDoc.author) === JSON.stringify(info.id);
        if (!isAuthor) {
            return res.status(400).json('you are not the author')
        }
        await postDoc.updateOne({
            title, 
            summary, 
            content,
            cover: newPath? newPath: postDoc.cover,
        });
        res.json(postDoc);
    });
    
});

app.get('/post', async (req, res) => {
    res.json( await Post.find()
    .populate('author', ['username'])
    .sort({createdAt: -1})
    .limit(20)
    );
});

app.get('/post/:id', async (req, res) => {
    const {id} = req.params;
    const postDoc = await Post.findById(id).populate('author', ['username']);
    res.json(postDoc);
  
});

app.delete('/post/:id', async (req, res) => {
    const { id } = req.params;
  
    // Check if the post exists
    const post = await Post.findById(id);
    if (!post) {
      return res.status(404).json({ error: 'Post not found' });
    }
  
    // Delete the post
    await post.deleteOne();
  
    res.json({ message: 'Post deleted successfully' });
  });


  app.post('/comment', async (req, res) => {
    try {
      const { content, author, postId } = req.body;
  
      // Create a new comment
      const comment = new Comment({
        content,
        author,
        postId,
      });
  
      // Save the comment to the database
      await comment.save();
  
      res.status(201).json(comment);
    } catch (error) {
      console.error('Error creating comment:', error);
      res.status(500).json({ error: 'Failed to create comment' });
    }
  });

  app.get('/comment/:postId', async (req, res) => {
    try {
      const postId = req.params.postId;
  
      // Fetch the post from the database
      const post = await Comment.findById(postId);
  
      // Fetch the comments for the post
      const comments = await Comment.find({ postId });
  
      res.status(200).json({ post, comments });
    } catch (error) {
      console.error('Error fetching post and comments:', error);
      res.status(500).json({ error: 'Failed to fetch post and comments' });
    }
  });
  

app.listen(4000);

//npm i jsonwebtoken
//npm i cookie-parser
//npm i react-quill
//npm i multer
//npm i date-fns // for client not api  and heroicons