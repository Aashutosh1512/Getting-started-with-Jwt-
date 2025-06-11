🔐 Getting-started-with-Jwt


📘 A simple Node.js starter project demonstrating how to implement JWT-based authentication using Express for your different use cases.
```
🚀 Features
User Login: Authenticate users and issue a JWT upon successful login.

Token Generation: Uses jsonwebtoken to sign and create JWTs with user-specific payloads (user ID, username, permissions, roles).

Authentication Middleware: A custom middleware (authenticateToken) to verify incoming JWTs and grant access to protected routes.

Role-Based Access Control (RBAC): An additional middleware (checkAdmin) demonstrates how to restrict access to specific routes based on user roles embedded in the JWT.

Express.js: A minimal and flexible Node.js web application framework.

Body-Parser: Middleware to parse incoming request bodies.
```
```
🛠️ Tech Stack
Node.js

Express.js

JSON Web Token (jsonwebtoken package)

📘 Ideal For
Beginners learning about JWT

Building secure REST APIs

Quick prototyping for auth-based Node.js services
```
```
🚀 Getting Started
📋 Prerequisites
Make sure you have Node.js and npm installed on your machine.

Node.js: Download and Install Node.js

npm: Comes bundled with Node.js

📦 Installation
Clone the repository:

git clone <repository_url>
cd <repository_name>

(Replace <repository_url> and <repository_name> with your actual repository details)

Install dependencies:

npm install express jsonwebtoken body-parser

Alternatively, you can create a package.json file and add these as dependencies, then run npm install.
```

💻 Usage
Save the provided code: Save the Node.js code into a file named server.js (or any name you prefer) in your project directory.

Run the server:

node server.js

The server will start on http://localhost:3000.

🧪 Testing the APIs (using tools like Postman, Insomnia, or cURL)
🔑 1. Login to get a JWT
Endpoint: POST /login

URL: http://localhost:3000/login

Headers:

Content-Type: application/json

Request Body (JSON):
```
{
    "username": "testuser",
    "password": "password123"
}
```
Expected Response:
```
{
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEsInVzZXJuYW1lIjoidGVzdHVzZXIiLCJwZXJtaXNzaW9uIjpbIndyaXRlIiwicmVhZCIsImRlbGV0ZSJdLCJyb2xlIjpbImFkbWluIl0sImlhdCI6MTYzNjQ2NzYwMCwiZXhwIjoxNjM2NDcxMjAwfQ.example_jwt_token_here"
}
```

Copy this token.

🛡️ 2. Access a Protected Route
Endpoint: GET /protected

URL: http://localhost:3000/protected

Headers:

Authorization: Bearer <YOUR_JWT_TOKEN> (Replace <YOUR_JWT_TOKEN> with the token obtained from the login step)

Expected Response (if token is valid):
```
{
    "message": "Access granted to protected route!",
    "user": {
        "userId": 1,
        "username": "testuser",
        "permission": ["write", "read", "delete"],
        "role": ["admin"],
        "iat": 1636467600,
        "exp": 1636471200
    }
}
```
Expected Response (if no token or invalid token):
```
{
    "message": "No token provided"
}
```

or
```
{
    "message": "Invalid or expired token"
}
```
👑 3. Access an Admin-Only Route
Endpoint: GET /api/confidential

URL: http://localhost:3000/api/confidential

Headers:

Authorization: Bearer <YOUR_JWT_TOKEN> (Use the same token, as the dummyUser is an admin)

Expected Response (if token valid and user is admin):
```
{
    "message": "Access granted to write route!",
    "user": {
        "userId": 1,
        "username": "testuser",
        "permission": ["write", "read", "delete"],
        "role": ["admin"],
        "iat": 1636467600,
        "exp": 1636471200
    }
}
```
Expected Response (if token valid but user is NOT admin - for a non-admin dummy user):
```
{
    "message": "the user is not admin , access not allowed "
}
```

⚙️ How it Works
➡️ JWT Authentication Flow
Login Request: A user sends a POST request to /login with their username and password.

Credential Verification: The server verifies these credentials against a stored user (in this case, dummyUser).

Token Generation: If credentials are valid, a JWT is created using jwt.sign(). This token includes a payload (user ID, username, permissions, roles) and is signed with a SECRET_KEY.

Token Issuance: The generated JWT is sent back to the client.

Subsequent Requests: For all subsequent requests to protected routes, the client must include this JWT in the Authorization header as Bearer <token>.

Token Verification: The authenticateToken middleware intercepts these requests. It extracts the token, verifies it using jwt.verify() and the same SECRET_KEY.

Payload Attachment: If the token is valid, the decoded payload is attached to the req.decode object, making user information available to the route handler.

Access Control: The request proceeds to the intended route. Additional middleware like checkAdmin can then examine the req.decode (payload) to implement more granular access control based on roles or permissions.

🧩 Middleware Explained
authenticateToken(req, res, next): This middleware is responsible for:

Checking if an Authorization header exists and contains a bearer token.

Verifying the token's authenticity and expiry using jwt.verify().

Attaching the decoded JWT payload to req.decode for downstream use.

Calling next() to pass control to the next middleware or route handler, or sending an error response if the token is missing or invalid.

checkAdmin(req, res, next): This middleware runs after authenticateToken (since it's chained in the route definition). It checks the role array within the req.decode object to see if it includes "admin". If it does, next() is called; otherwise, an access denied message is returned.

🔒 Security Considerations
For production applications, it's crucial to store your SECRET_KEY securely. Never hardcode it directly in your source code. Instead, consider using:

Environment Variables: Load the secret key from a .env file using a package like dotenv.

Key Management Services: For highly sensitive applications, use dedicated key management services provided by cloud providers (e.g., AWS KMS, Google Cloud Key Management).

Thanks for reading . 
