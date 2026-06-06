require('dotenv').config();
const express = require('express');
const path = require('path');
const bcrypt = require('bcryptjs');
const { MongoClient, ServerApiVersion } = require('mongodb');

const app = express();
const PORT = process.env.PORT || 3000;
const uri = process.env.MONGODB_URI;
const dbName = process.env.MONGODB_DB || 'cyberassist';
const collectionName = process.env.MONGODB_COLLECTION || 'users';
const SALT_ROUNDS = 10;

if (!uri) {
    throw new Error('Missing MONGODB_URI in environment. Add it to your .env file.');
}

const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});

let usersCollection;

async function connectDb() {
    await client.connect();
    const db = client.db(dbName);
    usersCollection = db.collection(collectionName);
    console.log(`MongoDB connected to ${dbName}.${collectionName}`);
}

// Middleware to parse JSON payloads from frontend requests
app.use(express.json());

// Serve static files (HTML, CSS, JS) from the project root directory
app.use(express.static(path.join(__dirname)));

// 1. SIGN UP ROUTE
app.post('/api/signup', async (req, res) => {
    const { fullName, email, password } = req.body;

    if (!fullName || !email || !password) {
        return res.status(400).json({ success: false, message: 'All fields are required.' });
    }

    try {
        const existingUser = await usersCollection.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ success: false, message: 'An account with this email already exists.' });
        }

        const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);
        await usersCollection.insertOne({ fullName, email, password: hashedPassword, createdAt: new Date() });
        return res.status(201).json({ success: true, message: 'Account created successfully!' });
    } catch (err) {
        console.error('Signup failed:', err);
        return res.status(500).json({ success: false, message: 'Unable to create account right now.' });
    }
});

// 2. LOG IN ROUTE
app.post('/api/login', async (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({ success: false, message: 'Username and password are required.' });
    }

    try {
        const user = await usersCollection.findOne({ email: username });
        if (!user) {
            return res.status(401).json({ success: false, message: 'Invalid email or password.' });
        }

        const passwordMatch = await bcrypt.compare(password, user.password);
        if (!passwordMatch) {
            return res.status(401).json({ success: false, message: 'Invalid email or password.' });
        }

        return res.status(200).json({ 
            success: true,
            message: `Welcome back, ${user.fullName}!`,
            user: { name: user.fullName, email: user.email }
        });
    } catch (err) {
        console.error('Login failed:', err);
        return res.status(500).json({ success: false, message: 'Unable to log in right now.' });
    }
});

async function start() {
    await connectDb();
    app.listen(PORT, () => {
        console.log(`Server is happily running at http://localhost:${PORT}`);
    });
}

start().catch(err => {
    console.error('Failed to start server:', err);
    process.exit(1);
});