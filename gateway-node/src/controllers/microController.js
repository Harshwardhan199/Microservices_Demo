const axios = require('axios');

const dataService = async (req, res) => {
    try {
        //const tokenRes = await axios.post("http://localhost:8001/api/auth/refresh", { });
        //console.log("Data Service Token: ",tokenRes);
        
    } catch (error) {
        console.log("Error getting Service token: ", error);
        res.status(500).json({ error: "Server error" });
    }
};

module.exports = {dataService}