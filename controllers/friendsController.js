const User = require("../models/User");
const bodyParser = require("../utils/bodyParser");


const allUsers = async (req, res) => {
    try {
        const data = await User.find();
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(data));
    } catch (error) {
        console.error(error.message);
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ message: 'Server error' }));
    }
}

const addFriend = async (req, res) => {
    const {friendId} = await bodyParser(req);
    try {
        const userId = req.user.id;
   
        // Find both users
        const user = await User.findById({ _id: userId });
        const friend = await User.findById({ _id: friendId });

        // Check if they are already friends
        if (user.friends.includes(friendId) || friend.friends.includes(userId)) {
            res.writeHead(402, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ message: 'They are already friends' }));
        }

        // Add friendId to user's friends list
        user.friends.push(friendId);
        // Add userId to friend's friends list
        friend.friends.push(userId);


        // Save both users
        await user.save();
        await friend.save();

        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ message: 'Successfully added as freind' }));

    } catch (error) {
        console.error(error.message);
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ message: 'Server error' }));
    }
}

const myfriends= async(req,res)=>{
    try {
        const userId = req.user.id;
        const user = await User.findById(userId).populate('friends', 'username _id');
        
        if (!user) {
          res.writeHead(404, { 'Content-Type': 'application/json' });
          return res.end(JSON.stringify({ message: 'User Not Found' }));
        }
    
        const friendsData = user.friends.map(friend => ({
          id: friend._id,
          username: friend.username
        }));
    
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(friendsData));
      } catch (error) {
        console.error(error.message);
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ message: 'Server error' }));
      }
}

const userInfo=async(req,res)=>{
    try {
        const userId = req.user.id;
        const user = await User.findById({_id:userId});
        if(!user){
        res.writeHead(404, { 'Content-Type': 'application/json' });
          return res.end(JSON.stringify({ message: 'User Not Found' }));
        }
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(user));
      } catch (error) {
        console.error(error.message);
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ message: 'Server error' }));
      }
}

module.exports = { allUsers, addFriend, myfriends, userInfo };