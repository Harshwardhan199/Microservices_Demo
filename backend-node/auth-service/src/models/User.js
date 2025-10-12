const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  username: { type: String },
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  password: { type: String }, 
  googleId: { type: String }, 
  authProvider: { type: String, default: "local" }, 
  secret: { type: Number },
});

module.exports = mongoose.model("User", userSchema);
