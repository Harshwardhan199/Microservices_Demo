//const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const User = require("../models/User");

const register = async (req, res) => {
    try {
        const { email, password } = req.body;

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ error: "Email already registered" });
        }

        const newUser = new User({
            email,
            password,
            //password: hashedPassword,
        });

        await newUser.save();

        res.status(201).json({
            message: "Signup successful",
            data: { email: newUser.email },
            accessToken
        });

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

        //AccessToken Creation
        const accessToken = jwt.sign({ userId: existingUser._id, email: existingUser.email }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN });

        //RefreshToken Creation
        const refreshToken = jwt.sign({ userId: existingUser._id }, process.env.JWT_REFRESH_SECRET, { expiresIn: process.env.JWT_REFRESH_EXPIRES_IN });

        //Save RefreshToken in HttpOnly cookie
        // res.cookie("refreshToken", refreshToken, {
        //     httpOnly: true,
        //     secure: false,
        //     sameSite: "Lax",
        //     maxAge: 7 * 24 * 60 * 60 * 1000
        // });

        //Save AccessToken with response
        res.status(201).json({
            message: "Login successful",
            user: {email: existingUser.email },
            accessToken,
            refreshToken
        });

    } catch (err) {
        console.error("Login error:", err);
        res.status(500).json({ error: "Server error" });
    }
};


module.exports = { register, login };