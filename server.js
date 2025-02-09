require('dotenv').config();
const express = require('express');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const { sql, connectDB, getPool } = require('./db'); // ✅ FIXED IMPORT
const app = express();
app.use(express.json());
app.use(cors({
    origin: 'https://mylearninghub.onrender.com/',  // Replace with your frontend URL
}));
app.use((req, res, next) => {
    console.log(`🌍 [${req.method}] ${req.url}`, req.body);
    next();
});

// ✅ Connect to SQL Server before starting the server
connectDB().then(() => {
    const PORT = process.env.PORT || 3000;
    app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
}).catch(err => console.error("❌ Error starting server:", err));

// User Login API
app.get('/', (_req, res) => {
    res.send("API is working...");
});
app.post('/api/login', async (req, res) => {
    try {
        const { username, password } = req.body;
        console.log("🔍 Checking user:", username);
        const pool = getPool();
        const result = await pool.request()
            .input('username', sql.VarChar, username)
            .query('SELECT * FROM [EnglishBuddy].[dbo].[Login] WHERE username = @username');
        if (result.recordset.length > 0) {
            const user = result.recordset[0];
            const isMatch = await bcrypt.compare(password, user.password_hash);
            
            if (isMatch) {
                return res.json({ success: true, username });
            }
        }
        res.status(401).json({ success: false, message: 'Invalid credentials' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});
