//const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const axios = require('axios');

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

const google = async (req, res) => {
  try {
    const { code } = req.body; // receive code from frontend (GIS SDK popup)

    if (!code) return res.status(400).json({ message: "Authorization code required" });

    // Exchange authorization code for access_token
    const tokenResponse = await axios.post(
      "https://oauth2.googleapis.com/token",
      new URLSearchParams({
        code,
        client_id: process.env.GOOGLE_CLIENT_ID,
        client_secret: process.env.GOOGLE_CLIENT_SECRET,
        redirect_uri: "postmessage", // for popup
        grant_type: "authorization_code",
      }),
      { headers: { "Content-Type": "application/x-www-form-urlencoded" } }
    );

    const { access_token } = tokenResponse.data;

    // Get user info from Google
    const userInfo = await axios.get(`https://www.googleapis.com/oauth2/v3/userinfo`, {
      headers: { Authorization: `Bearer ${access_token}` },
    });

    const { sub: googleId, email, name } = userInfo.data;

    // Find or create user in DB
    let user = await User.findOne({ email });

    if (!user) {
      user = await User.create({
        username: name,
        email,
        authProvider: "google",
        googleId,
      });
    }

    // Create JWTs
    const accessToken = jwt.sign(
      { userId: user._id, username: user.username, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN }
    );

    const refreshToken = jwt.sign(
      { userId: user._id },
      process.env.JWT_REFRESH_SECRET,
      { expiresIn: process.env.JWT_REFRESH_EXPIRES_IN }
    );

    // Return tokens and user info
    res.status(200).json({
      message: "Google login successful",
      user: { username: user.username, email: user.email },
      accessToken,
      refreshToken,
    });
  } catch (err) {
    console.error("Google login error:", err.response?.data || err.message);
    res.status(500).json({ message: "Google login failed" });
  }
};

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

module.exports = { register, login,google, refresh };