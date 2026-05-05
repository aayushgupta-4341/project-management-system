const express  = require("express");
const mongoose = require("mongoose");
const cors     = require("cors");

const authRoutes = require("./routes/authRoutes");
const taskRoutes = require("./routes/taskRoutes");

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", function(req, res) {
  res.json({ message: "Backend is running." });
});

// Atlas URL directly hardcode kiya hai
mongoose.connect("mongodb+srv://Aayush:Prem8421363723@cluster0.vgy3e8p.mongodb.net/projectdb?retryWrites=true&w=majority&appName=Cluster0")
  .then(function() {
    console.log("MongoDB connected");
  })
  .catch(function(err) {
    console.log("MongoDB error:", err.message);
  });

app.use("/api/auth", authRoutes);
app.use("/api/tasks", taskRoutes);

var PORT = process.env.PORT || 5000;

app.listen(PORT, function() {
  console.log("Server started on port " + PORT);
});
