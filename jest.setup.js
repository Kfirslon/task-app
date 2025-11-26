const dotenv = require("dotenv");
const path = require("path");
const fs = require("fs");

// Build absolute path manually
const envPath = path.join(__dirname, "tests", ".env.test");

// For debugging
console.log("Env path trying to load:", envPath);
console.log("File exists:", fs.existsSync(envPath));

dotenv.config({ path: envPath });

console.log("Loaded NEXT_PUBLIC_SUPABASE_URL =", process.env.NEXT_PUBLIC_SUPABASE_URL);
