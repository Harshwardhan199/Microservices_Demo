const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
  const token = req.headers["x-g2s-token"];
  if (!token) return res.status(401).json({ error: "Missing G2S token" });

  try {
    // Each microservice validates using its own secret key
    const decoded = jwt.verify(token, process.env.DATA_SERVICE_KEY || "Data_Service_Key");

    if (decoded.target !== "dataService") {
      return res.status(403).json({ error: "Invalid target in G2S token" });
    }

    next();
  } catch (err) {
    return res.status(401).json({ error: "Invalid or expired G2S token" });
  }
};
