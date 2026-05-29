const express = require('express');
const path = require('path');
const app = express();
const PORT = 3000;

// Middleware to parse JSON payloads from frontend requests
app.use(express.json());

// Serve static files (HTML, CSS, JS) from the "public" directory
app.use(express.static(path.join(__dirname, 'public')));

// In-memory user "database" (Resets every time the server restarts)
// WARNING: In production, use a real database and NEVER store passwords in plain text! Hashing (e.g., bcrypt) is mandatory.
const users = [];

// 1. SIGN UP ROUTE
app.post('/api/signup', (req, res) => {
    const { fullName, email, password } = req.body;

    // Server-side validation check
    if (!fullName || !email || !password) {
        return res.status(400).json({ success: false, message: "All fields are required." });
    }

    // Check if user already exists
    const userExists = users.some(user => user.email === email);
    if (userExists) {
        return res.status(400).json({ success: false, message: "An account with this email already exists." });
    }

    // Save user to memory
    users.push({ fullName, email, password });
    
    return res.status(201).json({ success: true, message: "Account created successfully!" });
});

// 2. LOG IN ROUTE
app.post('/api/login', (req, res) => {
    const { username, password } = req.body; // 'username' maps to email field on frontend

    if (!username || !password) {
        return res.status(400).json({ success: false, message: "Username and password are required." });
    }

    // Find user by email and match password
    const user = users.find(u => u.email === username && u.password === password);

    if (!user) {
        return res.status(401).json({ success: false, message: "Invalid email or password." });
    }

    return res.status(200).json({ 
        success: true, 
        message: `Welcome back, ${user.fullName}!`,
        user: { name: user.fullName, email: user.email } 
    });
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is happily running at http://localhost:${PORT}`);
});