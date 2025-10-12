const axios = require('axios');

const register = async (req, res) => {
    const { username, email, password } = req.body;
    try {
        await axios.post("http://localhost:8001/api/auth/register", { username, email, password });
        res.status(201).json({ 'message': "User Registered" });
    } catch (error) {
        console.log("Register Error: ", error);
        res.status(500).json({ error: "Server error" });
    }
};

const login = async (req, res) => {
    const { email, password } = req.body;
    try {
        const loginRes = await axios.post("http://localhost:8001/api/auth/login", { email, password });

        const refreshToken = loginRes.data.refreshToken;
        const accessToken = loginRes.data.accessToken;
        const user = loginRes.data.user;

        res.cookie("refreshToken", refreshToken, {
            httpOnly: true,
            secure: false,
            sameSite: "Lax",
            maxAge: 7 * 24 * 60 * 60 * 1000
        });

        res.status(201).json({
            message: "Login successful",
            user,
            accessToken
        });

    } catch (error) {
        console.log("Login Error: ", error);
        res.status(500).json({ error: "Server error" });
    }
};

const google = async (req, res) => {
  try {
    const { code } = req.body;

    const loginRes = await axios.post("http://localhost:8001/api/auth/google", { code }, { withCredentials: true });

    const { refreshToken, accessToken, user } = loginRes.data;

    // Set HttpOnly cookie for refreshToken
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: false, // true if using HTTPS
      sameSite: "Lax",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.status(200).json({
      message: "Login successful",
      user,
      accessToken,
    });
  } catch (error) {
    console.error("Gateway login error:", error.response?.data || error.message);
    res.status(500).json({ error: "Server error" });
  }
};

const refresh = async (req, res) => {
    const refreshToken = req.cookies.refreshToken;

    try {
        const refreshRes = await axios.post("http://localhost:8001/api/auth/refresh", { refreshToken });
        const accessToken = refreshRes.data.accessToken;

        res.status(201).json({
            message: "Refresh successful",
            accessToken
        });

    } catch (error) {
        console.log("Refresh Error: ", error);
        res.status(200).json({ message: "Server error" });
    }
};

const logout = async (req, res) => {
    try {
        res.clearCookie("refreshToken", {
            httpOnly: true,
            secure: false,
            sameSite: "Lax"
        });

        res.json({ message: "Logged out successfully" });

    } catch (error) {
        console.log("Logout Error: ", error);
        res.status(500).json({ error: "Server error" });
    }
};

module.exports = { register, login, google, refresh, logout };