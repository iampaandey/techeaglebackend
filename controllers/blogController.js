const bodyParser = require("../utils/bodyParser")
const Blog = require("../models/Blog");
const User = require("../models/User");

//controller to create a blog
const createBlog = async (req, res) => {
    const { title, image, video,  description, location } = await bodyParser(req);
    try {
        const author = req.user.id;
        console.log(author);
        const blog = new Blog({ title, description,author, image, video, location});
        await blog.save();
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(blog));
    } catch (error) {
        console.error(error.message);
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ message: 'Server error' }));
    }
}

//controller to get allBlogs
const getBlogs = async (req, res) => {
    try {
        const data = await Blog.find().populate('author', 'username').populate({
            path:'comments.author',
            select:'username'
        });
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(data));
    } catch (error) {
        console.error(error.message);
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ message: 'Server error' }));
    }
}
  
//controller to like the post
const like = async (req, res) => {
    const { blogId } = await bodyParser(req);
    try {

        const userId = req.user.id;
        //finding user
        const user = await User.findById({ _id: userId });
        //finding blog object
        const blog = await Blog.findById({ _id: blogId });
        //retrieving author id
        const blogAuthor = blog.author;
        console.log("blogAuthor", blogAuthor);

        //check if user is liking his own blog

        if (userId === blogAuthor) {
            //increasing like
            blog.likes.push(userId);
            await blog.save();
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ message: 'Added Your Like' }));

        }
        //checking if author is a friend of user who requested to like
        if (!user.friends.includes(blogAuthor)) {
            res.writeHead(402, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ message: 'Add user as friend to like their post' }));
        }

        //increasing like
        blog.likes.push(userId);
        await blog.save();
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ message: 'Added Your Like' }));

    } catch (error) {
        console.error(err.message);
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ message: 'Server error' }));
    }
}

//contorller to addComment to an existing Blog
const comment = async (req, res) => {
    const { blogId,comment } = await bodyParser(req);
    try {

        const userId = req.user.id;
        //finding user
        const user = await User.findById({ _id: userId });
        //finding blog object
        const blog = await Blog.findById({ _id: blogId });
        //retrieving author id
        const blogAuthor = blog.author;
        console.log("blogAuthor", blogAuthor);

        //creating comment Object
        const commentObj={
         author:userId,
         text:comment
        }
        if(blogAuthor===userId){
        //adding comment    
         blog.comments.push(commentObj);
         res.writeHead(200, { 'Content-Type': 'application/json' });
         res.end(JSON.stringify({ message: 'Comment Added Successfully.' }));
        }


        //checking if author is a friend of user who requested to like
        if (!user.friends.includes(blogAuthor)) {
            res.writeHead(402, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ message: 'Add user as friend to comment on their post' }));
        }

        //adding comment
        blog.comments.push(commentObj);
        await blog.save();
         res.writeHead(200, { 'Content-Type': 'application/json' });
         res.end(JSON.stringify({ message: 'Comment Added Successfully.' }));

    } catch (error) {
        console.error(error.message);
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ message: 'Server error' }));
    }
}

//controller to unlike a blog
const unlike = async (req, res) => {
    const { blogId } = await bodyParser(req);
    try {

        const userId = req.user.id;
        //finding blog object
        const blog = await Blog.findById({ _id: blogId });
        //removing the like
        blog.likes=blog.likes.filter(like=>!like.equals(userId));
        await blog.save();
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ message: 'Like Removed Successfully' }));
    } catch (error) {
        console.error(err.message);
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ message: 'Server error' }));
    }
}

module.exports = { createBlog, getBlogs, like, comment, unlike}