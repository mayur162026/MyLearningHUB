const bcrypt = require('bcrypt');
const { sql, connectDB } = require('./db');

async function hashAndStorePassword(username, plainPassword) {
    await connectDB();
    const hashedPassword = await bcrypt.hash(plainPassword, 10);
    await sql.query`INSERT INTO [EnglishBuddy].[dbo].[Login] (username, password_hash) VALUES (${username}, ${hashedPassword})`;
    console.log("User added successfully!");
}

hashAndStorePassword('testuser', 'securepassword')
    .then(() => process.exit())
    .catch(err => console.error(err));
