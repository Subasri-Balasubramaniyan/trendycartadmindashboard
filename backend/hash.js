// hash.js (ES Module)
import bcrypt from 'bcryptjs';

const plainPassword = 'admin123';

const hashPassword = async () => {
  const hashed = await bcrypt.hash(plainPassword, 10);
  console.log('Hashed password:', hashed);
};

hashPassword();
