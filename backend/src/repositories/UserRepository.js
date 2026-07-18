const User = require('../models/User');
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const dataDir = path.join(__dirname, '../../data');
const userFilePath = path.join(dataDir, 'users.json');

// Ensure data folder and file exists for JSON fallback
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}
if (!fs.existsSync(userFilePath)) {
  fs.writeFileSync(userFilePath, JSON.stringify([]));
}

class MongoUserRepository {
  async create(userData) {
    const user = new User(userData);
    const savedUser = await user.save();
    return savedUser.toObject();
  }

  async findByEmail(email) {
    const user = await User.findOne({ email });
    return user ? user.toObject() : null;
  }

  async findById(id) {
    const user = await User.findById(id);
    return user ? user.toObject() : null;
  }
}

class JsonUserRepository {
  constructor() {
    this.filePath = userFilePath;
  }

  _read() {
    try {
      const data = fs.readFileSync(this.filePath, 'utf8');
      return JSON.parse(data);
    } catch (e) {
      return [];
    }
  }

  _write(data) {
    fs.writeFileSync(this.filePath, JSON.stringify(data, null, 2));
  }

  async create(userData) {
    const users = this._read();
    
    // Check uniqueness (case-insensitive)
    const normalizedEmail = userData.email.toLowerCase();
    if (users.some(u => u.email.toLowerCase() === normalizedEmail)) {
      throw new Error('User already exists');
    }

    const newUser = {
      _id: crypto.randomUUID(),
      email: normalizedEmail,
      password: userData.password,
      name: userData.name,
      createdAt: new Date()
    };
    
    users.push(newUser);
    this._write(users);
    return newUser;
  }

  async findByEmail(email) {
    const users = this._read();
    return users.find(u => u.email.toLowerCase() === email.toLowerCase()) || null;
  }

  async findById(id) {
    const users = this._read();
    return users.find(u => String(u._id) === String(id)) || null;
  }
}

module.exports = { MongoUserRepository, JsonUserRepository };
