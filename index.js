const http = require('http');
const connectDB = require('./config/db');
const { login, register } = require('./controllers/authController');
const dotenv = require("dotenv");
const { authenticate } = require('./middleware/auth');
const { createBlog, getBlogs, like, unlike, comment, getBlogWithComments } = require('./controllers/blogController');
const { addFriend, allUsers, myfriends, userInfo } = require('./controllers/friendsController');
const { Grid } = require('gridfs-stream');
const { GridFsStorage } = require('multer-gridfs-storage');
const multer = require('multer');

dotenv.config();

// connected with db
connectDB();


const server = http.createServer((req, res) => {
    console.log("A request was recieved at", req.url);
    res.setHeader('Access-Control-Allow-Origin', '*'); // Allow all origins
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS'); // Allow specific methods
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization'); // Allow specific headers
  
    if (req.method === 'OPTIONS') {
        // Respond to preflight requests
        res.writeHead(204);
        res.end();
        return;
      }

    switch (req.url) {
        case '/':
            res.end("Hello!");
            break;
        case '/login':
            login(req, res);
            break;
        case '/user':
            authenticate(req,res,()=>{
               userInfo(req,res);
            })
            break;
        case '/register':
            register(req, res);
            break;
        case '/blog':
            if (req.method === "GET") {
                getBlogs(req, res);
            } else {
                authenticate(req, res, () => {
                    createBlog(req, res);
                })
            }
            break;
        case '/getComments':
            getBlogWithComments(req,res);
            break;
        case '/friends':
            if (req.method === "GET") {
                allUsers(req, res);
            } else {
                authenticate(req, res, () => {
                    addFriend(req, res);
                })
            }
            break;
        case '/myfriends':
            authenticate(req,res, ()=>{
                myfriends(req,res);
            })
            break;
        case '/like':
            authenticate(req, res, () => {
                like(req, res);
            })
            break;
        case '/unlike':
            authenticate(req, res, () => {
                unlike(req, res);
            })
            break;
        case '/comment':
            authenticate(req, res, () => {
                comment(req, res);
            })
            break;
        default:
            res.writeHead(400, { 'Content-Type': 'application/json' });
            return res.end(JSON.stringify({ message: 'Service you requested does not exist. Try contacting the provider' }));
    }
})

server.listen(4000, () => {
    console.log("Server Running at 4000");
})

