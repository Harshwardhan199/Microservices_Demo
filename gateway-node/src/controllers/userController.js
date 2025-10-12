const axios = require('axios');

const getData = async (req, res) => {
    const userId = req.user.userId;
    try {
        const userRes = await axios.post("http://localhost:8002/api/users/getData", { userId }, { headers: { "x-g2s-token": req.g2sToken } });

        res.status(200).json(userRes.data);
    } catch (error) {
        console.log("Error getting data: ", error.response?.data || error.message);
        res.status(500).json({ error: "Server error" });
    }
};

const changeSecret = async (req, res) => {
    const userId = req.user.userId;
    const { newSecret } = req.body;
    try {
        await axios.post("http://localhost:8002/api/users/changeSecret", { userId, newSecret }, { headers: { "x-g2s-token": req.g2sToken } });
        res.status(200).json({ message: "Secret updated successfully" });
    } catch (error) {
        console.log("Error Changing Secret: ", error.response?.data || error.message);
        res.status(500).json({ error: "Server error" });
    }
};

module.exports = { getData, changeSecret };