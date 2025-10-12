//const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const User = require("../models/User");

const getData = async (req, res) => {
    const { userId } = req.body;
    
    try {
        const user = await User.findById(userId);

        const username = user.username;
        const secret = user.secret;

        res.json({ 'username': username, 'secret': secret});

    } catch (err) {
        console.error("Error getting data:", err);
        res.status(500).json({ error: "Server error" });
    }
};

const changeSecret = async (req, res) => {
    const { userId, newSecret } = req.body;
    
    try {
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }

        user.secret = newSecret;
        await user.save();
        
        res.status(200).json({ message: "Secret updated" });

    } catch (err) {
        console.error("Error getting data:", err);
        res.status(500).json({ error: "Server error" });
    }
};

module.exports = { getData, changeSecret };