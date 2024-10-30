// import fs from 'fs'
// import path from 'path'
// import {pool} from './db.js'
// import bcrypt from 'bcrypt';



// const __dirname = import.meta.dirname

// const initializeTestDb = ()=>{
//     const sql = fs.readFileSync(path.resolve(__dirname,"../todo.sql"), "utf8");
//     pool.query(sql)
// }

// const insertTestUser = (email,password)=>{
//     hash(password,10,(error,hashedPassword)=>{
//         pool.query('insert into account (email,password) values ($1,$2)',
//             [email,hashedPassword]
//         )
//     })
// }


// const getToken = (email)=>{
//     return sign({user: email},process.env.JWT_SECRET_KEY)
// }


// export {initializeTestDb, insertTestUser,getToken}





import fs from 'fs';
import path from 'path';
import { pool } from './db.js';
import bcrypt from 'bcrypt';
import pkg from 'jsonwebtoken'; // Default import
const { sign } = pkg; // Destructure to get `sign`

// Correctly derive __dirname in ES modules
const __dirname = path.resolve();

// Function to initialize the test database
// const initializeTestDb = () => {
//     const sql = fs.readFileSync(path.resolve(__dirname, "../todo.sql"), "utf8");
//     pool.query(sql)
//         .then(() => console.log("Database initialized successfully."))
//         .catch(err => console.error("Error initializing database:", err));
// };

const initializeTestDb = () => {
    const sqlFilePath = path.resolve(__dirname, "./todo.sql");
    if (!fs.existsSync(sqlFilePath)) {
        console.error(`SQL file not found: ${sqlFilePath}`);
        return; // Exit early if the file doesn't exist
    }

    const sql = fs.readFileSync(sqlFilePath, "utf8");
    pool.query(sql)
        .then(() => console.log("Database initialized successfully."))
        .catch(err => console.error("Error initializing database:", err));
};


// Function to insert a test user
// const insertTestUser = async (email, password) => {
//     try {
//         const hashedPassword = await bcrypt.hash(password, 10); // Use bcrypt.hash with promises
//         await pool.query('INSERT INTO account (email, password) VALUES ($1, $2)', [email, hashedPassword]);
//         console.log(`User ${email} inserted successfully.`);
//     } catch (error) {
//         console.error("Error inserting user:", error);
//     }
// };

const insertTestUser = async (email, password) => {
    try {
        // Check if the user already exists
        const result = await pool.query('SELECT * FROM account WHERE email = $1', [email]);
        if (result.rows.length > 0) {
            console.log(`User ${email} already exists. Skipping insertion.`);
            return; // Skip inserting the user
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        await pool.query('INSERT INTO account (email, password) VALUES ($1, $2)', [email, hashedPassword]);
        console.log(`User ${email} inserted successfully.`);
    } catch (error) {
        console.error("Error inserting user:", error);
    }
};


// Function to get a token
const getToken = (email) => {
    return sign({ user: email }, process.env.JWT_SECRET_KEY);
};

// Export the functions
export { initializeTestDb, insertTestUser, getToken };
