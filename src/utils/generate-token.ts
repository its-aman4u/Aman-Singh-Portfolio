import jwt from 'jsonwebtoken';
import { config } from 'dotenv';

// Load environment variables
config();

const JWT_SECRET = process.env.JWT_SECRET;
const ADMIN_USERNAME = process.env.ADMIN_USERNAME;

if (!JWT_SECRET) {
  console.error('JWT_SECRET is not set in environment variables');
  process.exit(1);
}

if (!ADMIN_USERNAME) {
  console.error('ADMIN_USERNAME is not set in environment variables');
  process.exit(1);
}

const token = jwt.sign(
  { 
    username: ADMIN_USERNAME,
    role: 'admin',
    iat: Math.floor(Date.now() / 1000),
    exp: Math.floor(Date.now() / 1000) + (24 * 60 * 60) // 24 hours
  }, 
  JWT_SECRET
);

console.log('\nGenerated JWT Token (valid for 24 hours):');
console.log('\n' + token + '\n');
console.log('Use this token in the Admin Token field of the test chat interface.');
