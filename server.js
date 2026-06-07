require('dotenv').config();
const express = require('express');
const path = require('path');
const bcrypt = require('bcryptjs');
const { MongoClient, ServerApiVersion } = require('mongodb');

const app = express();
const PORT = process.env.PORT || 3000;
const uri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017';
const dbName = process.env.MONGODB_DB || 'cyberassist';
const userCollectionName = process.env.MONGODB_COLLECTION || 'users';
const appointmentCollectionName = process.env.MONGODB_APPOINTMENT_COLLECTION || 'appointments';
const SALT_ROUNDS = 10;

if (!process.env.MONGODB_URI) {
    console.log('No MONGODB_URI configured; using local MongoDB at mongodb://127.0.0.1:27017');
}

const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});

let usersCollection;
let appointmentsCollection;

async function connectDb() {
    await client.connect();
    const db = client.db(dbName);
    usersCollection = db.collection(userCollectionName);
    appointmentsCollection = db.collection(appointmentCollectionName);
    console.log(`MongoDB connected to ${dbName}.${userCollectionName} and ${dbName}.${appointmentCollectionName}`);
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

// 3. APPOINTMENT CREATE ROUTE
app.post('/api/appointments', async (req, res) => {
    const { name, email, date, time, packages } = req.body;

    if (!name || !email || !date || !time || !packages) {
        return res.status(400).json({ success: false, message: 'All appointment fields are required.' });
    }

    try {
        const appointmentAt = new Date(`${date}T${time}:00`);
        await appointmentsCollection.insertOne({ name, email, date, time, packages, appointmentAt, createdAt: new Date() });
        return res.status(201).json({ success: true, message: 'Appointment booked successfully!' });
    } catch (err) {
        console.error('Appointment booking failed:', err);
        return res.status(500).json({ success: false, message: 'Unable to book appointment right now.' });
    }
});

app.get('/api/appointments/next', async (req, res) => {
    const email = req.query.email;
    if (!email) {
        return res.status(400).json({ success: false, message: 'Email query parameter is required.' });
    }

    try {
        const nextAppointment = await appointmentsCollection
            .find({ email, appointmentAt: { $gte: new Date() } })
            .sort({ appointmentAt: 1 })
            .limit(1)
            .next();

        if (!nextAppointment) {
            return res.status(404).json({ success: false, message: 'No upcoming appointment found.' });
        }

        return res.status(200).json({ success: true, appointment: nextAppointment });
    } catch (err) {
        console.error('Error fetching next appointment:', err);
        return res.status(500).json({ success: false, message: 'Unable to load appointment details.' });
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