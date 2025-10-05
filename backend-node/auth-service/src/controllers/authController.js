//const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

// const fs = require("fs");
// const path = require("path");
// // Load the private key for signing
// const privateKey = fs.readFileSync(path.join(__dirname, "../public-private-key/private.key"), "utf8");

const register = async (req, res) => {
    try {
        const { username, email, password } = req.body;

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ error: "Email already registered" });
        }

        const newUser = new User({
            username,
            email,
            password,
            //password: hashedPassword,
            secret: 0,
        });

        await newUser.save();

        res.status(201).json({ message: "Signup successful" });

    } catch (error) {
        console.error("Signup error:", error);
        res.status(500).json({ error: "Server error" });
    }
};

const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        const existingUser = await User.findOne({ email });
        if (!existingUser) {
            return res.status(400).json({ error: "User not found" });
        }

        if (password != existingUser.password) {
            return res.status(401).json({ error: "Invalid credentials" });
        }

        // const isPasswordValid = await bcrypt.compare(password, existingUser.password);
        // if (!isPasswordValid) {
        //     return res.status(401).json({ error: "Invalid credentials" });
        // }

        // AccessToken Creation
        const accessToken = jwt.sign({ userId: existingUser._id, email: existingUser.email }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN });

        // RefreshToken Creation
        const refreshToken = jwt.sign({ userId: existingUser._id }, process.env.JWT_REFRESH_SECRET, { expiresIn: process.env.JWT_REFRESH_EXPIRES_IN });

        // RS256 

        // AccessToken Creation
        //const accessToken = jwt.sign({ userId: existingUser._id, email: existingUser.email }, privateKey, { algorithm: "RS256", expiresIn: process.env.JWT_EXPIRES_IN });

        // RefreshToken Creation
        //const refreshToken = jwt.sign({ userId: existingUser._id }, privateKey, { algorithm: "RS256", expiresIn: process.env.JWT_REFRESH_EXPIRES_IN });

        //Save AccessToken with response
        res.status(201).json({
            message: "Login successful",
            user: { email: existingUser.email },
            accessToken,
            refreshToken
        });

    } catch (err) {
        console.error("Login error:", err);
        res.status(500).json({ error: "Server error" });
    }
};

// const refresh = async (req, res) => {
//     const { refreshToken } = req.body;    
//     if (!refreshToken) {
//         return res.status(401).json({ message: "No refresh token" });
//     }

//     try {
//         // Verify refresh token with public key
//         const decoded = jwt.verify(refreshToken, privateKey, { algorithms: ["RS256"] });

//         // Find user
//         const userFromDB = await User.findById(decoded.userId);
//         if (!userFromDB) {
//             return res.status(404).json({ message: "User not found" });
//         }

//         // Generate new access token with private key
//         const accessToken = jwt.sign(
//             { userId: userFromDB._id, email: userFromDB.email },
//             privateKey,
//             { algorithm: "RS256", expiresIn: process.env.JWT_EXPIRES_IN }
//         );

//         res.status(201).json({
//             message: "Refresh successful",
//             user: { email: userFromDB.email },
//             accessToken,
//         });
//     } catch (err) {
//         console.error("Refresh error:", err.message);
//         return res.status(403).json({ message: "Invalid or expired refresh token" });
//     }
// };

const refresh = async (req, res) => {
    const { refreshToken } = req.body;
    try {
        if (!refreshToken) return res.status(401).json({ message: "No refresh token" });

        jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET, async (err, decoded) => {
            if (err) return res.status(403).json({ message: "Invalid refresh token" });

            const userFromDB = await User.findById(decoded.userId);
            if (!userFromDB) return res.status(404).json({ message: "User not found" });

            const accessToken = jwt.sign({ userId: userFromDB._id, email: userFromDB.email }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN });

            res.status(201).json({
                message: "Refresh successful",
                user: { email: userFromDB.email },
                accessToken
            });

        });

    } catch (err) {
        console.error("Login error:", err);
        res.status(500).json({ error: "Server error" });
    }
};

module.exports = { register, login, refresh };