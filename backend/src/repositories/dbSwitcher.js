const { MongoUserRepository, JsonUserRepository } = require('./UserRepository');
const { MongoTaskRepository, JsonTaskRepository } = require('./TaskRepository');
const mongoose = require('mongoose');

let userRepository;
let taskRepository;
let activeDatabaseType = 'json';

function initializeDatabase() {
  const dbType = (process.env.DB_TYPE || '').toLowerCase();
  const mongoUri = process.env.MONGO_URI;

  if ((dbType === 'mongodb' || (!dbType && mongoUri)) && mongoUri) {
    console.log('Starting MongoDB connection attempt...');
    
    // Configure connection settings
    mongoose.connect(mongoUri, {
      serverSelectionTimeoutMS: 5000 // 5 seconds timeout
    })
    .then(() => {
      console.log('Database Status: Connected to MongoDB successfully.');
      activeDatabaseType = 'mongodb';
      userRepository = new MongoUserRepository();
      taskRepository = new MongoTaskRepository();
    })
    .catch((err) => {
      console.error(`Database Status: MongoDB connection failed (${err.message}). Falling back to JSON database.`);
      useJsonFallback();
    });
  } else {
    console.log('Database Status: Configured for JSON database or MONGO_URI was omitted. Launching JSON storage.');
    useJsonFallback();
  }
}

function useJsonFallback() {
  activeDatabaseType = 'json';
  userRepository = new JsonUserRepository();
  taskRepository = new JsonTaskRepository();
  console.log('Database Status: Local JSON file database initialized. Data is stored in backend/data/.');
}

module.exports = {
  initializeDatabase,
  get UserRepository() {
    if (!userRepository) {
      useJsonFallback();
    }
    return userRepository;
  },
  get TaskRepository() {
    if (!taskRepository) {
      useJsonFallback();
    }
    return taskRepository;
  },
  get databaseType() {
    return activeDatabaseType;
  }
};
