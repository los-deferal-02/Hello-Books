import bycrpt from 'bcrypt';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

export default class encrypt {
  static encryptPassword(password) {
    return bycrpt.hash(password, 10);
  }

  static decryptPassword(inputPassword, encryptedPassword) {
    return bycrpt.compare(inputPassword, encryptedPassword);
  }

  static generateToken(user) {
    const payload = { id: user.id, email: user.email, role: user.role };
    const token = jwt.sign(payload,
      process.env.JWT_SECRET, { expiresIn: '24h' });
    return token;
  }
}
