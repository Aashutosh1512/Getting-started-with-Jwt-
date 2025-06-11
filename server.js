const express = require("express");
const jwt = require("jsonwebtoken");
const bodyParser = require("body-parser");
const { permission } = require("process");

const app = express();
const PORT = 3000;

// Secret key for JWT
const SECRET_KEY = "your_secret_key1";

app.use(bodyParser.json());

// Dummy user data
const dummyUser = {
  // this will be list of user from the database ..
  id: 1,
  username: "testuser",
  password: "password123",
  permission: ["write", "read", "delete"],
  role: ["admin"],
};

// ✅ Login API — generates JWT
app.post("/login", (req, res) => {
  const { username, password } = req.body;

  if (username === dummyUser.username && password === dummyUser.password) {
    const token = jwt.sign(
      // creating token using username from the req.body and adding few more fields from over end (database)
      {
        userId: dummyUser.id,
        username: dummyUser.username,
        permission: dummyUser.permission,
        role: dummyUser.role,
      },
      SECRET_KEY,
      {
        algorithm: "HS256",
        expiresIn: "1h",
      }
    );
    res.json({ token });
  } else {
    res.status(401).json({ message: "Invalid credentials" });
  }
});

// ✅ Middleware to verify JWT
function authenticateToken(req, res, next) {
  // validate the token which is passed in the subsequent request .
  const authHeader = req.headers["authorization"];
  const token = authHeader?.split(" ")[1];

  if (!token) return res.status(401).json({ message: "No token provided" });

  jwt.verify(token, SECRET_KEY, (err, decode) => {
    if (err)
      return res.status(403).json({ message: "Invalid or expired token" });

    req.decode = decode; // this the payload which we pass while creating the payload  .
    return next(); // ✅ Make sure this is inside the verify callback
  });
}

function checkAdmin(req, res, next) {
  var payload = req.decode;
  var role = payload.role;
  console.log(role);
  if (role.includes("admin")) return next();
  else {
    return res
      .status(403)
      .json({ message: "the user is not admin , access not allowed " });
  }
}
// ✅ Protected API
app.get("/protected", authenticateToken, (req, res) => {
  res.json({ message: "Access granted to protected route!", user: req.decode });
});

// only admin can access this
app.get("/api/confidential", authenticateToken, checkAdmin, (req, res) => {
  res.json({
    message: "Access granted to write route!",
    user: req.decode,
  });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
